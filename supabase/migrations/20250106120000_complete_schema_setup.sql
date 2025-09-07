-- Complete Database Schema Setup for EduPortal
-- This migration sets up all tables, RLS policies, and functions

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE announcement_type AS ENUM ('general', 'urgent', 'event', 'exam');
CREATE TYPE exam_status AS ENUM ('pending', 'published', 'draft');
CREATE TYPE notification_type AS ENUM ('sms', 'email', 'push', 'in_app');
CREATE TYPE notification_status AS ENUM ('pending', 'sent', 'failed', 'delivered');

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    avatar_url TEXT,
    phone TEXT,
    address TEXT,
    date_of_birth DATE,
    class_name TEXT,
    student_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create news table
CREATE TABLE IF NOT EXISTS news (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type announcement_type DEFAULT 'general',
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    priority INTEGER DEFAULT 0,
    published BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    organizer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    max_participants INTEGER,
    registration_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exam_results table
CREATE TABLE IF NOT EXISTS exam_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    exam_name TEXT NOT NULL,
    subject TEXT NOT NULL,
    exam_date DATE NOT NULL,
    marks_obtained INTEGER NOT NULL,
    total_marks INTEGER NOT NULL,
    grade TEXT,
    status exam_status DEFAULT 'pending',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL,
    status notification_status DEFAULT 'pending',
    data JSONB,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sms_logs table for tracking SMS notifications
CREATE TABLE IF NOT EXISTS sms_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    phone_number TEXT NOT NULL,
    message TEXT NOT NULL,
    status notification_status NOT NULL,
    twilio_sid TEXT,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_preferences table for notification and app settings
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    sms_notifications BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT FALSE,
    announcement_notifications BOOLEAN DEFAULT TRUE,
    exam_result_notifications BOOLEAN DEFAULT TRUE,
    event_notifications BOOLEAN DEFAULT TRUE,
    language TEXT DEFAULT 'en',
    theme TEXT DEFAULT 'light',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create file_uploads table for managing uploaded files
CREATE TABLE IF NOT EXISTS file_uploads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    uploaded_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_news_author ON news(author_id);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published);
CREATE INDEX IF NOT EXISTS idx_announcements_author ON announcements(author_id);
CREATE INDEX IF NOT EXISTS idx_announcements_published ON announcements(published);
CREATE INDEX IF NOT EXISTS idx_announcements_type ON announcements(type);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_exam_results_student ON exam_results(student_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_teacher ON exam_results(teacher_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_status ON exam_results(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_sms_logs_user ON sms_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_sms_logs_status ON sms_logs(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exam_results_updated_at BEFORE UPDATE ON exam_results FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create helper functions
CREATE OR REPLACE FUNCTION get_user_role(_user_id UUID)
RETURNS user_role AS $$
BEGIN
    RETURN (
        SELECT role FROM profiles WHERE user_id = _user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT role = _role FROM profiles WHERE user_id = _user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (user_id, full_name, role)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'), 'student');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles table
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles" ON profiles
    FOR UPDATE USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for news table
CREATE POLICY "Anyone can view published news" ON news
    FOR SELECT USING (published = TRUE);

CREATE POLICY "Teachers and admins can view all news" ON news
    FOR SELECT USING (has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers and admins can create news" ON news
    FOR INSERT WITH CHECK (has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Authors can update their own news" ON news
    FOR UPDATE USING (author_id = (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update all news" ON news
    FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Authors can delete their own news" ON news
    FOR DELETE USING (author_id = (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can delete all news" ON news
    FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for announcements table
CREATE POLICY "Anyone can view published announcements" ON announcements
    FOR SELECT USING (published = TRUE);

CREATE POLICY "Teachers and admins can view all announcements" ON announcements
    FOR SELECT USING (has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers and admins can create announcements" ON announcements
    FOR INSERT WITH CHECK (has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Authors can update their own announcements" ON announcements
    FOR UPDATE USING (author_id = (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update all announcements" ON announcements
    FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Authors can delete their own announcements" ON announcements
    FOR DELETE USING (author_id = (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can delete all announcements" ON announcements
    FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for events table
CREATE POLICY "Anyone can view events" ON events
    FOR SELECT USING (TRUE);

CREATE POLICY "Teachers and admins can create events" ON events
    FOR INSERT WITH CHECK (has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Organizers can update their own events" ON events
    FOR UPDATE USING (organizer_id = (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update all events" ON events
    FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Organizers can delete their own events" ON events
    FOR DELETE USING (organizer_id = (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can delete all events" ON events
    FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for exam_results table
CREATE POLICY "Students can view their own exam results" ON exam_results
    FOR SELECT USING (student_id = (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Teachers can view exam results they created" ON exam_results
    FOR SELECT USING (teacher_id = (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all exam results" ON exam_results
    FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can create exam results" ON exam_results
    FOR INSERT WITH CHECK (has_role(auth.uid(), 'teacher'));

CREATE POLICY "Teachers can update their own exam results" ON exam_results
    FOR UPDATE USING (teacher_id = (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update all exam results" ON exam_results
    FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can delete their own exam results" ON exam_results
    FOR DELETE USING (teacher_id = (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can delete all exam results" ON exam_results
    FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for notifications table
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (user_id = (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (user_id = (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "System can create notifications" ON notifications
    FOR INSERT WITH CHECK (TRUE);

-- RLS Policies for sms_logs table
CREATE POLICY "Users can view their own SMS logs" ON sms_logs
    FOR SELECT USING (user_id = (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all SMS logs" ON sms_logs
    FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can create SMS logs" ON sms_logs
    FOR INSERT WITH CHECK (TRUE);

-- RLS Policies for user_preferences table
CREATE POLICY "Users can view their own preferences" ON user_preferences
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own preferences" ON user_preferences
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own preferences" ON user_preferences
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all preferences" ON user_preferences
    FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for file_uploads table
CREATE POLICY "Users can view their own uploads" ON file_uploads
    FOR SELECT USING (uploaded_by = (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all uploads" ON file_uploads
    FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create uploads" ON file_uploads
    FOR INSERT WITH CHECK (uploaded_by = (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own uploads" ON file_uploads
    FOR DELETE USING (uploaded_by = (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can delete all uploads" ON file_uploads
    FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Create function to send SMS notification
CREATE OR REPLACE FUNCTION send_sms_notification(
    p_user_id UUID,
    p_phone_number TEXT,
    p_message TEXT
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
    sms_log_id UUID;
BEGIN
    -- Create notification record
    INSERT INTO notifications (user_id, title, message, type, status)
    VALUES (p_user_id, 'SMS Notification', p_message, 'sms', 'pending')
    RETURNING id INTO notification_id;

    -- Create SMS log record
    INSERT INTO sms_logs (user_id, phone_number, message, status)
    VALUES (p_user_id, p_phone_number, p_message, 'pending')
    RETURNING id INTO sms_log_id;

    -- Return the notification ID
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
    user_role user_role;
    stats JSON;
BEGIN
    -- Get user role
    SELECT role INTO user_role FROM profiles WHERE user_id = p_user_id;
    
    CASE user_role
        WHEN 'student' THEN
            SELECT json_build_object(
                'role', 'student',
                'total_exams', (SELECT COUNT(*) FROM exam_results WHERE student_id = (SELECT id FROM profiles WHERE user_id = p_user_id)),
                'pending_assignments', 3, -- Placeholder
                'current_gpa', 3.8, -- Placeholder
                'attendance_rate', 95 -- Placeholder
            ) INTO stats;
        WHEN 'teacher' THEN
            SELECT json_build_object(
                'role', 'teacher',
                'total_students', (SELECT COUNT(DISTINCT student_id) FROM exam_results WHERE teacher_id = (SELECT id FROM profiles WHERE user_id = p_user_id)),
                'classes_today', 4, -- Placeholder
                'pending_grades', (SELECT COUNT(*) FROM exam_results WHERE teacher_id = (SELECT id FROM profiles WHERE user_id = p_user_id) AND status = 'pending'),
                'this_week_tests', 2 -- Placeholder
            ) INTO stats;
        WHEN 'admin' THEN
            SELECT json_build_object(
                'role', 'admin',
                'total_students', (SELECT COUNT(*) FROM profiles WHERE role = 'student'),
                'total_teachers', (SELECT COUNT(*) FROM profiles WHERE role = 'teacher'),
                'total_announcements', (SELECT COUNT(*) FROM announcements),
                'total_events', (SELECT COUNT(*) FROM events)
            ) INTO stats;
        ELSE
            stats := '{"error": "Invalid user role"}'::json;
    END CASE;
    
    RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
