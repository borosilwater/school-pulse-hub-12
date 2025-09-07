import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Trophy, 
  Users, 
  FileText,
  Bell,
  TrendingUp,
  Clock,
  Star,
  ArrowRight
} from 'lucide-react';

const Dashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const getDashboardContent = () => {
    if (!profile) return null;

    const commonStats = [
      { name: 'Total Students', value: '1,234', icon: Users, color: 'text-blue-600' },
      { name: 'Active Classes', value: '45', icon: GraduationCap, color: 'text-green-600' },
      { name: 'Upcoming Events', value: '8', icon: Calendar, color: 'text-purple-600' },
      { name: 'Recent Announcements', value: '12', icon: Bell, color: 'text-orange-600' },
    ];

    switch (profile.role) {
      case 'student':
        return {
          title: `Welcome back, ${profile.full_name}!`,
          subtitle: 'Here\'s your academic overview',
          stats: [
            { name: 'Current GPA', value: '3.8', icon: Star, color: 'text-yellow-600' },
            { name: 'Assignments Due', value: '3', icon: Clock, color: 'text-red-600' },
            { name: 'Completed Exams', value: '12', icon: Trophy, color: 'text-green-600' },
            { name: 'Class Attendance', value: '95%', icon: TrendingUp, color: 'text-blue-600' },
          ],
          quickActions: [
            { name: 'View Exam Results', href: '/dashboard/student', icon: Trophy },
            { name: 'Check Assignments', href: '/dashboard/student', icon: BookOpen },
            { name: 'View Schedule', href: '/dashboard/student', icon: Calendar },
            { name: 'Read Announcements', href: '/dashboard/student', icon: Bell },
          ]
        };
      
      case 'teacher':
        return {
          title: `Welcome, ${profile.full_name}!`,
          subtitle: 'Manage your classes and students',
          stats: [
            { name: 'My Students', value: '156', icon: Users, color: 'text-blue-600' },
            { name: 'Classes Today', value: '4', icon: BookOpen, color: 'text-green-600' },
            { name: 'Pending Grades', value: '23', icon: Trophy, color: 'text-orange-600' },
            { name: 'This Week\'s Tests', value: '2', icon: FileText, color: 'text-purple-600' },
          ],
          quickActions: [
            { name: 'Manage Classes', href: '/dashboard/teacher', icon: BookOpen },
            { name: 'Grade Exams', href: '/dashboard/teacher', icon: Trophy },
            { name: 'Create Announcement', href: '/dashboard/teacher', icon: Bell },
            { name: 'View Students', href: '/dashboard/teacher', icon: Users },
          ]
        };
      
      case 'admin':
        return {
          title: `Welcome, Administrator ${profile.full_name}!`,
          subtitle: 'School management dashboard',
          stats: commonStats,
          quickActions: [
            { name: 'User Management', href: '/users', icon: Users },
            { name: 'School Analytics', href: '/analytics', icon: TrendingUp },
            { name: 'Content Management', href: '/content', icon: FileText },
            { name: 'System Settings', href: '/settings', icon: Bell },
          ]
        };
      
      default:
        return null;
    }
  };

  const dashboardContent = getDashboardContent();

  if (!dashboardContent) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-semibold">Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{dashboardContent.title}</h1>
          <p className="text-muted-foreground">{dashboardContent.subtitle}</p>
        </div>
        
        {/* Role-specific Portal Access */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Access Your Portal</h3>
              <p className="text-sm text-muted-foreground">
                {profile?.role === 'student' 
                  ? 'View your grades, assignments, and school updates'
                  : profile?.role === 'teacher'
                  ? 'Manage your classes, create content, and track student progress'
                  : 'Manage the entire school system and analytics'
                }
              </p>
            </div>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => {
                if (profile?.role === 'student') {
                  navigate('/dashboard/student');
                } else if (profile?.role === 'teacher') {
                  navigate('/dashboard/teacher');
                } else {
                  navigate('/dashboard/admin');
                }
              }}
            >
              Open {profile?.role === 'student' ? 'Student' : profile?.role === 'teacher' ? 'Teacher' : 'Admin'} Portal
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardContent.stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts for your role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {dashboardContent.quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.name}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 transition-all duration-200 hover:shadow-md hover:scale-105"
                  onClick={() => navigate(action.href)}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm font-medium text-center">{action.name}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Announcements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Bell className="h-4 w-4 mt-1 text-primary" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Important School Update #{i}</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <Badge variant="secondary" className="text-xs">New</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Calendar className="h-4 w-4 mt-1 text-accent" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">School Event #{i}</p>
                  <p className="text-xs text-muted-foreground">Tomorrow at 10:00 AM</p>
                </div>
                <Badge variant="outline" className="text-xs">Tomorrow</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
