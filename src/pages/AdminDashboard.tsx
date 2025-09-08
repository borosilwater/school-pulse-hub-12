import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  BookOpen, 
  Bell, 
  Calendar, 
  Trophy, 
  BarChart3,
  TrendingUp,
  UserPlus,
  Settings,
  Shield,
  Activity,
  FileText,
  MessageSquare,
  Smartphone,
  Trash2,
  Edit,
  Mail,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { contentService } from '@/lib/content';
import { notificationService } from '@/lib/notifications';
import { realtimeService } from '@/lib/realtime';
import BackendHealthCheck from '@/components/BackendHealthCheck';
import AdminManagement from '@/components/admin/AdminManagement';

interface ContentItem {
  id: string;
  title: string;
  type: 'news' | 'announcement' | 'event' | 'exam_result' | 'notification';
  author_id: string;
  author_name: string;
  created_at: string;
  published?: boolean;
  status?: string;
}

const AdminDashboard = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>({});
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [recentContent, setRecentContent] = useState<ContentItem[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [quickEmailSubject, setQuickEmailSubject] = useState('');
  const [quickEmailMessage, setQuickEmailMessage] = useState('');
  const [systemHealth, setSystemHealth] = useState({
    database: 'healthy',
    sms: 'healthy',
    realtime: 'healthy',
    storage: 'healthy'
  });

  useEffect(() => {
    if (profile?.id) {
      loadAdminData();
      setupRealtimeSubscriptions();
    }

    return () => {
      realtimeService.unsubscribeAll();
    };
  }, [profile?.id]);

  // Handle hash-based navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash && ['overview', 'content', 'health', 'management', 'analytics', 'settings'].includes(hash)) {
        setActiveTab(hash);
      }
    };

    // Check initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const loadAdminData = async () => {
    if (!profile?.id) return;

    setLoading(true);
    try {
      const [contentStats, notifications, recentContentData] = await Promise.all([
        contentService.getContentStats(),
        notificationService.getUserNotifications(profile.id, 10),
        loadRecentContent()
      ]);

      setStats(contentStats);
      setRecentActivity(notifications);
      setRecentContent(recentContentData);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentContent = async (): Promise<ContentItem[]> => {
    try {
      // Load all content types with proper joins
      const [newsRes, announcementsRes, eventsRes, examResultsRes, notificationsRes, profilesRes] = await Promise.all([
        supabase.from('news').select('id, title, author_id, created_at, published').order('created_at', { ascending: false }).limit(5),
        supabase.from('announcements').select('id, title, author_id, created_at, published').order('created_at', { ascending: false }).limit(5),
        supabase.from('events').select('id, title, organizer_id, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('exam_results').select('id, exam_name, teacher_id, created_at, status').order('created_at', { ascending: false }).limit(5),
        supabase.from('notifications').select('id, title, user_id, created_at, status').order('created_at', { ascending: false }).limit(5),
        supabase.from('profiles').select('user_id, full_name')
      ]);

      const allContent: ContentItem[] = [];
      const profileMap = new Map(profilesRes.data?.map(p => [p.user_id, p.full_name]) || []);
      
      // Process news
      if (newsRes.data) {
        allContent.push(...newsRes.data.map(item => ({
          id: item.id,
          title: item.title,
          type: 'news' as const,
          author_id: item.author_id,
          author_name: profileMap.get(item.author_id) || 'Unknown',
          created_at: item.created_at,
          published: item.published
        })));
      }

      // Process announcements
      if (announcementsRes.data) {
        allContent.push(...announcementsRes.data.map(item => ({
          id: item.id,
          title: item.title,
          type: 'announcement' as const,
          author_id: item.author_id,
          author_name: profileMap.get(item.author_id) || 'Unknown',
          created_at: item.created_at,
          published: item.published
        })));
      }

      // Process events
      if (eventsRes.data) {
        allContent.push(...eventsRes.data.map(item => ({
          id: item.id,
          title: item.title,
          type: 'event' as const,
          author_id: item.organizer_id,
          author_name: profileMap.get(item.organizer_id) || 'Unknown',
          created_at: item.created_at
        })));
      }

      // Process exam results
      if (examResultsRes.data) {
        allContent.push(...examResultsRes.data.map(item => ({
          id: item.id,
          title: item.exam_name,
          type: 'exam_result' as const,
          author_id: item.teacher_id,
          author_name: profileMap.get(item.teacher_id) || 'Unknown',
          created_at: item.created_at,
          status: item.status
        })));
      }

      // Process notifications
      if (notificationsRes.data) {
        allContent.push(...notificationsRes.data.map(item => ({
          id: item.id,
          title: item.title,
          type: 'notification' as const,
          author_id: item.user_id,
          author_name: profileMap.get(item.user_id) || 'System',
          created_at: item.created_at,
          status: item.status
        })));
      }

      return allContent.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10);
    } catch (error) {
      console.error('Failed to load recent content:', error);
      return [];
    }
  };

  const setupRealtimeSubscriptions = () => {
    if (!profile?.id) return;

    // Subscribe to all admin updates
    realtimeService.subscribeToAdminUpdates((payload) => {
      loadAdminData(); // Reload data on any change
    });
  };

  const handleSystemAction = async (action: string) => {
    try {
      // Implement system actions here
      console.log(`Executing system action: ${action}`);
      // For now, just reload data
      await loadAdminData();
    } catch (error) {
      console.error(`Failed to execute ${action}:`, error);
    }
  };

  const deleteContent = async (contentId: string, contentType: string) => {
    try {
      setLoading(true);
      let table;
      switch (contentType) {
        case 'news': table = 'news'; break;
        case 'announcement': table = 'announcements'; break;
        case 'event': table = 'events'; break;
        case 'exam_result': table = 'exam_results'; break;
        case 'notification': table = 'notifications'; break;
        default: throw new Error('Invalid content type');
      }

      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', contentId);

      if (error) throw error;
      
      // Reload data to update the dashboard
      await loadAdminData();
      toast({
        title: "Success",
        description: "Content deleted successfully"
      });
    } catch (error) {
      console.error('Failed to delete content:', error);
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendQuickEmail = async () => {
    if (!quickEmailSubject || !quickEmailMessage) {
      toast({
        title: "Error",
        description: "Please fill in both subject and message",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      // Get all student emails
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('role', 'student');

      if (!profiles || profiles.length === 0) {
        toast({
          title: "Error",
          description: "No students found",
          variant: "destructive"
        });
        return;
      }

      // Get emails from profiles table
      const emails = profiles
        .map(profile => profile.email)
        .filter(Boolean) as string[];

      // If no emails found in profiles, show error and ask users to add emails
      if (emails.length === 0) {
        toast({
          title: "No Email Addresses Found",
          description: "Please ask students to add their email addresses in their profile settings first.",
          variant: "destructive"
        });
        return;
      }


      const { data, error } = await supabase.functions.invoke('send-gmail', {
        body: {
          to: emails,
          subject: quickEmailSubject,
          body: quickEmailMessage,
          type: 'general'
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Email sent to ${emails.length} students successfully!`
      });
      
      setQuickEmailSubject('');
      setQuickEmailMessage('');
    } catch (error) {
      console.error('Failed to send quick email:', error);
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'news': return <FileText className="h-4 w-4" />;
      case 'announcement': return <Bell className="h-4 w-4" />;
      case 'event': return <Calendar className="h-4 w-4" />;
      case 'exam_result': return <Trophy className="h-4 w-4" />;
      case 'notification': return <Mail className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'news': return 'default';
      case 'announcement': return 'destructive';
      case 'event': return 'secondary';
      case 'exam_result': return 'outline';
      case 'notification': return 'default';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground animate-spin" />
          <h2 className="text-2xl font-semibold">Loading admin dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            System overview and management for {profile?.full_name}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Administrator
          </Badge>
        </div>
      </div>

      {/* System Health Status */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Healthy</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SMS Service</CardTitle>
            <Smartphone className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">Twilio connected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Realtime</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Connected</div>
            <p className="text-xs text-muted-foreground">Live updates active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Available</div>
            <p className="text-xs text-muted-foreground">File storage ready</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents + stats.totalTeachers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalStudents || 0} students, {stats.totalTeachers || 0} teachers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Items</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats.totalNews || 0) + (stats.totalAnnouncements || 0) + (stats.totalEvents || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              News, announcements, and events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exam Results</CardTitle>
            <Trophy className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExamResults || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingExamResults || 0} pending publication
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Content</CardTitle>
            <Bell className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats.publishedNews || 0) + (stats.publishedAnnouncements || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Live content items
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content Moderation</TabsTrigger>
          <TabsTrigger value="health">Backend Health</TabsTrigger>
          <TabsTrigger value="management">User & Content Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system activities and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivity.length === 0 ? (
                  <div className="text-center py-4">
                    <Activity className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.slice(0, 5).map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.created_at).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleSystemAction('refresh_data')}
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    Refresh System Data
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleSystemAction('send_announcement')}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Send System Announcement
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleSystemAction('export_data')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Export System Data
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleSystemAction('system_backup')}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Create System Backup
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('management')}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Content & Users
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('content')}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Moderate Content
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('management')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email to Students
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Email Send */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Email</CardTitle>
              <CardDescription>Send a quick message to all students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="quick-subject">Subject</Label>
                  <Input
                    id="quick-subject"
                    placeholder="Enter email subject"
                    value={quickEmailSubject}
                    onChange={(e) => setQuickEmailSubject(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="quick-message">Message</Label>
                  <Textarea
                    id="quick-message"
                    placeholder="Enter your message"
                    value={quickEmailMessage}
                    onChange={(e) => setQuickEmailMessage(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button 
                  onClick={sendQuickEmail} 
                  disabled={!quickEmailSubject || !quickEmailMessage || loading}
                  className="w-full"
                >
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Mail className="h-4 w-4 mr-2" />}
                  Send to All Students
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Content Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Content</CardTitle>
                  <CardDescription>Latest content created by teachers and students</CardDescription>
                </div>
                <Button onClick={loadAdminData} variant="outline" size="sm">
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentContent.slice(0, 5).map((item) => (
                  <div key={`${item.type}-${item.id}`} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      {getContentTypeIcon(item.type)}
                      <div>
                        <h4 className="font-medium text-sm truncate max-w-xs">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {item.author_name} • {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getContentTypeColor(item.type) as any} className="text-xs">
                        {item.type}
                      </Badge>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Content</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{item.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteContent(item.id, item.type)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
                {recentContent.length === 0 && (
                  <div className="text-center py-4">
                    <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No recent content</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Moderation Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Content Moderation</CardTitle>
                  <CardDescription>Review and moderate all content created by teachers and students</CardDescription>
                </div>
                <Button onClick={loadAdminData} variant="outline" size="sm">
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentContent.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No content found</h3>
                    <p className="text-muted-foreground">
                      No content has been created yet.
                    </p>
                  </div>
                ) : (
                  recentContent.map((item) => (
                    <div key={`${item.type}-${item.id}`} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getContentTypeIcon(item.type)}
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold truncate max-w-md">{item.title}</h4>
                              <Badge variant={getContentTypeColor(item.type) as any}>
                                {item.type}
                              </Badge>
                              {item.published !== undefined && (
                                <Badge variant={item.published ? "default" : "secondary"}>
                                  {item.published ? "Published" : "Draft"}
                                </Badge>
                              )}
                              {item.status && (
                                <Badge variant="outline">
                                  {item.status}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              By {item.author_name} • {new Date(item.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Content</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{item.title}"? This action cannot be undone.
                                <br />
                                <strong>Author:</strong> {item.author_name}
                                <br />
                                <strong>Type:</strong> {item.type}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteContent(item.id, item.type)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backend Health Tab */}
        <TabsContent value="health" className="space-y-4">
          <BackendHealthCheck />
        </TabsContent>

        {/* User & Content Management Tab */}
        <TabsContent value="management" className="space-y-4">
          <div className="min-h-[400px]">
            {profile?.role === 'admin' ? (
              <AdminManagement />
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
                    <p className="text-muted-foreground">Only administrators can access this section.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Analytics</CardTitle>
              <CardDescription>Platform usage and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground">
                  Advanced analytics and reporting features coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure system-wide settings and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">SMS Notifications</h3>
                    <p className="text-sm text-muted-foreground">Configure Twilio SMS settings</p>
                  </div>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Email Settings</h3>
                    <p className="text-sm text-muted-foreground">Configure email notification settings</p>
                  </div>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Security Settings</h3>
                    <p className="text-sm text-muted-foreground">Manage security and access controls</p>
                  </div>
                  <Button variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;