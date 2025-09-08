// Notification Service
// Handles all types of notifications including SMS, email, and in-app notifications

import { supabase } from '@/integrations/supabase/client';
import { twilioService, smsTemplates, type SMSMessage } from './twilio';
import type { Database } from '@/integrations/supabase/types';

type NotificationType = 'sms' | 'email' | 'push' | 'in_app';
type NotificationStatus = 'pending' | 'sent' | 'failed' | 'delivered';

export interface NotificationData {
  type: NotificationType;
  title: string;
  message: string;
  userId: string;
  data?: Record<string, any>;
  priority?: 'low' | 'medium' | 'high';
}

export interface BulkNotificationData {
  type: NotificationType;
  title: string;
  message: string;
  userIds: string[];
  data?: Record<string, any>;
  priority?: 'low' | 'medium' | 'high';
}

class NotificationService {
  /**
   * Send a single notification
   */
  async sendNotification(notification: NotificationData): Promise<boolean> {
    try {
      // Create notification record in database
      const { data: notificationRecord, error: dbError } = await supabase
        .from('notifications')
        .insert({
          user_id: notification.userId,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          status: 'pending',
          data: notification.data || null,
        })
        .select()
        .single();

      if (dbError) {
        console.error('Failed to create notification record:', dbError);
        return false;
      }

      // Send notification based on type
      let success = false;
      switch (notification.type) {
        case 'sms':
          success = await this.sendSMSNotification(notification);
          break;
        case 'email':
          success = await this.sendEmailNotification(notification);
          break;
        case 'in_app':
          success = true; // Already created in database
          break;
        default:
          console.error('Unsupported notification type:', notification.type);
          return false;
      }

      // Update notification status
      await this.updateNotificationStatus(
        notificationRecord.id,
        success ? 'sent' : 'failed'
      );

      return success;
    } catch (error) {
      console.error('Failed to send notification:', error);
      return false;
    }
  }

  /**
   * Send bulk notifications
   */
  async sendBulkNotifications(notification: BulkNotificationData): Promise<{
    success: number;
    failed: number;
    total: number;
  }> {
    const results = await Promise.allSettled(
      notification.userIds.map(userId => 
        this.sendNotification({
          ...notification,
          userId,
        })
      )
    );

    const success = results.filter(result => 
      result.status === 'fulfilled' && result.value === true
    ).length;
    const failed = results.length - success;

    return {
      success,
      failed,
      total: results.length,
    };
  }

  /**
   * Send SMS notification
   */
  private async sendSMSNotification(notification: NotificationData): Promise<boolean> {
    try {
      // Get user's phone number
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('phone')
        .eq('user_id', notification.userId)
        .single();

      if (profileError || !profile?.phone) {
        console.error('User phone number not found:', profileError);
        return false;
      }

      // Format phone number
      const formattedPhone = twilioService.formatPhoneNumber(profile.phone);
      if (!twilioService.validatePhoneNumber(formattedPhone)) {
        console.error('Invalid phone number format:', profile.phone);
        return false;
      }

      // Send SMS
      const smsMessage: SMSMessage = {
        to: formattedPhone,
        body: notification.message,
      };

      const result = await twilioService.sendSMS(smsMessage);
      
      // Log SMS attempt
      await this.logSMSAttempt(notification.userId, formattedPhone, notification.message, result);

      return result.success;
    } catch (error) {
      console.error('SMS notification failed:', error);
      return false;
    }
  }

  /**
   * Send email notification using Gmail
   */
  private async sendEmailNotification(notification: NotificationData): Promise<boolean> {
    try {
      // Get user's email from auth.users
      const { data: { user } } = await supabase.auth.admin.getUserById(notification.userId);
      
      if (!user?.email) {
        console.error('User email not found');
        return false;
      }

      // Send email using Gmail service
      const { gmailService } = await import('./gmail');
      const result = await gmailService.sendEmail({
        to: [user.email],
        subject: notification.title,
        body: notification.message,
        type: 'general'
      });
      
      return result.success;
    } catch (error) {
      console.error('Email notification failed:', error);
      return false;
    }
  }

  /**
   * Update notification status
   */
  private async updateNotificationStatus(
    notificationId: string,
    status: NotificationStatus
  ): Promise<void> {
    try {
      await supabase
        .from('notifications')
        .update({ status })
        .eq('id', notificationId);
    } catch (error) {
      console.error('Failed to update notification status:', error);
    }
  }

  /**
   * Log SMS attempt
   */
  private async logSMSAttempt(
    userId: string,
    phoneNumber: string,
    message: string,
    result: { success: boolean; messageId?: string; error?: string }
  ): Promise<void> {
    try {
      // Note: sms_logs table needs to be added to Supabase types
      console.log('SMS attempt would be logged:', {
        user_id: userId,
        phone_number: phoneNumber,
        message,
        status: result.success ? 'sent' : 'failed',
        twilio_sid: result.messageId || null,
        error_message: result.error || null,
      });
    } catch (error) {
      console.error('Failed to log SMS attempt:', error);
    }
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId: string, limit = 50): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Failed to fetch notifications:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      return [];
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Failed to mark notification as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      return false;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) {
        console.error('Failed to mark all notifications as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      return false;
    }
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) {
        console.error('Failed to get unread count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Failed to get unread count:', error);
      return 0;
    }
  }

  /**
   * Send exam result notification
   */
  async sendExamResultNotification(
    studentId: string,
    examName: string,
    grade: string,
    studentName?: string
  ): Promise<boolean> {
    const message = smsTemplates.examResult(
      studentName || 'Student',
      examName,
      grade
    );

    return this.sendNotification({
      type: 'sms',
      title: 'Exam Result Available',
      message,
      userId: studentId,
      data: { examName, grade, type: 'exam_result' },
      priority: 'high',
    });
  }

  /**
   * Send announcement notification
   */
  async sendAnnouncementNotification(
    userIds: string[],
    title: string,
    content: string
  ): Promise<{ success: number; failed: number; total: number }> {
    const message = smsTemplates.announcement(title, content);

    return this.sendBulkNotifications({
      type: 'sms',
      title: 'School Announcement',
      message,
      userIds,
      data: { title, content, type: 'announcement' },
      priority: 'medium',
    });
  }

  /**
   * Send event reminder notification
   */
  async sendEventReminderNotification(
    userIds: string[],
    eventTitle: string,
    eventDate: string,
    location?: string
  ): Promise<{ success: number; failed: number; total: number }> {
    const message = smsTemplates.eventReminder(eventTitle, eventDate, location);

    return this.sendBulkNotifications({
      type: 'sms',
      title: 'Event Reminder',
      message,
      userIds,
      data: { eventTitle, eventDate, location, type: 'event_reminder' },
      priority: 'medium',
    });
  }
}

// Create singleton instance
export const notificationService = new NotificationService();

export default notificationService;
