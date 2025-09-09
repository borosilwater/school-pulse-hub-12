import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { emailService } from '@/lib/email';

const EmailTest = () => {
  const [testEmail, setTestEmail] = useState('');
  const [subject, setSubject] = useState('Test Email from EMRS Dornala');
  const [message, setMessage] = useState('This is a test email to verify the bulk email functionality is working correctly.');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const testEmailService = async () => {
    try {
      setLoading(true);
      
      console.log('🔧 Testing email service configuration...');
      
      // Test the email service configuration
      const configTest = await emailService.testConfiguration();
      console.log('🔧 Email service config test:', configTest);
      
      // Test the Supabase function
      console.log('🔧 Testing Supabase function...');
      const { data, error } = await supabase.functions.invoke('send-bulk-email', {
        method: 'GET'
      });

      console.log('🔧 Supabase function response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Supabase function error: ${error.message}`);
      }

      const serviceStatus = configTest.success ? '✅' : '❌';
      const functionStatus = data?.success ? '✅' : '❌';
      
      toast({
        title: "Service Test",
        description: `Email service: ${serviceStatus} ${configTest.service} - ${configTest.message}. Supabase function: ${functionStatus} ${data?.message || 'Unknown'}`,
        variant: configTest.success && data?.success ? "default" : "destructive"
      });
    } catch (error: any) {
      console.error('Failed to test email service:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      toast({
        title: "Service Test Failed",
        description: `Failed to test email service: ${error.message || 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendTestEmail = async () => {
    if (!testEmail || !subject || !message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      console.log('📧 Sending test email to:', testEmail);
      
      const { data, error } = await supabase.functions.invoke('send-bulk-email', {
        body: {
          to: [testEmail],
          subject: subject,
          body: message,
          type: 'general'
        }
      });

      console.log('📧 Email response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Supabase function error: ${error.message || 'Unknown error'}`);
      }

      console.log('📧 Email data received:', data);

      // Check if the response indicates success
      if (data?.success === false) {
        const errorMsg = data?.error || data?.message || 'Email sending failed';
        console.error('Email sending failed:', errorMsg);
        throw new Error(errorMsg);
      }

      const successCount = data?.summary?.success || 0;
      const failureCount = data?.summary?.failed || 0;
      
      if (failureCount === 0 && successCount > 0) {
        toast({
          title: "Success",
          description: `Test email sent successfully to ${testEmail}!`
        });
      } else if (failureCount > 0) {
        const errorDetails = data?.results?.find(r => r.status === 'failed');
        const errorMsg = errorDetails?.error || data?.error || 'Unknown error';
        console.error('Email sending failed:', errorMsg);
        toast({
          title: "Error",
          description: `Failed to send test email. Error: ${errorMsg}`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Warning",
          description: "Email sending completed but no success/failure count available",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Failed to send test email:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      
      toast({
        title: "Error",
        description: `Failed to send test email: ${error.message || 'Unknown error'}. Check console for details.`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Email Testing Tool</CardTitle>
        <CardDescription>
          Test the bulk email functionality by sending a test email to a single recipient.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Test Email Address</label>
          <Input
            type="email"
            placeholder="Enter email address to test"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Subject</label>
          <Input
            placeholder="Email subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Message</label>
          <Textarea
            placeholder="Email message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={testEmailService} 
            disabled={loading}
            variant="outline"
            className="flex-1"
          >
            {loading ? 'Testing...' : 'Test Service'}
          </Button>
          <Button 
            onClick={sendTestEmail} 
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Sending...' : 'Send Test Email'}
          </Button>
        </div>
        
        <div className="text-sm text-gray-600">
          <p><strong>Note:</strong> This will send a test email to verify the bulk email system is working.</p>
          <p>Check the browser console and Supabase logs for detailed information.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailTest;
