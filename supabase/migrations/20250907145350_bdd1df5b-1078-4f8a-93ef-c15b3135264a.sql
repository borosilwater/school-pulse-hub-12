-- Add missing columns and tables that the code expects

-- Add status column to notifications table
ALTER TABLE public.notifications ADD COLUMN status text DEFAULT 'pending';

-- Add score column to exam_results table  
ALTER TABLE public.exam_results ADD COLUMN score integer;

-- Create sms_logs table
CREATE TABLE public.sms_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  phone_number text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  error_message text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on sms_logs
ALTER TABLE public.sms_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for sms_logs
CREATE POLICY "Admins and teachers can view sms logs" 
ON public.sms_logs 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::user_role) OR has_role(auth.uid(), 'teacher'::user_role));

CREATE POLICY "Admins and teachers can create sms logs" 
ON public.sms_logs 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::user_role) OR has_role(auth.uid(), 'teacher'::user_role));

-- Add trigger for sms_logs updated_at
CREATE TRIGGER update_sms_logs_updated_at
BEFORE UPDATE ON public.sms_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();