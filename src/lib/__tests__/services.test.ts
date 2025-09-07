// Comprehensive test suite for all services
// This file tests the core functionality of our application

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { contentService } from '../content';
import { notificationService } from '../notifications';
import { twilioService, smsTemplates } from '../twilio';
import { realtimeService } from '../realtime';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            data: { id: '1', full_name: 'Test User', role: 'student' },
            error: null
          }))
        })),
        order: vi.fn(() => ({
          limit: vi.fn(() => ({
            data: [],
            error: null
          }))
        })),
        limit: vi.fn(() => ({
          data: [],
          error: null
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: { id: '1', title: 'Test', content: 'Test content' },
            error: null
          }))
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              data: { id: '1', published: true },
              error: null
            }))
          }))
        }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: null,
          error: null
        }))
      }))
    })),
    auth: {
      getUser: vi.fn(() => ({
        data: { user: { id: '1' } }
      }))
    },
    channel: vi.fn(() => ({
      on: vi.fn(() => ({
        subscribe: vi.fn()
      }))
    }))
  }
}));

// Mock fetch for Twilio API
global.fetch = vi.fn();

describe('Content Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('News Management', () => {
    it('should fetch news articles', async () => {
      const news = await contentService.getNews();
      expect(Array.isArray(news)).toBe(true);
    });

    it('should create news article', async () => {
      const newsData = {
        title: 'Test News',
        content: 'Test content',
        published: false
      };
      
      const result = await contentService.createNews(newsData);
      expect(result).toBeDefined();
    });

    it('should update news article', async () => {
      const updates = { title: 'Updated Title' };
      const result = await contentService.updateNews('1', updates);
      expect(result).toBeDefined();
    });

    it('should delete news article', async () => {
      const result = await contentService.deleteNews('1');
      expect(result).toBe(true);
    });
  });

  describe('Announcements Management', () => {
    it('should fetch announcements', async () => {
      const announcements = await contentService.getAnnouncements();
      expect(Array.isArray(announcements)).toBe(true);
    });

    it('should create announcement', async () => {
      const announcementData = {
        title: 'Test Announcement',
        content: 'Test content',
        type: 'general' as const,
        priority: 0,
        published: false
      };
      
      const result = await contentService.createAnnouncement(announcementData);
      expect(result).toBeDefined();
    });

    it('should publish announcement', async () => {
      const result = await contentService.publishAnnouncement('1');
      expect(result).toBe(true);
    });
  });

  describe('Events Management', () => {
    it('should fetch events', async () => {
      const events = await contentService.getEvents();
      expect(Array.isArray(events)).toBe(true);
    });

    it('should create event', async () => {
      const eventData = {
        title: 'Test Event',
        description: 'Test description',
        event_date: '2024-01-01T10:00:00Z',
        location: 'Test Location'
      };
      
      const result = await contentService.createEvent(eventData);
      expect(result).toBeDefined();
    });
  });

  describe('Exam Results Management', () => {
    it('should fetch student exam results', async () => {
      const results = await contentService.getStudentExamResults('1');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should fetch teacher exam results', async () => {
      const results = await contentService.getTeacherExamResults('1');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should create exam result', async () => {
      const examData = {
        student_id: '1',
        exam_name: 'Test Exam',
        subject: 'Math',
        exam_date: '2024-01-01',
        marks_obtained: 85,
        total_marks: 100,
        grade: 'A'
      };
      
      const result = await contentService.createExamResult(examData);
      expect(result).toBeDefined();
    });

    it('should publish exam result', async () => {
      const result = await contentService.publishExamResult('1');
      expect(result).toBe(true);
    });
  });

  describe('Content Statistics', () => {
    it('should fetch content statistics', async () => {
      const stats = await contentService.getContentStats();
      expect(stats).toHaveProperty('totalNews');
      expect(stats).toHaveProperty('totalAnnouncements');
      expect(stats).toHaveProperty('totalEvents');
      expect(stats).toHaveProperty('totalExamResults');
    });
  });
});

describe('Notification Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('SMS Notifications', () => {
    it('should send SMS notification', async () => {
      const notification = {
        type: 'sms' as const,
        title: 'Test SMS',
        message: 'Test message',
        userId: '1'
      };
      
      const result = await notificationService.sendNotification(notification);
      expect(typeof result).toBe('boolean');
    });

    it('should send bulk notifications', async () => {
      const notification = {
        type: 'sms' as const,
        title: 'Bulk SMS',
        message: 'Bulk message',
        userIds: ['1', '2', '3']
      };
      
      const result = await notificationService.sendBulkNotifications(notification);
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('failed');
      expect(result).toHaveProperty('total');
    });

    it('should send exam result notification', async () => {
      const result = await notificationService.sendExamResultNotification(
        '1',
        'Math Exam',
        'A',
        'John Doe'
      );
      expect(typeof result).toBe('boolean');
    });

    it('should send announcement notification', async () => {
      const result = await notificationService.sendAnnouncementNotification(
        ['1', '2'],
        'Important Announcement',
        'This is an important message'
      );
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('failed');
      expect(result).toHaveProperty('total');
    });
  });

  describe('Notification Management', () => {
    it('should get user notifications', async () => {
      const notifications = await notificationService.getUserNotifications('1');
      expect(Array.isArray(notifications)).toBe(true);
    });

    it('should mark notification as read', async () => {
      const result = await notificationService.markAsRead('1');
      expect(typeof result).toBe('boolean');
    });

    it('should mark all notifications as read', async () => {
      const result = await notificationService.markAllAsRead('1');
      expect(typeof result).toBe('boolean');
    });

    it('should get unread count', async () => {
      const count = await notificationService.getUnreadCount('1');
      expect(typeof count).toBe('number');
    });
  });
});

describe('Twilio Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('SMS Functionality', () => {
    it('should validate phone number format', () => {
      expect(twilioService.validatePhoneNumber('+1234567890')).toBe(true);
      expect(twilioService.validatePhoneNumber('1234567890')).toBe(false);
      expect(twilioService.validatePhoneNumber('invalid')).toBe(false);
    });

    it('should format phone number to E.164', () => {
      expect(twilioService.formatPhoneNumber('1234567890')).toBe('+11234567890');
      expect(twilioService.formatPhoneNumber('+1234567890')).toBe('+1234567890');
    });

    it('should send SMS message', async () => {
      // Mock successful response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ sid: 'test-sid' })
      });

      const result = await twilioService.sendSMS({
        to: '+1234567890',
        body: 'Test message'
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('test-sid');
    });

    it('should handle SMS sending errors', async () => {
      // Mock error response
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Invalid phone number' })
      });

      const result = await twilioService.sendSMS({
        to: 'invalid',
        body: 'Test message'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should send bulk SMS messages', async () => {
      // Mock successful responses
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({ sid: 'test-sid' })
      });

      const messages = [
        { to: '+1234567890', body: 'Message 1' },
        { to: '+1234567891', body: 'Message 2' }
      ];

      const results = await twilioService.sendBulkSMS(messages);
      expect(results).toHaveLength(2);
      expect(results.every(r => r.success)).toBe(true);
    });
  });

  describe('SMS Templates', () => {
    it('should generate exam result template', () => {
      const template = smsTemplates.examResult('John Doe', 'Math Exam', 'A');
      expect(template).toContain('John Doe');
      expect(template).toContain('Math Exam');
      expect(template).toContain('A');
    });

    it('should generate announcement template', () => {
      const template = smsTemplates.announcement('Important', 'This is important');
      expect(template).toContain('Important');
      expect(template).toContain('This is important');
    });

    it('should generate event reminder template', () => {
      const template = smsTemplates.eventReminder('School Event', '2024-01-01', 'Auditorium');
      expect(template).toContain('School Event');
      expect(template).toContain('2024-01-01');
      expect(template).toContain('Auditorium');
    });
  });
});

describe('Realtime Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Subscription Management', () => {
    it('should subscribe to announcements', () => {
      const callback = vi.fn();
      const subscription = realtimeService.subscribeToAnnouncements(callback);
      
      expect(subscription).toHaveProperty('channel');
      expect(subscription).toHaveProperty('unsubscribe');
      expect(typeof subscription.unsubscribe).toBe('function');
    });

    it('should subscribe to news updates', () => {
      const callback = vi.fn();
      const subscription = realtimeService.subscribeToNews(callback);
      
      expect(subscription).toHaveProperty('channel');
      expect(subscription).toHaveProperty('unsubscribe');
    });

    it('should subscribe to events updates', () => {
      const callback = vi.fn();
      const subscription = realtimeService.subscribeToEvents(callback);
      
      expect(subscription).toHaveProperty('channel');
      expect(subscription).toHaveProperty('unsubscribe');
    });

    it('should subscribe to student exam results', () => {
      const callback = vi.fn();
      const subscription = realtimeService.subscribeToStudentExamResults('1', callback);
      
      expect(subscription).toHaveProperty('channel');
      expect(subscription).toHaveProperty('unsubscribe');
    });

    it('should subscribe to teacher exam results', () => {
      const callback = vi.fn();
      const subscription = realtimeService.subscribeToTeacherExamResults('1', callback);
      
      expect(subscription).toHaveProperty('channel');
      expect(subscription).toHaveProperty('unsubscribe');
    });

    it('should subscribe to notifications', () => {
      const callback = vi.fn();
      const subscription = realtimeService.subscribeToNotifications('1', callback);
      
      expect(subscription).toHaveProperty('channel');
      expect(subscription).toHaveProperty('unsubscribe');
    });

    it('should subscribe to content updates', () => {
      const callback = vi.fn();
      const subscription = realtimeService.subscribeToContentUpdates(callback);
      
      expect(subscription).toHaveProperty('channel');
      expect(subscription).toHaveProperty('unsubscribe');
    });

    it('should subscribe to profile updates', () => {
      const callback = vi.fn();
      const subscription = realtimeService.subscribeToProfileUpdates('1', callback);
      
      expect(subscription).toHaveProperty('channel');
      expect(subscription).toHaveProperty('unsubscribe');
    });

    it('should subscribe to admin updates', () => {
      const callback = vi.fn();
      const subscription = realtimeService.subscribeToAdminUpdates(callback);
      
      expect(subscription).toHaveProperty('channel');
      expect(subscription).toHaveProperty('unsubscribe');
    });
  });

  describe('Channel Management', () => {
    it('should unsubscribe from specific channel', () => {
      const callback = vi.fn();
      realtimeService.subscribeToAnnouncements(callback);
      
      expect(realtimeService.isChannelActive('announcements')).toBe(true);
      
      realtimeService.unsubscribe('announcements');
      expect(realtimeService.isChannelActive('announcements')).toBe(false);
    });

    it('should unsubscribe from all channels', () => {
      const callback = vi.fn();
      realtimeService.subscribeToAnnouncements(callback);
      realtimeService.subscribeToNews(callback);
      
      expect(realtimeService.getActiveChannelsCount()).toBe(2);
      
      realtimeService.unsubscribeAll();
      expect(realtimeService.getActiveChannelsCount()).toBe(0);
    });

    it('should track active channels count', () => {
      const callback = vi.fn();
      
      expect(realtimeService.getActiveChannelsCount()).toBe(0);
      
      realtimeService.subscribeToAnnouncements(callback);
      expect(realtimeService.getActiveChannelsCount()).toBe(1);
      
      realtimeService.subscribeToNews(callback);
      expect(realtimeService.getActiveChannelsCount()).toBe(2);
    });
  });
});

describe('Integration Tests', () => {
  it('should handle complete notification flow', async () => {
    // Mock successful responses
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ sid: 'test-sid' })
    });

    // Create announcement
    const announcement = await contentService.createAnnouncement({
      title: 'Test Announcement',
      content: 'Test content',
      type: 'general',
      priority: 0,
      published: true
    });

    expect(announcement).toBeDefined();

    // Send notification
    const notification = await notificationService.sendAnnouncementNotification(
      ['1', '2'],
      'Test Announcement',
      'Test content'
    );

    expect(notification.success).toBeGreaterThanOrEqual(0);
    expect(notification.failed).toBeGreaterThanOrEqual(0);
    expect(notification.total).toBe(2);
  });

  it('should handle complete exam result flow', async () => {
    // Create exam result
    const examResult = await contentService.createExamResult({
      student_id: '1',
      exam_name: 'Math Test',
      subject: 'Mathematics',
      exam_date: '2024-01-01',
      marks_obtained: 85,
      total_marks: 100,
      grade: 'A'
    });

    expect(examResult).toBeDefined();

    // Publish exam result (this should trigger notification)
    const published = await contentService.publishExamResult(examResult.id);
    expect(published).toBe(true);
  });
});
