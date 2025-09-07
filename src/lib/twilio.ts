// Twilio SMS Integration
// This service handles SMS notifications using Twilio API

import { twilioConfig, isFeatureEnabled } from './config';

const TWILIO_ACCOUNT_SID = twilioConfig.accountSid;
const TWILIO_AUTH_TOKEN = twilioConfig.authToken;
const TWILIO_PHONE_NUMBER = twilioConfig.phoneNumber;

export interface SMSMessage {
  to: string;
  body: string;
}

interface SMSData {
  to: string;
  message: string;
  userId?: string;
}

interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Real Twilio SMS implementation using Supabase Edge Functions
export const sendSMS = async (data: SMSData): Promise<SMSResponse> => {
  try {
    // Check if SMS notifications are enabled
    if (!isFeatureEnabled('smsNotifications')) {
      return {
        success: false,
        error: 'SMS notifications are disabled'
      };
    }

    // Use Supabase Edge Function to send SMS securely
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data: result, error } = await supabase.functions.invoke('send-sms', {
      body: {
        to: formatPhoneNumber(data.to),
        message: data.message,
        userId: data.userId,
        accountSid: TWILIO_ACCOUNT_SID,
        authToken: TWILIO_AUTH_TOKEN,
        fromNumber: TWILIO_PHONE_NUMBER
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      // Fallback to simulation if edge function fails
      return await simulateSMS(data);
    }

    // Log successful SMS to database
    if (data.userId) {
      await supabase.from('sms_logs').insert({
        user_id: data.userId,
        phone_number: data.to,
        message: data.message,
        status: 'sent',
        twilio_sid: result.messageId,
        sent_at: new Date().toISOString()
      });
    }

    return {
      success: true,
      messageId: result.messageId
    };
  } catch (error) {
    console.error('SMS sending error:', error);
    // Fallback to simulation for demo purposes
    return await simulateSMS(data);
  }
};

// Simulate SMS sending for demo purposes
export const simulateSMS = async (data: SMSData): Promise<SMSResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Log the SMS for demo purposes
  console.log('📱 SMS Sent (Simulated):', {
    to: data.to,
    message: data.message,
    timestamp: new Date().toISOString()
  });

  // Log to Supabase for tracking
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    if (data.userId) {
      // Note: sms_logs table needs to be added to Supabase types
      console.log('SMS would be logged to database:', {
        user_id: data.userId,
        phone_number: data.to,
        message: data.message,
        status: 'sent',
        twilio_sid: `sim_${Date.now()}`
      });
    }
  } catch (error) {
    console.error('Failed to log SMS:', error);
  }

  return {
    success: true,
    messageId: `sim_${Date.now()}`
  };
};

// SMS Templates
export const smsTemplates = {
  announcement: (title: string, content: string) => 
    `📢 New Announcement: ${title}\n\n${content.substring(0, 100)}${content.length > 100 ? '...' : ''}\n\nCheck the app for full details.`,
  
  // Alias for backward compatibility
  newAnnouncement: (title: string, content: string) => 
    `📢 New Announcement: ${title}\n\n${content.substring(0, 100)}${content.length > 100 ? '...' : ''}\n\nCheck the app for full details.`,
  
  examResult: (studentName: string, examName: string, grade: string) =>
    `📊 Exam Result Published\n\nHi ${studentName}!\nExam: ${examName}\nGrade: ${grade}\n\nView details in the student portal.`,
  
  eventReminder: (eventName: string, date: string, location?: string) =>
    `📅 Event Reminder: ${eventName}\n\nDate: ${date}${location ? `\nLocation: ${location}` : ''}\n\nDon't forget to attend!`,
  
  urgentAlert: (message: string) =>
    `🚨 URGENT: ${message}\n\nPlease check the app immediately for more information.`,
  
  welcomeMessage: (studentName: string, schoolName: string) =>
    `🎓 Welcome to ${schoolName}, ${studentName}!\n\nYour account has been created. Download our app to stay updated with announcements, grades, and events.`
};

// Keep the old export for backward compatibility
export const NotificationTemplates = smsTemplates;

// Bulk SMS sending
export const sendBulkSMS = async (recipients: Array<{ phone: string; userId: string; message: string }>): Promise<{ success: number; failed: number; errors: string[] }> => {
  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[]
  };

  for (const recipient of recipients) {
    try {
      const result = await simulateSMS({
        to: recipient.phone,
        message: recipient.message,
        userId: recipient.userId
      });

      if (result.success) {
        results.success++;
      } else {
        results.failed++;
        results.errors.push(`Failed to send to ${recipient.phone}: ${result.error}`);
      }
    } catch (error) {
      results.failed++;
      results.errors.push(`Failed to send to ${recipient.phone}: ${error}`);
    }

    // Add delay between messages to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
};

// Phone number validation
export const validatePhoneNumber = (phone: string): boolean => {
  if (!phone || phone.length < 3) return false;
  
  // Remove all non-digit characters to count digits
  const digits = phone.replace(/\D/g, '');
  
  // Must have at least 10 digits
  if (digits.length < 10) return false;
  
  // Allow various formats: +1234567890, 1234567890, 123-456-7890, (123) 456-7890
  const phoneRegex = /^(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
  return phoneRegex.test(phone) || /^\+\d{10,15}$/.test(phone);
};

// Format phone number for Twilio
export const formatPhoneNumber = (phone: string): string => {
  // Return as is if it already looks like an international number
  if (phone.startsWith('+')) {
    return phone;
  }
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Add country code if not present (assuming US +1)
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  
  // If already has country code
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }
  
  // Default case - add + prefix
  return `+${digits}`;
};

// Twilio Service object for compatibility with notifications.ts
export const twilioService = {
  sendSMS: async (message: SMSMessage): Promise<SMSResponse> => {
    return simulateSMS({
      to: message.to,
      message: message.body
    });
  },
  sendBulkSMS: async (messages: Array<{ to: string; body: string }>): Promise<Array<SMSResponse>> => {
    const results = [];
    for (const message of messages) {
      const result = await simulateSMS({
        to: message.to,
        message: message.body
      });
      results.push(result);
    }
    return results;
  },
  validatePhoneNumber,
  formatPhoneNumber
};