import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const EmailTest = () => {
  const [testEmail, setTestEmail] = useState('');
  const [subject, setSubject] = useState('Test Email from EMRS Dornala');
  const [message, setMessage] = useState('This is a test email to verify the bulk email functionality is working correctly.');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
      
      const { data, error } = await supabase.functions.invoke('send-bulk-email', {
        body: {
          to: [testEmail],
          subject: subject,
          body: message,
          type: 'general'
        }
      });

      if (error) throw error;

      const successCount = data?.summary?.success || 0;
      const failureCount = data?.summary?.failed || 0;
      
      if (failureCount === 0) {
        toast({
          title: "Success",
          description: `Test email sent successfully to ${testEmail}!`
        });
      } else {
        toast({
          title: "Error",
          description: `Failed to send test email. Error: ${data?.error || 'Unknown error'}`
        });
      }
    } catch (error) {
      console.error('Failed to send test email:', error);
      toast({
        title: "Error",
        description: "Failed to send test email. Please check the console for details.",
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
        
        <Button 
          onClick={sendTestEmail} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Sending...' : 'Send Test Email'}
        </Button>
        
        <div className="text-sm text-gray-600">
          <p><strong>Note:</strong> This will send a test email to verify the bulk email system is working.</p>
          <p>Check the browser console and Supabase logs for detailed information.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailTest;
