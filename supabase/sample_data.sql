-- Sample data for testing announcements and events on the landing page
-- This script inserts sample announcements and events created by teachers

-- First, let's create a sample teacher profile (you'll need to replace the user_id with an actual user ID from auth.users)
-- For testing purposes, we'll use a placeholder UUID

-- Insert sample announcements
INSERT INTO announcements (title, content, type, priority, author_id, published, created_at) VALUES
(
  'EMRS Entrance Exam 2024 Registration Open',
  'Registration for EMRS Entrance Exam 2024 is now open. Students can register online through our official website. The last date for registration is 30th June 2024. For more details, contact the school office.',
  'exam',
  4,
  (SELECT id FROM profiles WHERE role = 'teacher' LIMIT 1),
  true,
  NOW() - INTERVAL '2 days'
),
(
  'Summer Vacation Notice',
  'The school will remain closed for summer vacation from 1st May to 30th June 2024. Classes will resume on 1st July 2024. Students are advised to complete their holiday homework during this period.',
  'general',
  2,
  (SELECT id FROM profiles WHERE role = 'teacher' LIMIT 1),
  true,
  NOW() - INTERVAL '5 days'
),
(
  'Sports Day Celebration',
  'Annual Sports Day will be celebrated on 15th March 2024. All students are encouraged to participate in various sports activities. Parents are invited to witness the event.',
  'event',
  3,
  (SELECT id FROM profiles WHERE role = 'teacher' LIMIT 1),
  true,
  NOW() - INTERVAL '1 day'
);

-- Insert sample events
INSERT INTO events (title, description, event_date, location, organizer_id, max_participants, registration_required, created_at) VALUES
(
  'Annual Science Exhibition',
  'Students will showcase their innovative science projects and experiments. This event promotes scientific thinking and creativity among students.',
  NOW() + INTERVAL '7 days',
  'School Auditorium',
  (SELECT id FROM profiles WHERE role = 'teacher' LIMIT 1),
  200,
  false,
  NOW() - INTERVAL '3 days'
),
(
  'Parent-Teacher Meeting',
  'Quarterly parent-teacher meeting to discuss student progress and academic performance. All parents are requested to attend.',
  NOW() + INTERVAL '14 days',
  'Classrooms',
  (SELECT id FROM profiles WHERE role = 'teacher' LIMIT 1),
  500,
  false,
  NOW() - INTERVAL '2 days'
),
(
  'Cultural Festival',
  'Annual cultural festival showcasing traditional dances, music, and drama performances by students. This event celebrates our rich cultural heritage.',
  NOW() + INTERVAL '21 days',
  'School Ground',
  (SELECT id FROM profiles WHERE role = 'teacher' LIMIT 1),
  1000,
  false,
  NOW() - INTERVAL '1 day'
),
(
  'CBSE Board Exam Preparation Workshop',
  'Special workshop for Class 10 and 12 students to prepare for upcoming CBSE board exams. Expert teachers will provide guidance and study tips.',
  NOW() + INTERVAL '3 days',
  'Library',
  (SELECT id FROM profiles WHERE role = 'teacher' LIMIT 1),
  50,
  true,
  NOW() - INTERVAL '4 days'
);

-- Note: To use this script, you need to:
-- 1. Have at least one teacher profile in the profiles table
-- 2. Replace the author_id and organizer_id with actual profile IDs
-- 3. Run this script in your Supabase SQL editor or through the CLI
