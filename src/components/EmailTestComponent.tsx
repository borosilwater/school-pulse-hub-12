import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const emailTestSchema = z.object({
  to: z.string().email('Please enter a valid email address'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Message body is required')
});

type EmailTestFormData = z.infer<typeof emailTestSchema>;

export const EmailTestComponent = () => {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const form = useForm<EmailTestFormData>({
    resolver: zodResolver(emailTestSchema),
    defaultValues: {
      to: '',
      subject: 'Test Email from EMRS Dornala',
      body: 'This is a test email to verify the Gmail functionality is working correctly.'
    }
  });

  const onSubmit = async (data: EmailTestFormData) => {
    setSending(true);
    setLastResult(null);

    try {
      console.log('Sending test email to:', data.to);

      // Call the Gmail edge function
      const { data: emailResult, error: emailError } = await supabase.functions.invoke('send-gmail', {
        body: {
          to: [data.to],
          subject: data.subject,
          body: data.body,
          type: 'test'
        }
      });

      console.log('Email result:', emailResult);
      console.log('Email error:', emailError);

      if (emailError) {
        throw emailError;
      }

      setLastResult(emailResult);
      toast({
        title: "Success!",
        description: `Test email sent successfully to ${data.to}`,
      });

      // Reset form after successful send
      form.reset();
    } catch (error: any) {
      console.error('Error sending test email:', error);
      setLastResult({ error: error.message });
      toast({
        title: "Error",
        description: `Failed to send email: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="mr-2 h-5 w-5" />
            Email System Test
          </CardTitle>
          <CardDescription>
            Test the Gmail email functionality to ensure it's working correctly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter recipient email" 
                        type="email"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email subject" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter email message" 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={sending} className="w-full">
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Test Email
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {lastResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {lastResult.error ? (
                <>
                  <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
                  Email Test Failed
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  Email Test Result
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant={lastResult.error ? "destructive" : "default"}>
              <AlertDescription>
                {lastResult.error ? (
                  <div>
                    <strong>Error:</strong> {lastResult.error}
                  </div>
                ) : (
                  <div>
                    <strong>Success!</strong> Email sent successfully.
                    {lastResult.results && (
                      <div className="mt-2">
                        <strong>Results:</strong>
                        <pre className="mt-1 text-xs bg-gray-100 p-2 rounded">
                          {JSON.stringify(lastResult.results, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Gmail Configuration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              This system uses your Gmail SMTP credentials to send emails directly.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Gmail User: Configured via YAGMAIL_USER secret</li>
              <li>• Gmail App Password: Configured via YAGMAIL_PASS secret</li>
              <li>• SMTP Server: smtp.gmail.com:587 (TLS)</li>
            </ul>
            <p className="text-sm text-yellow-600 mt-2">
              Note: Make sure your Gmail account has 2-factor authentication enabled and you're using an App Password, not your regular password.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};