import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  BookOpen, 
  Bell, 
  Calendar, 
  Trophy, 
  Users, 
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Send,
  FileText,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Save,
  X
} from 'lucide-react';
import { contentService } from '@/lib/content';
import { notificationService } from '@/lib/notifications';
import { realtimeService } from '@/lib/realtime';
import { supabase } from '@/integrations/supabase/client';

const TeacherPortal = () => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [contentStats, setContentStats] = useState<any>({});
  const [examResults, setExamResults] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
  });

  // Form states
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'general',
    priority: 0,
    published: false,
  });
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    max_participants: null,
    registration_required: false,
  });
  const [newNews, setNewNews] = useState({
    title: '',
    content: '',
    published: false,
  });
  const [newExamResult, setNewExamResult] = useState({
    student_id: '',
    exam_name: '',
    subject: '',
    exam_date: '',
    marks_obtained: 0,
    total_marks: 100,
    grade: '',
  });

  useEffect(() => {
    if (profile?.id) {
      loadTeacherData();
      setupRealtimeSubscriptions();
    }

    return () => {
      realtimeService.unsubscribeAll();
    };
  }, [profile?.id]);

  const loadTeacherData = async () => {
    if (!profile?.id) return;

    setLoading(true);
    try {
      const [stats, examResultsData, announcementsData, eventsData, newsData] = await Promise.all([
        contentService.getContentStats(),
        contentService.getTeacherExamResults(profile.id),
        contentService.getAnnouncements({ authorId: profile.id }),
        contentService.getEvents({ authorId: profile.id }),
        contentService.getNews({ authorId: profile.id }),
      ]);

      setContentStats(stats);
      setExamResults(examResultsData);
      setAnnouncements(announcementsData);
      setEvents(eventsData);
      setNews(newsData);
    } catch (error) {
      console.error('Failed to load teacher data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    if (!profile?.id) return;

    // Subscribe to content updates
    realtimeService.subscribeToContentUpdates((payload) => {
      loadTeacherData(); // Reload data
    });

    // Subscribe to exam results updates
    realtimeService.subscribeToTeacherExamResults(profile.id, (payload) => {
      loadTeacherData(); // Reload data
    });
  };

  const handleCreateAnnouncement = async () => {
    try {
      const announcement = await contentService.createAnnouncement({
        ...newAnnouncement,
        type: newAnnouncement.type as "general" | "urgent" | "event" | "exam"
      });
      if (announcement) {
        setNewAnnouncement({
          title: '',
          content: '',
          type: 'general',
          priority: 0,
          published: false,
        });
        loadTeacherData();
      }
    } catch (error) {
      console.error('Failed to create announcement:', error);
    }
  };

  const handleCreateEvent = async () => {
    try {
      const event = await contentService.createEvent(newEvent);
      if (event) {
        setNewEvent({
          title: '',
          description: '',
          event_date: '',
          location: '',
          max_participants: null,
          registration_required: false,
        });
        loadTeacherData();
      }
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleCreateNews = async () => {
    try {
      const news = await contentService.createNews(newNews);
      if (news) {
        setNewNews({
          title: '',
          content: '',
          published: false,
        });
        loadTeacherData();
      }
    } catch (error) {
      console.error('Failed to create news:', error);
    }
  };

  const handleCreateExamResult = async () => {
    try {
      const examResult = await contentService.createExamResult(newExamResult);
      if (examResult) {
        setNewExamResult({
          student_id: '',
          exam_name: '',
          subject: '',
          exam_date: '',
          marks_obtained: 0,
          total_marks: 100,
          grade: '',
        });
        loadTeacherData();
      }
    } catch (error) {
      console.error('Failed to create exam result:', error);
    }
  };

  const handlePublishAnnouncement = async (id: string) => {
    try {
      await contentService.publishAnnouncement(id);
      loadTeacherData();
    } catch (error) {
      console.error('Failed to publish announcement:', error);
    }
  };

  const handlePublishExamResult = async (id: string) => {
    try {
      await contentService.publishExamResult(id);
      loadTeacherData();
    } catch (error) {
      console.error('Failed to publish exam result:', error);
    }
  };

  const handleDeleteContent = async (type: string, id: string) => {
    try {
      let success = false;
      switch (type) {
        case 'announcement':
          // Delete functionality to be implemented
          success = false;
          break;
        case 'event':
          // Delete functionality to be implemented
          success = false;
          break;
        case 'news':
          success = await contentService.deleteNews(id);
          break;
        case 'exam_result':
          // Delete functionality to be implemented
          success = false;
          break;
      }
      
      if (success) {
        loadTeacherData();
      }
    } catch (error) {
      console.error('Failed to delete content:', error);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', profile?.id);

      if (error) throw error;

      setIsEditing(false);
      // Reload profile data
      loadTeacherData();
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !contentStats.totalNews) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground animate-spin" />
          <h2 className="text-2xl font-semibold">Loading your portal...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teacher Portal</h1>
          <p className="text-muted-foreground">Manage your content and students, {profile?.full_name}!</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {examResults.length} students
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{examResults.length}</div>
            <p className="text-xs text-muted-foreground">Students in your classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Grades</CardTitle>
            <Trophy className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentStats.pendingExamResults || 0}</div>
            <p className="text-xs text-muted-foreground">Awaiting publication</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Announcements</CardTitle>
            <Bell className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcements.length}</div>
            <p className="text-xs text-muted-foreground">Total created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">Total created</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="exam-results">Exam Results</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                {announcements.slice(0, 3).map((announcement) => (
                  <div key={announcement.id} className="flex items-center justify-between p-3 border rounded-lg mb-2">
                    <div>
                      <h4 className="font-medium">{announcement.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={announcement.published ? 'default' : 'secondary'}>
                      {announcement.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Exam Results</CardTitle>
              </CardHeader>
              <CardContent>
                {examResults.slice(0, 3).map((result) => (
                  <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg mb-2">
                    <div>
                      <h4 className="font-medium">{result.exam_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {result.student?.full_name} • {result.subject}
                      </p>
                    </div>
                    <Badge variant={result.status === 'published' ? 'default' : 'secondary'}>
                      {result.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Announcements Tab */}
        <TabsContent value="announcements" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Announcements</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Announcement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Announcement</DialogTitle>
                  <DialogDescription>
                    Create an announcement to share with students and parents
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="announcement-title">Title</Label>
                    <Input
                      id="announcement-title"
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="announcement-content">Content</Label>
                    <Textarea
                      id="announcement-content"
                      value={newAnnouncement.content}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="announcement-type">Type</Label>
                      <Select
                        value={newAnnouncement.type}
                        onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="exam">Exam</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="announcement-priority">Priority</Label>
                      <Input
                        id="announcement-priority"
                        type="number"
                        min="0"
                        max="10"
                        value={newAnnouncement.priority}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="announcement-published"
                      checked={newAnnouncement.published}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, published: e.target.checked })}
                    />
                    <Label htmlFor="announcement-published">Publish immediately</Label>
                  </div>
                  <Button onClick={handleCreateAnnouncement} className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Create Announcement
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      <CardDescription>
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{announcement.type}</Badge>
                      <Badge variant={announcement.published ? 'default' : 'secondary'}>
                        {announcement.published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{announcement.content}</p>
                  <div className="flex items-center space-x-2">
                    {!announcement.published && (
                      <Button
                        size="sm"
                        onClick={() => handlePublishAnnouncement(announcement.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Publish
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteContent('announcement', announcement.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Events</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>
                    Create an event for students and parents
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-title">Title</Label>
                    <Input
                      id="event-title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-description">Description</Label>
                    <Textarea
                      id="event-description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-date">Event Date</Label>
                      <Input
                        id="event-date"
                        type="datetime-local"
                        value={newEvent.event_date}
                        onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="event-location">Location</Label>
                      <Input
                        id="event-location"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-participants">Max Participants</Label>
                      <Input
                        id="event-participants"
                        type="number"
                        value={newEvent.max_participants || ''}
                        onChange={(e) => setNewEvent({ ...newEvent, max_participants: parseInt(e.target.value) || null })}
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <input
                        type="checkbox"
                        id="event-registration"
                        checked={newEvent.registration_required}
                        onChange={(e) => setNewEvent({ ...newEvent, registration_required: e.target.checked })}
                      />
                      <Label htmlFor="event-registration">Registration Required</Label>
                    </div>
                  </div>
                  <Button onClick={handleCreateEvent} className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription>
                        {new Date(event.event_date).toLocaleString()}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">
                      {event.registration_required ? 'Registration Required' : 'Open Event'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {event.description && (
                    <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {event.location && `📍 ${event.location}`}
                      {event.max_participants && ` • Max ${event.max_participants} participants`}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteContent('event', event.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* News Tab */}
        <TabsContent value="news" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">News Articles</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create News
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create News Article</DialogTitle>
                  <DialogDescription>
                    Create a news article for the school
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="news-title">Title</Label>
                    <Input
                      id="news-title"
                      value={newNews.title}
                      onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="news-content">Content</Label>
                    <Textarea
                      id="news-content"
                      value={newNews.content}
                      onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                      rows={6}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="news-published"
                      checked={newNews.published}
                      onChange={(e) => setNewNews({ ...newNews, published: e.target.checked })}
                    />
                    <Label htmlFor="news-published">Publish immediately</Label>
                  </div>
                  <Button onClick={handleCreateNews} className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Create News
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {news.map((article) => (
              <Card key={article.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                      <CardDescription>
                        {new Date(article.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant={article.published ? 'default' : 'secondary'}>
                      {article.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{article.content}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteContent('news', article.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Exam Results Tab */}
        <TabsContent value="exam-results" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Exam Results</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Exam Result
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Exam Result</DialogTitle>
                  <DialogDescription>
                    Add exam results for a student
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="exam-student">Student ID</Label>
                      <Input
                        id="exam-student"
                        value={newExamResult.student_id}
                        onChange={(e) => setNewExamResult({ ...newExamResult, student_id: e.target.value })}
                        placeholder="Enter student ID"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exam-name">Exam Name</Label>
                      <Input
                        id="exam-name"
                        value={newExamResult.exam_name}
                        onChange={(e) => setNewExamResult({ ...newExamResult, exam_name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="exam-subject">Subject</Label>
                      <Input
                        id="exam-subject"
                        value={newExamResult.subject}
                        onChange={(e) => setNewExamResult({ ...newExamResult, subject: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exam-date">Exam Date</Label>
                      <Input
                        id="exam-date"
                        type="date"
                        value={newExamResult.exam_date}
                        onChange={(e) => setNewExamResult({ ...newExamResult, exam_date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="exam-marks">Marks Obtained</Label>
                      <Input
                        id="exam-marks"
                        type="number"
                        value={newExamResult.marks_obtained}
                        onChange={(e) => setNewExamResult({ ...newExamResult, marks_obtained: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exam-total">Total Marks</Label>
                      <Input
                        id="exam-total"
                        type="number"
                        value={newExamResult.total_marks}
                        onChange={(e) => setNewExamResult({ ...newExamResult, total_marks: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exam-grade">Grade</Label>
                      <Input
                        id="exam-grade"
                        value={newExamResult.grade}
                        onChange={(e) => setNewExamResult({ ...newExamResult, grade: e.target.value })}
                        placeholder="A+, A, B+, etc."
                      />
                    </div>
                  </div>
                  <Button onClick={handleCreateExamResult} className="w-full">
                    <Trophy className="h-4 w-4 mr-2" />
                    Add Exam Result
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {examResults.map((result) => (
              <Card key={result.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{result.exam_name}</CardTitle>
                      <CardDescription>
                        {result.student?.full_name} • {result.subject} • {new Date(result.exam_date).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant={result.status === 'published' ? 'default' : 'secondary'}>
                      {result.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold">
                      {result.marks_obtained}/{result.total_marks}
                    </div>
                    <div className="text-right">
                      {result.grade && (
                        <div className="text-lg font-medium">{result.grade}</div>
                      )}
                      <div className="text-sm text-muted-foreground">
                        {((result.marks_obtained / result.total_marks) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {result.status !== 'published' && (
                      <Button
                        size="sm"
                        onClick={() => handlePublishExamResult(result.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Publish
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteContent('exam_result', result.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Manage your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={profileData.full_name}
                        onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                    value={user?.email || ''}
                        disabled
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value={profile?.role || 'teacher'}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleProfileUpdate} disabled={loading}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                      <p className="text-sm">{profile?.full_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                      <p className="text-sm text-blue-600">{profile?.email || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                      <p className="text-sm">{profile?.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                      <p className="text-sm">{profile?.role || 'teacher'}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                    <p className="text-sm">{profile?.address || 'Not provided'}</p>
                  </div>
                  <div className="pt-4">
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherPortal;
