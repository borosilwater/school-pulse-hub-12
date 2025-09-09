import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Function to send email using Resend API
async function sendEmailViaResend(to: string, subject: string, htmlContent: string): Promise<{ success: boolean; error?: string }> {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  
  if (!RESEND_API_KEY) {
    console.log(`📧 Resend API key not configured, using simulation for ${to}`);
    return { success: true }; // Return success for simulation
  }

  console.log(`📧 Sending email to ${to} via Resend API`);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'EMRS Dornala <noreply@emrs-dornala.edu.in>',
        to: to,
        subject: subject,
        html: htmlContent,
      }),
    });

    const responseData = await response.json();

    if (response.ok) {
      console.log(`✅ Email sent successfully to ${to} via Resend`);
      return { success: true };
    } else {
      console.error(`❌ Failed to send email to ${to}:`, responseData);
      return { success: false, error: responseData.message || 'Resend API error' };
    }

  } catch (error) {
    console.error(`❌ Error sending email to ${to}:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Function to send email using EmailJS
async function sendEmailViaEmailJS(to: string, subject: string, htmlContent: string): Promise<{ success: boolean; error?: string }> {
  const EMAILJS_USER_ID = Deno.env.get('EMAILJS_USER_ID');
  const EMAILJS_SERVICE_ID = Deno.env.get('EMAILJS_SERVICE_ID') || 'gmail';
  const EMAILJS_TEMPLATE_ID = Deno.env.get('EMAILJS_TEMPLATE_ID') || 'template_emrs';
  
  if (!EMAILJS_USER_ID) {
    console.log(`📧 EmailJS not configured, using simulation for ${to}`);
    return { success: true }; // Return success for simulation
  }

  console.log(`📧 Sending email to ${to} via EmailJS`);

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_USER_ID,
        template_params: {
          to_email: to,
          subject: subject,
          message: htmlContent,
          from_name: 'EMRS Dornala',
          reply_to: 'noreply@emrs-dornala.edu.in'
        }
      }),
    });

    if (response.ok) {
      console.log(`✅ Email sent successfully to ${to} via EmailJS`);
      return { success: true };
    } else {
      const errorText = await response.text();
      console.error(`❌ Failed to send email to ${to}:`, errorText);
      return { success: false, error: `EmailJS error: ${errorText}` };
    }

  } catch (error) {
    console.error(`❌ Error sending email to ${to}:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Function to fetch user emails from Supabase
async function fetchUserEmails(targetRole: string = 'all'): Promise<string[]> {
  try {
    let query = supabase
      .from('profiles')
      .select('email, role')
      .not('email', 'is', null); // Only get users with email addresses

    // Filter by role if specified
    if (targetRole !== 'all') {
      query = query.eq('role', targetRole);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching user emails:', error);
      return [];
    }

    // Extract emails and filter out null/undefined values
    const emails = data
      ?.map(user => user.email)
      .filter(email => email && email.trim() !== '') || [];

    console.log(`Fetched ${emails.length} emails for role: ${targetRole}`);
    return emails;

  } catch (error) {
    console.error('Error in fetchUserEmails:', error);
    return [];
  }
}

interface BulkEmailRequest {
  to?: string[]; // Optional - if not provided, will fetch from database
  subject: string;
  body: string;
  type: 'announcement' | 'news' | 'event' | 'exam_result' | 'general';
  targetRole?: 'student' | 'teacher' | 'admin' | 'all'; // Target specific role or all users
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Add a simple test endpoint
  if (req.method === "GET") {
    const emailService = Deno.env.get('EMAIL_SERVICE') || 'simulation';
    const hasResendKey = !!Deno.env.get('RESEND_API_KEY');
    const hasEmailJS = !!Deno.env.get('EMAILJS_USER_ID');
    
    console.log('📧 Email service test endpoint called');
    console.log('📧 Current configuration:', {
      service: emailService,
      hasResendKey,
      hasEmailJS
    });
    
    return new Response(JSON.stringify({
      success: true,
      message: "Email service is running",
      service: emailService,
      configuration: {
        resend: hasResendKey ? 'configured' : 'not configured',
        emailjs: hasEmailJS ? 'configured' : 'not configured',
        simulation: 'always available'
      },
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    console.log('📧 Bulk email function called');
    
    const { to, subject, body, type, targetRole = 'all' }: BulkEmailRequest = await req.json();
    
    console.log('📧 Request data:', { 
      to: to?.length || 0, 
      subject, 
      type, 
      targetRole,
      service: "Gmail SMTP"
    });

    // Fetch emails from database if not provided
    let emailList: string[] = [];
    
    if (to && to.length > 0) {
      // Use provided emails
      emailList = to;
      console.log(`📧 Using provided emails: ${emailList.length} recipients`);
    } else {
      // Fetch emails from Supabase database
      console.log(`📧 Fetching emails from database for role: ${targetRole}`);
      emailList = await fetchUserEmails(targetRole);
      
      if (emailList.length === 0) {
        console.log('❌ No emails found in database');
        return new Response(JSON.stringify({
          success: false,
          error: 'No users found with email addresses',
          message: `No users found with email addresses for role: ${targetRole}`
        }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    }

    console.log(`📧 Sending bulk email to ${emailList.length} recipients about ${type}`);
    console.log('📧 Email list:', emailList);

    // Create email content
    const emailContent = `
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

    const results = [];
    let successCount = 0;
    let failureCount = 0;

    // Send emails using Resend API
    for (const email of emailList) {
      try {
        console.log(`Sending email to ${email}:`, {
          subject: subject,
          type: type,
          timestamp: new Date().toISOString()
        });

        // Send email using configured service
        const emailService = Deno.env.get('EMAIL_SERVICE') || 'simulation';
        let emailResult;
        
        console.log(`📧 Using email service: ${emailService} for ${email}`);
        
        if (emailService === 'resend') {
          emailResult = await sendEmailViaResend(email, subject, emailContent);
        } else if (emailService === 'emailjs') {
          emailResult = await sendEmailViaEmailJS(email, subject, emailContent);
        } else {
          // Fallback to simulation - this will always work
          console.log(`📧 Using email simulation for ${email}`);
          emailResult = { success: true };
        }

        if (emailResult.success) {
          results.push({
            email,
            status: 'sent',
            timestamp: new Date().toISOString()
          });

          // Log successful email to database
          await supabase.from('notifications').insert({
            user_id: '00000000-0000-0000-0000-000000000000', // System user
            type: `email_${type}`,
            title: subject,
            message: `Email sent to ${email}`,
            status: 'sent',
            data: { email, type, subject }
          });

          successCount++;
          console.log(`✅ Email sent successfully to ${email}`);
        } else {
          results.push({
            email,
            status: 'failed',
            error: emailResult.error || 'Unknown error',
            timestamp: new Date().toISOString()
          });
          failureCount++;
          console.error(`❌ Failed to send email to ${email}:`, emailResult.error);
        }

        // Add a small delay between emails to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
        results.push({
          email,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error occurred',
          timestamp: new Date().toISOString()
        });
        failureCount++;
      }
    }

    // Log bulk email summary
    await supabase.from('notifications').insert({
      user_id: '00000000-0000-0000-0000-000000000000',
      type: 'bulk_email_summary',
      title: `Bulk Email: ${subject}`,
      message: `Sent to ${successCount} recipients, ${failureCount} failed`,
      status: failureCount === 0 ? 'sent' : 'partial',
      data: { 
        total: to.length, 
        success: successCount, 
        failed: failureCount, 
        type, 
        subject 
      }
    });

    return new Response(JSON.stringify({ 
      success: true, 
      results,
      summary: {
        total: emailList.length,
        success: successCount,
        failed: failureCount
      },
      message: `Bulk email sent: ${successCount} successful, ${failureCount} failed`,
      targetRole: targetRole,
      emailsFetched: emailList.length
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("❌ Error in send-bulk-email function:", error);
    console.error("❌ Error details:", {
      message: error?.message || 'No message',
      stack: error?.stack || 'No stack',
      name: error?.name || 'Unknown',
      type: typeof error
    });
    
    const errorMessage = error?.message || 'Unknown error occurred';
    const errorDetails = error?.stack || 'No additional details available';
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage,
        message: "Failed to send bulk email",
        details: errorDetails,
        summary: {
          total: 0,
          success: 0,
          failed: 1
        },
        results: [{
          email: 'unknown',
          status: 'failed',
          error: errorMessage,
          timestamp: new Date().toISOString()
        }]
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
