import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, User, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { NewsManager } from '@/components/teacher/NewsManager';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author: {
    full_name: string;
  };
}

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showManager, setShowManager] = useState(false);
  const { profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select(`
          id,
          title,
          content,
          created_at,
          author:profiles(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: "Error",
        description: "Failed to load news",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-3xl font-bold text-gray-900">News</h1>
          <p className="text-gray-600 mt-2">Latest news and updates</p>
        </div>
        {(profile?.role === 'teacher' || profile?.role === 'admin') && (
          <Button onClick={() => setShowManager(!showManager)}>
            <Plus className="mr-2 h-4 w-4" />
            {showManager ? 'View News' : 'Manage News'}
          </Button>
        )}
      </div>

      {showManager && (profile?.role === 'teacher' || profile?.role === 'admin') ? (
        <NewsManager />
      ) : (
        <div className="grid gap-6">
          {news.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No news available</h3>
                <p className="text-gray-600 text-center">
                  There are no news articles to display at the moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            news.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {item.author?.full_name || 'Unknown Author'}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(item.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      <FileText className="h-3 w-3 mr-1" />
                      News
                    </Badge>
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

export default News;