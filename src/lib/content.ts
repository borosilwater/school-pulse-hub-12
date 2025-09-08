// Content Management Service
// Handles CRUD operations for news, announcements, events, and exam results

import { supabase } from '@/integrations/supabase/client';
import { notificationService } from './notifications';
import type { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables'];
type News = Tables['news']['Row'];
type NewsInsert = Tables['news']['Insert'];
type NewsUpdate = Tables['news']['Update'];
type Announcement = Tables['announcements']['Row'];
type AnnouncementInsert = Tables['announcements']['Insert'];
type AnnouncementUpdate = Tables['announcements']['Update'];
type Event = Tables['events']['Row'];
type EventInsert = Tables['events']['Insert'];
type EventUpdate = Tables['events']['Update'];
type ExamResult = Tables['exam_results']['Row'];
type ExamResultInsert = Tables['exam_results']['Insert'];
type ExamResultUpdate = Tables['exam_results']['Update'];

export interface ContentFilters {
  published?: boolean;
  authorId?: string;
  type?: string;
  limit?: number;
  offset?: number;
}

class ContentService {
  // ==================== NEWS MANAGEMENT ====================

  /**
   * Get all news articles
   */
  async getNews(filters: ContentFilters = {}): Promise<News[]> {
    try {
      let query = supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.published !== undefined) {
        query = query.eq('published', filters.published);
      }

      if (filters.authorId) {
        query = query.eq('author_id', filters.authorId);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Failed to fetch news:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch news:', error);
      return [];
    }
  }

  /**
   * Get single news article
   */
  async getNewsById(id: string): Promise<News | null> {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Failed to fetch news article:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to fetch news article:', error);
      return null;
    }
  }

  /**
   * Create news article
   */
  async createNews(news: Omit<NewsInsert, 'author_id'>): Promise<News | null> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('news')
        .insert({
          ...news,
          author_id: user.id,
        })
        .select('*')
        .single();

      if (error) {
        console.error('Failed to create news article:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to create news article:', error);
      return null;
    }
  }

  /**
   * Update news article
   */
  async updateNews(id: string, updates: NewsUpdate): Promise<News | null> {
    try {
      const { data, error } = await supabase
        .from('news')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        console.error('Failed to update news article:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to update news article:', error);
      return null;
    }
  }

  /**
   * Delete news article
   */
  async deleteNews(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Failed to delete news article:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to delete news article:', error);
      return false;
    }
  }

  // ==================== ANNOUNCEMENTS MANAGEMENT ====================

  /**
   * Get all announcements
   */
  async getAnnouncements(filters: ContentFilters = {}): Promise<Announcement[]> {
    try {
      let query = supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.published !== undefined) {
        query = query.eq('published', filters.published);
      }

      if (filters.authorId) {
        query = query.eq('author_id', filters.authorId);
      }

      if (filters.type) {
        query = query.eq('type', filters.type as Database["public"]["Enums"]["announcement_type"]);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Failed to fetch announcements:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
      return [];
    }
  }

  /**
   * Create announcement
   */
  async createAnnouncement(announcement: Omit<AnnouncementInsert, 'author_id'>): Promise<Announcement | null> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('announcements')
        .insert({
          ...announcement,
          author_id: user.id,
        })
        .select('*')
        .single();

      if (error) {
        console.error('Failed to create announcement:', error);
        return null;
      }

      // Send notification if published
      if (announcement.published) {
        await this.notifyAnnouncement(data);
      }

      return data;
    } catch (error) {
      console.error('Failed to create announcement:', error);
      return null;
    }
  }

  /**
   * Publish announcement and notify users
   */
  async publishAnnouncement(id: string): Promise<boolean> {
    try {
      // Update announcement status
      const { data: announcement, error: updateError } = await supabase
        .from('announcements')
        .update({ published: true })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        console.error('Failed to publish announcement:', updateError);
        return false;
      }

      // Send notifications
      await this.notifyAnnouncement(announcement);

      return true;
    } catch (error) {
      console.error('Failed to publish announcement:', error);
      return false;
    }
  }

  /**
   * Notify users about announcement
   */
  private async notifyAnnouncement(announcement: Announcement): Promise<void> {
    try {
      // Get all student and teacher IDs
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id')
        .in('role', ['student', 'teacher']);

      if (profiles && profiles.length > 0) {
        const userIds = profiles.map(p => p.user_id);
        await notificationService.sendAnnouncementNotification(
          userIds,
          announcement.title,
          announcement.content
        );
      }
    } catch (error) {
      console.error('Failed to notify about announcement:', error);
    }
  }

  // ==================== EVENTS MANAGEMENT ====================

  /**
   * Get all events
   */
  async getEvents(filters: ContentFilters = {}): Promise<Event[]> {
    try {
      let query = supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (filters.authorId) {
        query = query.eq('organizer_id', filters.authorId);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Failed to fetch events:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch events:', error);
      return [];
    }
  }

  /**
   * Create event
   */
  async createEvent(event: Omit<EventInsert, 'organizer_id'>): Promise<Event | null> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('events')
        .insert({
          ...event,
          organizer_id: user.id,
        })
        .select('*')
        .single();

      if (error) {
        console.error('Failed to create event:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to create event:', error);
      return null;
    }
  }

  // ==================== EXAM RESULTS MANAGEMENT ====================

  /**
   * Get exam results for a student
   */
  async getStudentExamResults(studentId: string): Promise<ExamResult[]> {
    try {
      const { data, error } = await supabase
        .from('exam_results')
        .select('*')
        .eq('student_id', studentId)
        .order('exam_date', { ascending: false });

      if (error) {
        console.error('Failed to fetch exam results:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch exam results:', error);
      return [];
    }
  }

  /**
   * Get exam results created by a teacher
   */
  async getTeacherExamResults(teacherId: string): Promise<ExamResult[]> {
    try {
      const { data, error } = await supabase
        .from('exam_results')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('exam_date', { ascending: false });

      if (error) {
        console.error('Failed to fetch exam results:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch exam results:', error);
      return [];
    }
  }

  /**
   * Create exam result
   */
  async createExamResult(examResult: Omit<ExamResultInsert, 'teacher_id'>): Promise<ExamResult | null> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('exam_results')
        .insert({
          ...examResult,
          teacher_id: user.id,
        })
        .select('*')
        .single();

      if (error) {
        console.error('Failed to create exam result:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to create exam result:', error);
      return null;
    }
  }

  /**
   * Publish exam result and notify student
   */
  async publishExamResult(id: string): Promise<boolean> {
    try {
      // Update exam result status
      const { data: examResult, error: updateError } = await supabase
        .from('exam_results')
        .update({ 
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*')
        .single();

      if (updateError) {
        console.error('Failed to publish exam result:', updateError);
        return false;
      }

      // Send notification to student
      await notificationService.sendExamResultNotification(
        examResult.student_id,
        examResult.exam_name,
        examResult.grade || 'N/A',
        'Student'
      );

      return true;
    } catch (error) {
      console.error('Failed to publish exam result:', error);
      return false;
    }
  }

  /**
   * Get content statistics
   */
  async getContentStats(): Promise<{
    totalNews: number;
    totalAnnouncements: number;
    totalEvents: number;
    totalExamResults: number;
    publishedNews: number;
    publishedAnnouncements: number;
    pendingExamResults: number;
  }> {
    try {
      const [
        newsCount,
        announcementsCount,
        eventsCount,
        examResultsCount,
        publishedNewsCount,
        publishedAnnouncementsCount,
        pendingExamResultsCount
      ] = await Promise.all([
        supabase.from('news').select('*', { count: 'exact', head: true }),
        supabase.from('announcements').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('exam_results').select('*', { count: 'exact', head: true }),
        supabase.from('news').select('*', { count: 'exact', head: true }).eq('published', true),
        supabase.from('announcements').select('*', { count: 'exact', head: true }).eq('published', true),
        supabase.from('exam_results').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);

      return {
        totalNews: newsCount.count || 0,
        totalAnnouncements: announcementsCount.count || 0,
        totalEvents: eventsCount.count || 0,
        totalExamResults: examResultsCount.count || 0,
        publishedNews: publishedNewsCount.count || 0,
        publishedAnnouncements: publishedAnnouncementsCount.count || 0,
        pendingExamResults: pendingExamResultsCount.count || 0,
      };
    } catch (error) {
      console.error('Failed to fetch content stats:', error);
      return {
        totalNews: 0,
        totalAnnouncements: 0,
        totalEvents: 0,
        totalExamResults: 0,
        publishedNews: 0,
        publishedAnnouncements: 0,
        pendingExamResults: 0,
      };
    }
  }
}

// Create singleton instance
export const contentService = new ContentService();

export default contentService;
