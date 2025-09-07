import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, User, Plus, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { AnnouncementManager } from '@/components/teacher/AnnouncementManager';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: number;
  created_at: string;
}

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showManager, setShowManager] = useState(false);
  const { profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select(`
          id,
          title,
          content,
          priority,
          created_at
        `)
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

  const getPriorityColor = (priority: number) => {
    if (priority >= 4) {
      return 'bg-red-100 text-red-700 border-red-200';
    } else if (priority >= 2) {
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    } else {
      return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getPriorityText = (priority: number) => {
    if (priority >= 4) return 'High';
    if (priority >= 2) return 'Medium';
    return 'Low';
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600 mt-2">Important announcements and notices</p>
        </div>
        {(profile?.role === 'teacher' || profile?.role === 'admin') && (
          <Button onClick={() => setShowManager(!showManager)}>
            <Plus className="mr-2 h-4 w-4" />
            {showManager ? 'View Announcements' : 'Manage Announcements'}
          </Button>
        )}
      </div>

      {showManager && (profile?.role === 'teacher' || profile?.role === 'admin') ? (
        <AnnouncementManager />
      ) : (
        <div className="grid gap-6">
          {announcements.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No announcements</h3>
                <p className="text-gray-600 text-center">
                  There are no announcements to display at the moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            announcements.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 flex items-center">
                        {item.priority >= 4 && (
                          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        {item.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          School Administration
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(item.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className={getPriorityColor(item.priority)}>
                        {getPriorityText(item.priority)} Priority
                      </Badge>
                      <Badge variant="secondary">
                        <Bell className="h-3 w-3 mr-1" />
                        Announcement
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">{item.content}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Announcements;