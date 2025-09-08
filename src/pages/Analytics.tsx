import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users, BookOpen, Trophy, Bell, TrendingUp, Calendar, FileText, GraduationCap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsData {
  totalStudents: number;
  totalTeachers: number;
  totalNews: number;
  totalAnnouncements: number;
  totalEvents: number;
  totalExamResults: number;
  publishedContent: number;
  recentActivity: any[];
}

const Analytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalStudents: 0,
    totalTeachers: 0,
    totalNews: 0,
    totalAnnouncements: 0,
    totalEvents: 0,
    totalExamResults: 0,
    publishedContent: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [
        studentsRes,
        teachersRes,
        newsRes,
        announcementsRes,
        eventsRes,
        examResultsRes,
        publishedNewsRes,
        publishedAnnouncementsRes
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'teacher'),
        supabase.from('news').select('*', { count: 'exact', head: true }),
        supabase.from('announcements').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('exam_results').select('*', { count: 'exact', head: true }),
        supabase.from('news').select('*', { count: 'exact', head: true }).eq('published', true),
        supabase.from('announcements').select('*', { count: 'exact', head: true }).eq('published', true)
      ]);

      setAnalytics({
        totalStudents: studentsRes.count || 0,
        totalTeachers: teachersRes.count || 0,
        totalNews: newsRes.count || 0,
        totalAnnouncements: announcementsRes.count || 0,
        totalEvents: eventsRes.count || 0,
        totalExamResults: examResultsRes.count || 0,
        publishedContent: (publishedNewsRes.count || 0) + (publishedAnnouncementsRes.count || 0),
        recentActivity: []
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
            <p className="text-muted-foreground">Only administrators can access analytics.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">School performance and usage statistics</p>
        </div>
        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
          <BarChart3 className="h-3 w-3 mr-1" />
          Admin Analytics
        </Badge>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Registered students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <BookOpen className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalTeachers}</div>
            <p className="text-xs text-muted-foreground">Faculty members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Content</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.publishedContent}</div>
            <p className="text-xs text-muted-foreground">News & announcements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exam Results</CardTitle>
            <Trophy className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalExamResults}</div>
            <p className="text-xs text-muted-foreground">Total results recorded</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Content Statistics</CardTitle>
            <CardDescription>Overview of all content in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-blue-600" />
                  <span>News Articles</span>
                </div>
                <Badge variant="outline">{analytics.totalNews}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="h-4 w-4 mr-2 text-orange-600" />
                  <span>Announcements</span>
                </div>
                <Badge variant="outline">{analytics.totalAnnouncements}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-green-600" />
                  <span>Events</span>
                </div>
                <Badge variant="outline">{analytics.totalEvents}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Trophy className="h-4 w-4 mr-2 text-purple-600" />
                  <span>Exam Results</span>
                </div>
                <Badge variant="outline">{analytics.totalExamResults}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Breakdown of users by role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2 text-blue-600" />
                  <span>Students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{analytics.totalStudents}</Badge>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ 
                        width: `${(analytics.totalStudents / (analytics.totalStudents + analytics.totalTeachers)) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-green-600" />
                  <span>Teachers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{analytics.totalTeachers}</Badge>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ 
                        width: `${(analytics.totalTeachers / (analytics.totalStudents + analytics.totalTeachers)) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>System Performance</CardTitle>
          <CardDescription>Key performance indicators for the school management system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {Math.round((analytics.publishedContent / (analytics.totalNews + analytics.totalAnnouncements)) * 100) || 0}%
              </div>
              <div className="text-sm text-muted-foreground">Content Published</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {analytics.totalStudents > 0 ? Math.round(analytics.totalExamResults / analytics.totalStudents) : 0}
              </div>
              <div className="text-sm text-muted-foreground">Avg Exams per Student</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {analytics.totalTeachers > 0 ? Math.round((analytics.totalNews + analytics.totalAnnouncements + analytics.totalEvents) / analytics.totalTeachers) : 0}
              </div>
              <div className="text-sm text-muted-foreground">Avg Content per Teacher</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;