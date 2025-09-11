import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Gmail SMTP configuration using the user's credentials
const GMAIL_USER = Deno.env.get('YAGMAIL_USER')!;
const GMAIL_PASS = Deno.env.get('YAGMAIL_PASS')!;

interface GmailRequest {
  to: string[];
  subject: string;
  body: string;
  type: 'announcement' | 'news' | 'event' | 'exam_result' | 'general';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, body, type }: GmailRequest = await req.json();

    console.log(`Sending Gmail to ${to.length} recipients about ${type}`, {
      gmailUser: GMAIL_USER,
      recipientCount: to.length
    });

    // Validate Gmail credentials
    if (!GMAIL_USER || !GMAIL_PASS) {
      throw new Error('Gmail credentials not configured. Please add YAGMAIL_USER and YAGMAIL_PASS secrets.');
    }

    // Create email content with proper formatting
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">EMRS Dornala Notification</h1>
        </div>
        <div style="padding: 20px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 15px;">${subject}</h2>
          <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            ${body.replace(/\n/g, '<br>')}
          </div>
          <div style="margin-top: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>This email was sent from EMRS Dornala - School Management System</p>
            <p>© 2024 EMRS Dornala. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;

    // Configure Gmail SMTP client
    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 587,
        tls: true,
        auth: {
          username: GMAIL_USER,
          password: GMAIL_PASS,
        },
      },
    });

    const results = [];
    
    try {
      // Connect to Gmail SMTP
      await client.connect();
      console.log('Connected to Gmail SMTP server');

      // Send emails individually for better error handling
      for (const email of to) {
        try {
          await client.send({
            from: GMAIL_USER,
            to: email,
            subject: subject,
            content: emailContent,
            html: emailContent,
          });

          results.push({
            email,
            status: 'sent',
            timestamp: new Date().toISOString()
          });

          // Log successful email to database
          try {
            await supabase.from('notifications').insert({
              user_id: '00000000-0000-0000-0000-000000000000', // System user
              type: `email_${type}`,
              title: subject,
              message: `Email sent to ${email}`,
              status: 'sent',
              data: { email, type, subject }
            });
          } catch (dbError) {
            console.warn('Failed to log notification to database:', dbError);
          }

          console.log(`Successfully sent email to ${email}`);
        } catch (emailError) {
          console.error(`Failed to send email to ${email}:`, emailError);
          results.push({
            email,
            status: 'failed',
            error: emailError.message,
            timestamp: new Date().toISOString()
          });
        }
      }

      // Close SMTP connection
      await client.close();
      console.log('Gmail SMTP connection closed');

    } catch (smtpError) {
      console.error('SMTP connection error:', smtpError);
      
      // Close connection if it was opened
      try {
        await client.close();
      } catch (closeError) {
        console.warn('Error closing SMTP connection:', closeError);
      }

      // Mark all emails as failed if SMTP connection fails
      for (const email of to) {
        results.push({
          email,
          status: 'failed',
          error: `SMTP connection failed: ${smtpError.message}`,
          timestamp: new Date().toISOString()
        });
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      results,
      message: `Gmail sent to ${to.length} recipients` 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-gmail function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);