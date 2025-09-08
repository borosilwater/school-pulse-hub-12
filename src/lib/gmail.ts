// Gmail Service for sending emails directly
// Uses the provided Gmail credentials to send emails to students

import { supabase } from '@/integrations/supabase/client';

const GMAIL_USER = 'daredevil9654@gmail.com';
const GMAIL_PASS = 'woevsfxjorkxxtnu';

export interface GmailMessage {
  to: string[];
  subject: string;
  body: string;
  type?: 'announcement' | 'news' | 'event' | 'exam_result' | 'general';
}

interface GmailResponse {
  success: boolean;
  results: Array<{
    email: string;
    status: 'sent' | 'failed';
    error?: string;
    timestamp: string;
  }>;
  message: string;
}

class GmailService {
  /**
   * Send email using Gmail SMTP
   */
  async sendEmail(message: GmailMessage): Promise<GmailResponse> {
    try {
      // Use Supabase Edge Function to send bulk email
      const { data: result, error } = await supabase.functions.invoke('send-bulk-email', {
        body: {
          to: message.to,
          subject: message.subject,
          body: message.body,
          type: message.type || 'general'
        }
      });

      if (error) {
        console.error('Gmail function error:', error);
        return {
          success: false,
          results: message.to.map(email => ({
            email,
            status: 'failed' as const,
            error: error.message,
            timestamp: new Date().toISOString()
          })),
          message: 'Failed to send emails'
        };
      }

      return result;
    } catch (error) {
      console.error('Gmail sending error:', error);
      return {
        success: false,
        results: message.to.map(email => ({
          email,
          status: 'failed' as const,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        })),
        message: 'Failed to send emails'
      };
    }
  }

  /**
   * Send bulk emails to multiple recipients
   */
  async sendBulkEmail(messages: GmailMessage[]): Promise<GmailResponse[]> {
    const results = [];
    
    for (const message of messages) {
      const result = await this.sendEmail(message);
      results.push(result);
      
      // Add delay between emails to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return results;
  }

  /**
   * Send announcement email to all students and teachers
   */
  async sendAnnouncementEmail(title: string, content: string): Promise<GmailResponse> {
    try {
      // Get all student and teacher emails
      const { data: profiles } = await supabase
        .from('profiles')
        .select('full_name, user_id')
        .in('role', ['student', 'teacher']);

      if (!profiles || profiles.length === 0) {
        return {
          success: false,
          results: [],
          message: 'No recipients found'
        };
      }

      // Get user emails from auth.users
      const { data: users } = await supabase.auth.admin.listUsers();
      const userEmails = users.users
        .filter(user => profiles.some(p => p.user_id === user.id))
        .map(user => user.email)
        .filter(Boolean) as string[];

      return this.sendEmail({
        to: userEmails,
        subject: `School Announcement: ${title}`,
        body: `
          <h2>New School Announcement</h2>
          <h3>${title}</h3>
          <p>${content}</p>
          <hr>
          <p><em>This is an automated message from your school's notification system.</em></p>
        `,
        type: 'announcement'
      });
    } catch (error) {
      console.error('Failed to send announcement email:', error);
      return {
        success: false,
        results: [],
        message: 'Failed to send announcement email'
      };
    }
  }

  /**
   * Send exam result email to student
   */
  async sendExamResultEmail(
    studentEmail: string,
    studentName: string,
    examName: string,
    subject: string,
    grade: string,
    marks: number,
    totalMarks: number
  ): Promise<GmailResponse> {
    const percentage = Math.round((marks / totalMarks) * 100);
    
    return this.sendEmail({
      to: [studentEmail],
      subject: `Exam Result: ${examName} - ${subject}`,
      body: `
        <h2>Exam Result Published</h2>
        <p>Dear ${studentName},</p>
        <p>Your exam result for <strong>${examName}</strong> in <strong>${subject}</strong> has been published.</p>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3>Result Details:</h3>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Exam:</strong> ${examName}</li>
            <li><strong>Subject:</strong> ${subject}</li>
            <li><strong>Marks Obtained:</strong> ${marks}/${totalMarks}</li>
            <li><strong>Percentage:</strong> ${percentage}%</li>
            <li><strong>Grade:</strong> ${grade}</li>
          </ul>
        </div>
        
        <p>Please log in to your student portal to view detailed results.</p>
        <p>Best regards,<br>School Administration</p>
      `,
      type: 'exam_result'
    });
  }

  /**
   * Send event notification email
   */
  async sendEventEmail(
    title: string,
    description: string,
    eventDate: string,
    location?: string
  ): Promise<GmailResponse> {
    try {
      // Get all student and teacher emails
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id')
        .in('role', ['student', 'teacher']);

      if (!profiles || profiles.length === 0) {
        return {
          success: false,
          results: [],
          message: 'No recipients found'
        };
      }

      const { data: users } = await supabase.auth.admin.listUsers();
      const userEmails = users.users
        .filter(user => profiles.some(p => p.user_id === user.id))
        .map(user => user.email)
        .filter(Boolean) as string[];

      return this.sendEmail({
        to: userEmails,
        subject: `School Event: ${title}`,
        body: `
          <h2>New School Event</h2>
          <h3>${title}</h3>
          <p><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
          ${location ? `<p><strong>Location:</strong> ${location}</p>` : ''}
          <p><strong>Description:</strong></p>
          <p>${description}</p>
          <hr>
          <p><em>Please mark your calendar and don't miss this event!</em></p>
        `,
        type: 'event'
      });
    } catch (error) {
      console.error('Failed to send event email:', error);
      return {
        success: false,
        results: [],
        message: 'Failed to send event email'
      };
    }
  }
}

// Create singleton instance
export const gmailService = new GmailService();

export default gmailService;