import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Edit, Trash2, Bell, Calendar, User, AlertTriangle, Info, Megaphone, Mail, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  content: z.string().min(1, 'Content is required'),
  type: z.enum(['general', 'urgent', 'event', 'exam']),
  priority: z.number().min(1).max(5).default(1),
  published: z.boolean().default(false),
  expires_at: z.string().optional(),
  sendEmail: z.boolean().default(false)
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'urgent' | 'event' | 'exam';
  priority: number;
  published: boolean;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

const announcementTypes = [
  { value: 'general', label: 'General', icon: Info, color: 'text-blue-600' },
  { value: 'urgent', label: 'Urgent', icon: AlertTriangle, color: 'text-red-600' },
  { value: 'event', label: 'Event', icon: Calendar, color: 'text-green-600' },
  { value: 'exam', label: 'Exam', icon: Megaphone, color: 'text-purple-600' }
];

export const AnnouncementManager = () => {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  const form = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: '',
      content: '',
      type: 'general',
      priority: 1,
      published: false,
      expires_at: '',
      sendEmail: false
    }
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast({
        title: "Error",
        description: "Failed to load announcements",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: AnnouncementFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const announcementData = {
        title: data.title,
        content: data.content,
        type: data.type,
        priority: data.priority,
        published: data.published,
        expires_at: data.expires_at ? new Date(data.expires_at).toISOString() : null
      };

      if (editingAnnouncement) {
        const { error } = await supabase
          .from('announcements')
          .update(announcementData)
          .eq('id', editingAnnouncement.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Announcement updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('announcements')
          .insert({
            ...announcementData,
            author_id: user.id
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Announcement created successfully"
        });

        // Send email notification if requested and published
        if (data.sendEmail && data.published) {
          await sendEmailNotification(data.title, data.content, 'announcement');
        }
      }

      setIsDialogOpen(false);
      setEditingAnnouncement(null);
      form.reset();
      fetchAnnouncements();
    } catch (error) {
      console.error('Error saving announcement:', error);
      toast({
        title: "Error",
        description: "Failed to save announcement",
        variant: "destructive"
      });
    }
  };

  const sendEmailNotification = async (title: string, content: string, type: string) => {
    try {
      // Get all users with email addresses (students, teachers, parents)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('email')
        .not('email', 'is', null);

      if (profilesError) throw profilesError;

      const emails = profiles
        .map(profile => profile.email)
        .filter(email => email && email.includes('@'));

      if (emails.length === 0) {
        toast({
          title: "Warning",
          description: "No email addresses found to send notifications",
          variant: "destructive"
        });
        return;
      }

      console.log(`Sending announcement email to ${emails.length} recipients`);

      // Call the Gmail edge function
      const { data: emailResult, error: emailError } = await supabase.functions.invoke('send-gmail', {
        body: {
          to: emails,
          subject: `EMRS Dornala - ANNOUNCEMENT: ${title}`,
          body: content,
          type: type
        }
      });

      if (emailError) {
        console.error('Email error:', emailError);
        toast({
          title: "Email Warning",
          description: "Announcement saved but email notifications may have failed",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: `Announcement published and email sent to ${emails.length} recipients!`,
        });
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Email Error",
        description: "Announcement saved but email notification failed",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    form.reset({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      priority: announcement.priority,
      published: announcement.published,
      expires_at: announcement.expires_at ? format(new Date(announcement.expires_at), 'yyyy-MM-dd\'T\'HH:mm') : '',
      sendEmail: false
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Announcement deleted successfully"
      });
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast({
        title: "Error",
        description: "Failed to delete announcement",
        variant: "destructive"
      });
    }
  };

  const handleNewAnnouncement = () => {
    setEditingAnnouncement(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const getTypeInfo = (type: string) => {
    return announcementTypes.find(t => t.value === type) || announcementTypes[0];
  };

  const getPriorityBadge = (priority: number) => {
    if (priority >= 4) return <Badge variant="destructive">High Priority</Badge>;
    if (priority >= 3) return <Badge variant="default">Medium Priority</Badge>;
    return <Badge variant="secondary">Low Priority</Badge>;
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Announcements</h3>
          <p className="text-sm text-gray-600">Create and manage announcements for students and parents</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewAnnouncement} className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}</DialogTitle>
              <DialogDescription>
                {editingAnnouncement ? 'Update the announcement details' : 'Create a new announcement for your school'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter announcement title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter announcement content" 
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {announcementTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center">
                                  <type.icon className={`mr-2 h-4 w-4 ${type.color}`} />
                                  {type.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority (1-5)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max="5" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="expires_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="datetime-local" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Publish Announcement</FormLabel>
                        <div className="text-sm text-gray-600">
                          Make this announcement visible to students and parents
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                     </FormItem>
                   )}
                 />
                 <FormField
                   control={form.control}
                   name="sendEmail"
                   render={({ field }) => (
                     <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                       <div className="space-y-0.5">
                         <FormLabel className="text-base">Send Email Notification</FormLabel>
                         <div className="text-sm text-gray-600">
                           Send this announcement to all students, teachers, and parents via email
                         </div>
                       </div>
                       <FormControl>
                         <Switch
                           checked={field.value}
                           onCheckedChange={field.onChange}
                         />
                       </FormControl>
                     </FormItem>
                   )}
                 />
                 <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingAnnouncement ? 'Update' : 'Create'} Announcement
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {announcements.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-400 mb-4">
                <Bell className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No announcements yet</h3>
              <p className="text-gray-600 text-center mb-4">
                Create your first announcement to share important updates with students and parents.
              </p>
              <Button onClick={handleNewAnnouncement}>
                <Plus className="mr-2 h-4 w-4" />
                Create Announcement
              </Button>
            </CardContent>
          </Card>
        ) : (
          announcements.map((item) => {
            const typeInfo = getTypeInfo(item.type);
            const TypeIcon = typeInfo.icon;
            
            return (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <TypeIcon className={`mr-2 h-5 w-5 ${typeInfo.color}`} />
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                      </div>
                      <CardDescription className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        {format(new Date(item.created_at), 'MMM dd, yyyy')}
                        <span className="mx-2">•</span>
                        <User className="mr-1 h-4 w-4" />
                        You
                        {item.expires_at && (
                          <>
                            <span className="mx-2">•</span>
                            Expires: {format(new Date(item.expires_at), 'MMM dd, yyyy')}
                          </>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getPriorityBadge(item.priority)}
                      <Badge variant={item.published ? "default" : "secondary"}>
                        {item.published ? "Published" : "Draft"}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-3">{item.content}</p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};