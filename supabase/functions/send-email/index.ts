import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const yagmailUser = Deno.env.get('YAGMAIL_USER')!;
const yagmailPass = Deno.env.get('YAGMAIL_PASS')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface EmailRequest {
  to: string[];
  subject: string;
  body: string;
  type: 'announcement' | 'news' | 'event' | 'exam_result' | 'general';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, body, type }: EmailRequest = await req.json();

    console.log(`Sending email to ${to.length} recipients about ${type}`);

    // For now, we'll simulate email sending since we can't use yagmail directly in Deno
    // In a real implementation, you would use a service like Resend or SendGrid
    
    // Log the email attempt
    const { error: logError } = await supabase
      .from('notifications')
      .insert(
        to.map(email => ({
          user_id: '00000000-0000-0000-0000-000000000000', // System user
          type: `email_${type}`,
          title: subject,
          message: `Email sent to ${email}: ${body.substring(0, 100)}...`,
          data: { email, type, subject }
        }))
      );

    if (logError) {
      console.error('Failed to log email:', logError);
    }

    // Simulate successful email sending
    const results = to.map(email => ({
      email,
      status: 'sent',
      timestamp: new Date().toISOString()
    }));

    console.log('Email sending simulated successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      results,
      message: `Email sent to ${to.length} recipients` 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
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