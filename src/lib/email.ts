// Email Service
// Handles email sending using various providers (Resend, EmailJS, Gmail SMTP)

import { emailConfig } from './config';

export interface EmailMessage {
  to: string | string[];
  subject: string;
  body: string;
  html?: string;
  type?: 'announcement' | 'news' | 'event' | 'exam_result' | 'general';
}

export interface EmailResponse {
  success: boolean;
  results: Array<{
    email: string;
    status: 'sent' | 'failed';
    error?: string;
    timestamp: string;
  }>;
  message: string;
}

class EmailService {
  private config = emailConfig;

  /**
   * Send email using the configured email service
   */
  async sendEmail(message: EmailMessage): Promise<EmailResponse> {
    const recipients = Array.isArray(message.to) ? message.to : [message.to];
    
    try {
      switch (this.config.service) {
        case 'resend':
          return await this.sendViaResend(message);
        case 'emailjs':
          return await this.sendViaEmailJS(message);
        case 'gmail':
          return await this.sendViaGmail(message);
        case 'smtp':
          return await this.sendViaSMTP(message);
        default:
          throw new Error(`Unsupported email service: ${this.config.service}`);
      }
    } catch (error) {
      console.error('Email sending error:', error);
      return {
        success: false,
        results: recipients.map(email => ({
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
   * Send email via Resend API
   */
  private async sendViaResend(message: EmailMessage): Promise<EmailResponse> {
    if (!this.config.resendApiKey) {
      throw new Error('Resend API key not configured');
    }

    const recipients = Array.isArray(message.to) ? message.to : [message.to];
    const results = [];

    for (const email of recipients) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'EMRS Dornala <noreply@emrs-dornala.edu.in>',
            to: email,
            subject: message.subject,
            html: message.html || this.formatEmailHTML(message.body, message.subject),
          }),
        });

        const responseData = await response.json();

        if (response.ok) {
          results.push({
            email,
            status: 'sent',
            timestamp: new Date().toISOString()
          });
        } else {
          results.push({
            email,
            status: 'failed',
            error: responseData.message || 'Resend API error',
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        results.push({
          email,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        });
      }
    }

    const successCount = results.filter(r => r.status === 'sent').length;
    const failureCount = results.filter(r => r.status === 'failed').length;

    return {
      success: failureCount === 0,
      results,
      message: `Email sent: ${successCount} successful, ${failureCount} failed`
    };
  }

  /**
   * Send email via EmailJS
   */
  private async sendViaEmailJS(message: EmailMessage): Promise<EmailResponse> {
    if (!this.config.emailjsUserId) {
      throw new Error('EmailJS user ID not configured');
    }

    const recipients = Array.isArray(message.to) ? message.to : [message.to];
    const results = [];

    for (const email of recipients) {
      try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_id: this.config.emailjsServiceId || 'gmail',
            template_id: this.config.emailjsTemplateId || 'template_emrs',
            user_id: this.config.emailjsUserId,
            template_params: {
              to_email: email,
              subject: message.subject,
              message: message.html || message.body,
              from_name: 'EMRS Dornala',
              reply_to: this.config.gmailUser || 'noreply@emrs-dornala.edu.in'
            }
          }),
        });

        if (response.ok) {
          results.push({
            email,
            status: 'sent',
            timestamp: new Date().toISOString()
          });
        } else {
          const errorText = await response.text();
          results.push({
            email,
            status: 'failed',
            error: `EmailJS error: ${errorText}`,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        results.push({
          email,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        });
      }
    }

    const successCount = results.filter(r => r.status === 'sent').length;
    const failureCount = results.filter(r => r.status === 'failed').length;

    return {
      success: failureCount === 0,
      results,
      message: `Email sent: ${successCount} successful, ${failureCount} failed`
    };
  }

  /**
   * Send email via Gmail SMTP (simulation)
   */
  private async sendViaGmail(message: EmailMessage): Promise<EmailResponse> {
    const recipients = Array.isArray(message.to) ? message.to : [message.to];
    
    // For now, simulate Gmail sending since we can't use SMTP directly in the browser
    // In a real implementation, this would be handled by a backend service
    const results = recipients.map(email => ({
      email,
      status: 'sent' as const,
      timestamp: new Date().toISOString()
    }));

    console.log('Gmail email simulation:', {
      to: recipients,
      subject: message.subject,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      results,
      message: `Gmail simulation: ${recipients.length} emails processed`
    };
  }

  /**
   * Send email via SMTP (simulation)
   */
  private async sendViaSMTP(message: EmailMessage): Promise<EmailResponse> {
    const recipients = Array.isArray(message.to) ? message.to : [message.to];
    
    // For now, simulate SMTP sending since we can't use SMTP directly in the browser
    const results = recipients.map(email => ({
      email,
      status: 'sent' as const,
      timestamp: new Date().toISOString()
    }));

    console.log('SMTP email simulation:', {
      to: recipients,
      subject: message.subject,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      results,
      message: `SMTP simulation: ${recipients.length} emails processed`
    };
  }

  /**
   * Format email body as HTML
   */
  private formatEmailHTML(body: string, subject: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">EMRS Dornala</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Eklavya Model Residential School</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px 20px;">
            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">${subject}</h2>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
              ${body.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
            <p style="color: #666; margin: 0 0 10px 0; font-size: 12px;">
              This email was sent from EMRS Dornala School Management System
            </p>
            <p style="color: #999; margin: 0; font-size: 11px;">
              © 2024 EMRS Dornala. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Test email service configuration
   */
  async testConfiguration(): Promise<{ success: boolean; message: string; service: string }> {
    try {
      const service = this.config.service;
      
      switch (service) {
        case 'resend':
          if (!this.config.resendApiKey) {
            return { success: false, message: 'Resend API key not configured', service };
          }
          return { success: true, message: 'Resend API configured', service };
          
        case 'emailjs':
          if (!this.config.emailjsUserId) {
            return { success: false, message: 'EmailJS user ID not configured', service };
          }
          return { success: true, message: 'EmailJS configured', service };
          
        case 'gmail':
          if (!this.config.gmailUser || !this.config.gmailPass) {
            return { success: false, message: 'Gmail credentials not configured', service };
          }
          return { success: true, message: 'Gmail configured', service };
          
        case 'smtp':
          if (!this.config.smtpHost || !this.config.smtpUser || !this.config.smtpPass) {
            return { success: false, message: 'SMTP configuration incomplete', service };
          }
          return { success: true, message: 'SMTP configured', service };
          
        default:
          return { success: false, message: `Unknown email service: ${service}`, service };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error', 
        service: this.config.service 
      };
    }
  }
}

// Create singleton instance
export const emailService = new EmailService();

// Export types and service
export default emailService;
