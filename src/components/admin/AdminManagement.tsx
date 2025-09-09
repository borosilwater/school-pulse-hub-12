import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Edit, 
  Trash2, 
  Mail, 
  Send,
  Shield,
  GraduationCap,
  BookOpen,
  Loader2,
  FileText,
  Bell,
  Calendar,
  Trophy
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  user_id: string;
  full_name: string;
  role: 'student' | 'teacher' | 'admin';
  email?: string;
  phone?: string;
  class_name?: string;
  student_id?: string;
  created_at: string;
}

interface Content {
  id: string;
  title: string;
  type: 'news' | 'announcement' | 'event' | 'exam_result' | 'notification';
  author_id: string;
  author_name: string;
  created_at: string;
  published?: boolean;
  status?: string;
}

const AdminManagement = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [content, setContent] = useState<Content[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedContent, setSelectedContent] = useState<string[]>([]);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [contentFilter, setContentFilter] = useState<string>('all');

  useEffect(() => {
    if (profile?.role === 'admin') {
      try {
        loadUsers();
        loadContent();
      } catch (error) {
        console.error('Error loading admin data:', error);
        setError('Failed to load admin data. Please refresh the page.');
      }
    }
  }, [profile]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      setUsers(data || []);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast({
        title: "Error",
        description: "Failed to load users. Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadContent = async () => {
    try {
      setLoading(true);
      // Load all content types with proper joins
      const [newsRes, announcementsRes, eventsRes, examResultsRes, notificationsRes, profilesRes] = await Promise.all([
        supabase.from('news').select('id, title, author_id, created_at, published'),
        supabase.from('announcements').select('id, title, author_id, created_at, published'),
        supabase.from('events').select('id, title, organizer_id, created_at'),
        supabase.from('exam_results').select('id, exam_name, teacher_id, created_at, status'),
        supabase.from('notifications').select('id, title, user_id, created_at, status'),
        supabase.from('profiles').select('user_id, full_name')
      ]);

      const allContent: Content[] = [];
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

      setContent(allContent.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (error) {
      console.error('Failed to load content:', error);
      toast({
        title: "Error",
        description: "Failed to load content. Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      setLoading(true);
      
      // First delete the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);
      
      if (profileError) {
        console.error('Failed to delete profile:', profileError);
        toast({
          title: "Error",
          description: "Failed to delete user profile",
          variant: "destructive"
        });
        return;
      }
      
      // Note: Auth user deletion requires admin privileges and might not be available
      // For now, we'll just delete the profile and show a message
      await loadUsers();
      toast({
        title: "Success",
        description: "User profile deleted successfully (Auth user deletion requires admin privileges)"
      });
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
      
      await loadContent();
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

  const bulkDeleteContent = async (contentIds: string[], contentType: string) => {
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
        .in('id', contentIds);

      if (error) throw error;
      
      await loadContent();
      toast({
        title: "Success",
        description: `${contentIds.length} items deleted successfully`
      });
    } catch (error) {
      console.error('Failed to bulk delete content:', error);
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendBulkEmail = async () => {
    if (!emailSubject || !emailMessage) {
      toast({
        title: "Error",
        description: "Please fill in subject and message",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      // Determine target role based on selected users
      let targetRole = 'all';
      if (selectedUsers.length > 0) {
        const selectedUserData = users.filter(user => selectedUsers.includes(user.id));
        const roles = [...new Set(selectedUserData.map(user => user.role))];
        
        if (roles.length === 1) {
          targetRole = roles[0];
        } else {
          targetRole = 'all'; // Mixed roles, send to all
        }
      }

      // Send bulk email using Supabase Edge Function
      // The function will fetch emails from database automatically
      const { data, error } = await supabase.functions.invoke('send-bulk-email', {
        body: {
          subject: emailSubject,
          body: emailMessage,
          type: 'general',
          targetRole: targetRole
          // Don't pass 'to' parameter - let the function fetch emails from database
        }
      });

      if (error) throw error;

      // Show detailed results
      const successCount = data?.summary?.success || 0;
      const failureCount = data?.summary?.failed || 0;
      const totalEmails = data?.emailsFetched || 0;
      
      if (failureCount === 0) {
        toast({
          title: "Success",
          description: `Email sent to ${successCount} users successfully! (${totalEmails} emails fetched from database)`
        });
      } else {
        toast({
          title: "Partial Success",
          description: `Email sent to ${successCount} users, ${failureCount} failed. Total emails fetched: ${totalEmails}`
        });
      }
      
      setSelectedUsers([]);
      setEmailSubject('');
      setEmailMessage('');
    } catch (error) {
      console.error('Failed to send email:', error);
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'teacher': return <GraduationCap className="h-4 w-4" />;
      case 'student': return <BookOpen className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'teacher': return 'default';
      case 'student': return 'secondary';
      default: return 'outline';
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

  const filteredContent = content.filter(item => 
    contentFilter === 'all' || item.type === contentFilter
  );

  const handleBulkDelete = () => {
    if (selectedContent.length === 0) {
      toast({
        title: "Error",
        description: "Please select content to delete",
        variant: "destructive"
      });
      return;
    }

    // Group by type for bulk delete
    const groupedContent = selectedContent.reduce((acc, contentId) => {
      const item = content.find(c => c.id === contentId);
      if (item) {
        if (!acc[item.type]) acc[item.type] = [];
        acc[item.type].push(contentId);
      }
      return acc;
    }, {} as Record<string, string[]>);

    // Delete each type separately
    Object.entries(groupedContent).forEach(([type, ids]) => {
      bulkDeleteContent(ids, type);
    });

    setSelectedContent([]);
  };

  if (profile?.role !== 'admin') {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
            <p className="text-muted-foreground">Only administrators can access this section.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-red-600">Error Loading Data</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => {
              setError(null);
              loadUsers();
              loadContent();
            }}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading && users.length === 0 && content.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-12 w-12 mx-auto text-muted-foreground mb-4 animate-spin" />
            <h3 className="text-lg font-semibold mb-2">Loading...</h3>
            <p className="text-muted-foreground">Please wait while we load the data.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Admin Management</h2>
          <p className="text-muted-foreground">Manage users and content across the platform</p>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="content">Content Management</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="email">Bulk Email</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage all users in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(user.role)}
                        <div>
                          <h4 className="font-semibold">{user.full_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {user.class_name && `Class: ${user.class_name} • `}
                            {user.student_id && `ID: ${user.student_id} • `}
                            Joined: {new Date(user.created_at).toLocaleDateString()}
                          </p>
                          {user.email && (
                            <p className="text-sm text-blue-600">
                              📧 {user.email}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge variant={getRoleColor(user.role) as any}>
                        {user.role}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" disabled={user.role === 'admin'}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {user.full_name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteUser(user.user_id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Content Management</CardTitle>
                  <CardDescription>Manage all content created by teachers and students</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Select value={contentFilter} onValueChange={setContentFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Content</SelectItem>
                      <SelectItem value="news">News</SelectItem>
                      <SelectItem value="announcement">Announcements</SelectItem>
                      <SelectItem value="event">Events</SelectItem>
                      <SelectItem value="exam_result">Exam Results</SelectItem>
                      <SelectItem value="notification">Notifications</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={loadContent} variant="outline" size="sm">
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedContent.length > 0 && (
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <span className="text-sm font-medium">
                      {selectedContent.length} item(s) selected
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedContent([])}
                      >
                        Clear Selection
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Selected
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Selected Content</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {selectedContent.length} selected item(s)? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleBulkDelete}>
                              Delete All
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )}

                {filteredContent.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No content found</h3>
                    <p className="text-muted-foreground">
                      {contentFilter === 'all' ? 'No content has been created yet.' : `No ${contentFilter} content found.`}
                    </p>
                  </div>
                ) : (
                  filteredContent.map((item) => (
                    <div key={`${item.type}-${item.id}`} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedContent.includes(item.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedContent([...selectedContent, item.id]);
                            } else {
                              setSelectedContent(selectedContent.filter(id => id !== item.id));
                            }
                          }}
                          className="rounded"
                        />
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
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
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
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Notification Management</CardTitle>
                  <CardDescription>Manage all system notifications and user communications</CardDescription>
                </div>
                <Button onClick={loadContent} variant="outline" size="sm">
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {content.filter(item => item.type === 'notification').length === 0 ? (
                  <div className="text-center py-8">
                    <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No notifications found</h3>
                    <p className="text-muted-foreground">
                      No notifications have been sent yet.
                    </p>
                  </div>
                ) : (
                  content
                    .filter(item => item.type === 'notification')
                    .map((item) => (
                      <div key={`notification-${item.id}`} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            checked={selectedContent.includes(item.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedContent([...selectedContent, item.id]);
                              } else {
                                setSelectedContent(selectedContent.filter(id => id !== item.id));
                              }
                            }}
                            className="rounded"
                          />
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-blue-600" />
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-semibold truncate max-w-md">{item.title}</h4>
                                <Badge variant="outline">notification</Badge>
                                {item.status && (
                                  <Badge variant={item.status === 'sent' ? 'default' : item.status === 'failed' ? 'destructive' : 'secondary'}>
                                    {item.status}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                To {item.author_name} • {new Date(item.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Notification</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this notification? This action cannot be undone.
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

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Email</CardTitle>
              <CardDescription>Send emails to multiple users at once</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Users</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto border rounded-lg p-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                          }
                        }}
                      />
                      <span className="text-sm">{user.full_name} ({user.role})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Enter email subject"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  className="w-full min-h-32 p-3 border rounded-lg resize-none"
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  placeholder="Enter email message"
                />
              </div>

              <Button onClick={sendBulkEmail} disabled={loading} className="w-full">
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Send Email to {selectedUsers.length} Users
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminManagement;