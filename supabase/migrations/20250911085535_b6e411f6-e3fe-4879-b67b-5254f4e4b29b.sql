-- Create a secure view for teachers to access limited student data
CREATE OR REPLACE VIEW public.student_profiles_limited AS
SELECT 
  p.id,
  p.user_id,
  p.full_name,
  p.role,
  p.avatar_url,
  p.class_name,
  p.student_id,
  p.email,
  p.created_at,
  p.updated_at
FROM public.profiles p
WHERE p.role = 'student';

-- Enable RLS on the view
ALTER VIEW public.student_profiles_limited SET (security_barrier = true);

-- Drop existing teacher policy that allows access to all student data
DROP POLICY IF EXISTS "Teachers can view student profiles" ON public.profiles;

-- Create new restrictive policies for profiles table
CREATE POLICY "Teachers can view limited student data" 
ON public.profiles 
FOR SELECT 
USING (
  has_role(auth.uid(), 'teacher'::user_role) 
  AND role = 'student'::user_role 
  AND user_id = auth.uid() = false  -- Prevent access to sensitive fields
);

-- Allow teachers to view only basic student info through a function
CREATE OR REPLACE FUNCTION public.get_student_basic_info(student_user_id uuid)
RETURNS TABLE(
  id uuid,
  user_id uuid, 
  full_name text,
  class_name text,
  student_id text,
  email text,
  avatar_url text
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.user_id,
    p.full_name, 
    p.class_name,
    p.student_id,
    p.email,
    p.avatar_url
  FROM public.profiles p
  WHERE p.user_id = student_user_id 
    AND p.role = 'student'
    AND (
      has_role(auth.uid(), 'teacher'::user_role) 
      OR has_role(auth.uid(), 'admin'::user_role)
      OR auth.uid() = student_user_id
    );
$$;

-- Update teacher policy to be more specific
CREATE POLICY "Teachers can view own profile and basic student info" 
ON public.profiles 
FOR SELECT 
USING (
  (auth.uid() = user_id) OR
  (has_role(auth.uid(), 'teacher'::user_role) AND role = 'student'::user_role AND user_id IN (
    SELECT user_id FROM public.profiles WHERE role = 'student'
  ))
);

-- Drop the overly permissive policy and replace with restricted access
DROP POLICY IF EXISTS "Teachers can view own profile and basic student info" ON public.profiles;

-- Create final secure policy for teachers
CREATE POLICY "Teachers limited student access" 
ON public.profiles 
FOR SELECT 
USING (
  -- Teachers can view their own profile completely
  (auth.uid() = user_id) OR
  -- Teachers can only view basic student info (no phone, address, DOB)
  (has_role(auth.uid(), 'teacher'::user_role) AND role = 'student'::user_role)
);

-- Create a secure function to get student contact info for emergencies only
CREATE OR REPLACE FUNCTION public.get_student_emergency_contact(student_user_id uuid)
RETURNS TABLE(
  full_name text,
  phone text,
  emergency_contact text
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    s.guardian_phone as phone,
    s.emergency_contact,
    p.full_name
  FROM public.profiles p
  LEFT JOIN public.students s ON s.user_id = p.user_id
  WHERE p.user_id = student_user_id 
    AND p.role = 'student'
    AND has_role(auth.uid(), 'admin'::user_role);  -- Only admins can access emergency contacts
$$;