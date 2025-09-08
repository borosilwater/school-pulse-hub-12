import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Email service configuration
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || 're_123456789'; // Replace with your actual Resend API key
const FROM_EMAIL = 'noreply@emrsdornala.edu.in'; // Replace with your verified domain email

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

    console.log(`Sending Gmail to ${to.length} recipients about ${type}`);

    // Create email content
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

    // Send bulk email using Resend API
    const results = [];
    
    try {
      // Send email using Resend API
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: to,
          subject: subject,
          html: emailContent,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        // All emails sent successfully
        for (const email of to) {
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
        }
        
        console.log(`Successfully sent email to ${to.length} recipients`);
      } else {
        // Handle API error
        console.error('Resend API error:', responseData);
        for (const email of to) {
          results.push({
            email,
            status: 'failed',
            error: responseData.message || 'API error',
            timestamp: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error('Failed to send bulk email:', error);
      
      // If Resend fails, fallback to individual email sending
      for (const email of to) {
        try {
          // Try sending individual email using Gmail SMTP as fallback
          const gmailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              service_id: 'gmail',
              template_id: 'template_emrs',
              user_id: 'daredevil9654@gmail.com',
              template_params: {
                to_email: email,
                subject: subject,
                message: body,
                from_name: 'EMRS Dornala'
              }
            }),
          });

          if (gmailResponse.ok) {
            results.push({
              email,
              status: 'sent',
              timestamp: new Date().toISOString()
            });
          } else {
            throw new Error('Gmail fallback failed');
          }
        } catch (fallbackError) {
          console.error(`Failed to send email to ${email}:`, fallbackError);
          results.push({
            email,
            status: 'failed',
            error: fallbackError.message,
            timestamp: new Date().toISOString()
          });
        }
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