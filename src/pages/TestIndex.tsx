import { Button } from '@/components/ui/button';
import AnnouncementBar from '@/components/ui/announcement-bar';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const TestIndex = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Announcement Bar */}
      <AnnouncementBar />
      
      <div className="container mx-auto px-4 py-20 pt-28">
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Welcome to EduPortal
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            A comprehensive school management system with real-time notifications, 
            content management, and role-based access control.
          </p>
          
          <div className="space-x-4">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => navigate('/auth')}
            >
              Get Started
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
          </div>
          
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">For Students</h3>
              <p className="text-gray-600">View grades, announcements, and manage your profile</p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">For Teachers</h3>
              <p className="text-gray-600">Manage content, grades, and communicate with students</p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">For Admins</h3>
              <p className="text-gray-600">User management, analytics, and system administration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestIndex;