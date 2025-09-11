-- Create comprehensive tables for the educational portal

-- 1. Document Management System
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT NOT NULL,
  category TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  is_public BOOLEAN DEFAULT false,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Fee Management System
CREATE TABLE public.fee_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_name TEXT NOT NULL,
  fee_type TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE,
  academic_year TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.fee_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  fee_structure_id UUID REFERENCES public.fee_structures(id),
  amount_paid DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  transaction_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  payment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Online Application System
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_number TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  parent_occupation TEXT,
  parent_income DECIMAL(10,2),
  class_applying_for TEXT NOT NULL,
  previous_school TEXT,
  documents_uploaded JSONB DEFAULT '{}',
  application_status TEXT DEFAULT 'submitted',
  submitted_at TIMESTAMPTZ DEFAULT now(),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Faculty Management System
CREATE TABLE public.faculty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  employee_id TEXT UNIQUE NOT NULL,
  designation TEXT NOT NULL,
  department TEXT NOT NULL,
  qualification TEXT,
  experience_years INTEGER,
  subjects_taught TEXT[],
  joining_date DATE,
  phone TEXT,
  emergency_contact TEXT,
  address TEXT,
  bio TEXT,
  profile_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Student Records System
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  admission_number TEXT UNIQUE NOT NULL,
  roll_number TEXT,
  class_name TEXT NOT NULL,
  section TEXT,
  admission_date DATE,
  date_of_birth DATE,
  gender TEXT,
  blood_group TEXT,
  father_name TEXT,
  mother_name TEXT,
  guardian_phone TEXT,
  address TEXT,
  emergency_contact TEXT,
  medical_conditions TEXT,
  hostel_resident BOOLEAN DEFAULT false,
  transport_required BOOLEAN DEFAULT false,
  academic_year TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Placement Records System
CREATE TABLE public.placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id),
  company_name TEXT NOT NULL,
  position TEXT NOT NULL,
  package_amount DECIMAL(10,2),
  placement_date DATE,
  placement_type TEXT, -- Higher Studies, Job, etc.
  college_university TEXT,
  course TEXT,
  academic_year TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Department Management
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  head_of_department UUID REFERENCES public.faculty(id),
  subjects TEXT[],
  facilities TEXT[],
  achievements TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. CMS Content Management
CREATE TABLE public.cms_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL, -- page, section, widget
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL,
  meta_data JSONB DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Documents
CREATE POLICY "Public documents are viewable by everyone" ON public.documents
  FOR SELECT USING (is_public = true);

CREATE POLICY "Authenticated users can view documents" ON public.documents
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin and teachers can manage documents" ON public.documents
  FOR ALL USING (has_role(auth.uid(), 'admin'::user_role) OR has_role(auth.uid(), 'teacher'::user_role));

-- RLS Policies for Fee Structures
CREATE POLICY "Everyone can view fee structures" ON public.fee_structures
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage fee structures" ON public.fee_structures
  FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- RLS Policies for Fee Payments
CREATE POLICY "Students can view their own payments" ON public.fee_payments
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Admin and teachers can view all payments" ON public.fee_payments
  FOR SELECT USING (has_role(auth.uid(), 'admin'::user_role) OR has_role(auth.uid(), 'teacher'::user_role));

CREATE POLICY "Admin can manage payments" ON public.fee_payments
  FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- RLS Policies for Applications
CREATE POLICY "Anyone can submit applications" ON public.applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin and teachers can view all applications" ON public.applications
  FOR SELECT USING (has_role(auth.uid(), 'admin'::user_role) OR has_role(auth.uid(), 'teacher'::user_role));

CREATE POLICY "Admin and teachers can manage applications" ON public.applications
  FOR ALL USING (has_role(auth.uid(), 'admin'::user_role) OR has_role(auth.uid(), 'teacher'::user_role));

-- RLS Policies for Faculty
CREATE POLICY "Everyone can view active faculty" ON public.faculty
  FOR SELECT USING (is_active = true);

CREATE POLICY "Faculty can update their own profile" ON public.faculty
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admin can manage faculty" ON public.faculty
  FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- RLS Policies for Students
CREATE POLICY "Students can view their own record" ON public.students
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admin and teachers can view all students" ON public.students
  FOR SELECT USING (has_role(auth.uid(), 'admin'::user_role) OR has_role(auth.uid(), 'teacher'::user_role));

CREATE POLICY "Admin can manage students" ON public.students
  FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- RLS Policies for Placements
CREATE POLICY "Everyone can view placement records" ON public.placements
  FOR SELECT USING (true);

CREATE POLICY "Admin and teachers can manage placements" ON public.placements
  FOR ALL USING (has_role(auth.uid(), 'admin'::user_role) OR has_role(auth.uid(), 'teacher'::user_role));

-- RLS Policies for Departments
CREATE POLICY "Everyone can view departments" ON public.departments
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage departments" ON public.departments
  FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- RLS Policies for CMS Content
CREATE POLICY "Published content is viewable by everyone" ON public.cms_content
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admin and teachers can view all content" ON public.cms_content
  FOR SELECT USING (has_role(auth.uid(), 'admin'::user_role) OR has_role(auth.uid(), 'teacher'::user_role));

CREATE POLICY "Admin and teachers can manage content" ON public.cms_content
  FOR ALL USING (has_role(auth.uid(), 'admin'::user_role) OR has_role(auth.uid(), 'teacher'::user_role));

-- Create triggers for updated_at
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fee_structures_updated_at BEFORE UPDATE ON public.fee_structures
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fee_payments_updated_at BEFORE UPDATE ON public.fee_payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faculty_updated_at BEFORE UPDATE ON public.faculty
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_placements_updated_at BEFORE UPDATE ON public.placements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cms_content_updated_at BEFORE UPDATE ON public.cms_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_documents_category ON public.documents(category);
CREATE INDEX idx_documents_uploaded_by ON public.documents(uploaded_by);
CREATE INDEX idx_fee_payments_student_id ON public.fee_payments(student_id);
CREATE INDEX idx_applications_status ON public.applications(application_status);
CREATE INDEX idx_faculty_department ON public.faculty(department);
CREATE INDEX idx_students_class ON public.students(class_name);
CREATE INDEX idx_cms_content_slug ON public.cms_content(slug);
CREATE INDEX idx_cms_content_type ON public.cms_content(content_type);

-- Insert some sample data
INSERT INTO public.departments (name, description, subjects) VALUES
('Science', 'Science department offering Physics, Chemistry, Biology', ARRAY['Physics', 'Chemistry', 'Biology']),
('Mathematics', 'Mathematics department', ARRAY['Mathematics', 'Statistics']),
('English', 'English language and literature', ARRAY['English Literature', 'English Grammar']),
('Social Studies', 'History, Geography, Civics', ARRAY['History', 'Geography', 'Civics']),
('Computer Science', 'Information Technology and Computer Science', ARRAY['Computer Science', 'Information Technology']);

INSERT INTO public.fee_structures (class_name, fee_type, amount, academic_year) VALUES
('Class 6', 'Tuition Fee', 0.00, '2024-25'),
('Class 7', 'Tuition Fee', 0.00, '2024-25'),
('Class 8', 'Tuition Fee', 0.00, '2024-25'),
('Class 9', 'Tuition Fee', 0.00, '2024-25'),
('Class 10', 'Tuition Fee', 0.00, '2024-25'),
('Class 11', 'Tuition Fee', 0.00, '2024-25'),
('Class 12', 'Tuition Fee', 0.00, '2024-25'),
('All Classes', 'Hostel Fee', 0.00, '2024-25'),
('All Classes', 'Mess Fee', 0.00, '2024-25');

-- Insert CMS content
INSERT INTO public.cms_content (content_type, title, slug, content, is_published, created_by, updated_by) VALUES
('page', 'Home Page Hero', 'home-hero', 
'{"title": "Empowering Tribal Youth Through Quality Education", "subtitle": "Providing free residential education to tribal students since 2010", "image": "/images/building.jpg"}', 
true, (SELECT id FROM auth.users LIMIT 1), (SELECT id FROM auth.users LIMIT 1)),
('section', 'About School', 'about-school',
'{"title": "About EMRS Dornala", "content": "EMRS Dornala is a premier residential school for tribal students, providing quality education and holistic development opportunities."}',
true, (SELECT id FROM auth.users LIMIT 1), (SELECT id FROM auth.users LIMIT 1));