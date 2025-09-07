// Real-time Service
// Handles Supabase real-time subscriptions for live updates

import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface RealtimeCallback<T = any> {
  (payload: T): void;
}

export interface RealtimeSubscription {
  channel: RealtimeChannel;
  unsubscribe: () => void;
}

class RealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map();

  /**
   * Subscribe to announcements updates
   */
  subscribeToAnnouncements(callback: RealtimeCallback): RealtimeSubscription {
    const channel = supabase
      .channel('announcements')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'announcements',
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    this.channels.set('announcements', channel);

    return {
      channel,
      unsubscribe: () => {
        channel.unsubscribe();
        this.channels.delete('announcements');
      },
    };
  }

  /**
   * Subscribe to news updates
   */
  subscribeToNews(callback: RealtimeCallback): RealtimeSubscription {
    const channel = supabase
      .channel('news')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'news',
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    this.channels.set('news', channel);

    return {
      channel,
      unsubscribe: () => {
        channel.unsubscribe();
        this.channels.delete('news');
      },
    };
  }

  /**
   * Subscribe to events updates
   */
  subscribeToEvents(callback: RealtimeCallback): RealtimeSubscription {
    const channel = supabase
      .channel('events')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    this.channels.set('events', channel);

    return {
      channel,
      unsubscribe: () => {
        channel.unsubscribe();
        this.channels.delete('events');
      },
    };
  }

  /**
   * Subscribe to exam results updates for a specific student
   */
  subscribeToStudentExamResults(
    studentId: string,
    callback: RealtimeCallback
  ): RealtimeSubscription {
    const channel = supabase
      .channel(`exam_results_${studentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'exam_results',
          filter: `student_id=eq.${studentId}`,
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    this.channels.set(`exam_results_${studentId}`, channel);

    return {
      channel,
      unsubscribe: () => {
        channel.unsubscribe();
        this.channels.delete(`exam_results_${studentId}`);
      },
    };
  }

  /**
   * Subscribe to exam results updates for a specific teacher
   */
  subscribeToTeacherExamResults(
    teacherId: string,
    callback: RealtimeCallback
  ): RealtimeSubscription {
    const channel = supabase
      .channel(`teacher_exam_results_${teacherId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'exam_results',
          filter: `teacher_id=eq.${teacherId}`,
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    this.channels.set(`teacher_exam_results_${teacherId}`, channel);

    return {
      channel,
      unsubscribe: () => {
        channel.unsubscribe();
        this.channels.delete(`teacher_exam_results_${teacherId}`);
      },
    };
  }

  /**
   * Subscribe to notifications for a specific user
   */
  subscribeToNotifications(
    userId: string,
    callback: RealtimeCallback
  ): RealtimeSubscription {
    const channel = supabase
      .channel(`notifications_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    this.channels.set(`notifications_${userId}`, channel);

    return {
      channel,
      unsubscribe: () => {
        channel.unsubscribe();
        this.channels.delete(`notifications_${userId}`);
      },
    };
  }

  /**
   * Subscribe to general content updates (news, announcements, events)
   */
  subscribeToContentUpdates(callback: RealtimeCallback): RealtimeSubscription {
    const channel = supabase
      .channel('content_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'news',
        },
        (payload) => {
          callback({ ...payload, table: 'news' });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'announcements',
        },
        (payload) => {
          callback({ ...payload, table: 'announcements' });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
        },
        (payload) => {
          callback({ ...payload, table: 'events' });
        }
      )
      .subscribe();

    this.channels.set('content_updates', channel);

    return {
      channel,
      unsubscribe: () => {
        channel.unsubscribe();
        this.channels.delete('content_updates');
      },
    };
  }

  /**
   * Subscribe to user profile updates
   */
  subscribeToProfileUpdates(
    userId: string,
    callback: RealtimeCallback
  ): RealtimeSubscription {
    const channel = supabase
      .channel(`profile_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    this.channels.set(`profile_${userId}`, channel);

    return {
      channel,
      unsubscribe: () => {
        channel.unsubscribe();
        this.channels.delete(`profile_${userId}`);
      },
    };
  }

  /**
   * Subscribe to all updates for admin dashboard
   */
  subscribeToAdminUpdates(callback: RealtimeCallback): RealtimeSubscription {
    const channel = supabase
      .channel('admin_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          callback({ ...payload, table: 'profiles' });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'news',
        },
        (payload) => {
          callback({ ...payload, table: 'news' });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'announcements',
        },
        (payload) => {
          callback({ ...payload, table: 'announcements' });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
        },
        (payload) => {
          callback({ ...payload, table: 'events' });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'exam_results',
        },
        (payload) => {
          callback({ ...payload, table: 'exam_results' });
        }
      )
      .subscribe();

    this.channels.set('admin_updates', channel);

    return {
      channel,
      unsubscribe: () => {
        channel.unsubscribe();
        this.channels.delete('admin_updates');
      },
    };
  }

  /**
   * Unsubscribe from a specific channel
   */
  unsubscribe(channelName: string): void {
    const channel = this.channels.get(channelName);
    if (channel) {
      channel.unsubscribe();
      this.channels.delete(channelName);
    }
  }

  /**
   * Unsubscribe from all channels
   */
  unsubscribeAll(): void {
    this.channels.forEach((channel) => {
      channel.unsubscribe();
    });
    this.channels.clear();
  }

  /**
   * Get active channels count
   */
  getActiveChannelsCount(): number {
    return this.channels.size;
  }

  /**
   * Check if a channel is active
   */
  isChannelActive(channelName: string): boolean {
    return this.channels.has(channelName);
  }
}

// Create singleton instance
export const realtimeService = new RealtimeService();

export default realtimeService;
