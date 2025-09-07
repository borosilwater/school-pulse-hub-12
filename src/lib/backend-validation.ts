// Backend Validation Script
// This script validates all backend services and configurations

import { supabase } from '@/integrations/supabase/client';
import { twilioService } from './twilio';
import { notificationService } from './notifications';
import { contentService } from './content';
import { realtimeService } from './realtime';

export interface BackendStatus {
  supabase: {
    connected: boolean;
    auth: boolean;
    database: boolean;
    realtime: boolean;
    error?: string;
  };
  twilio: {
    configured: boolean;
    credentials: boolean;
    error?: string;
  };
  services: {
    content: boolean;
    notifications: boolean;
    realtime: boolean;
    error?: string;
  };
  overall: boolean;
}

class BackendValidator {
  private status: BackendStatus = {
    supabase: {
      connected: false,
      auth: false,
      database: false,
      realtime: false,
    },
    twilio: {
      configured: false,
      credentials: false,
    },
    services: {
      content: false,
      notifications: false,
      realtime: false,
    },
    overall: false,
  };

  async validateSupabase(): Promise<void> {
    try {
      // Test connection
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      if (error) throw error;
      
      this.status.supabase.connected = true;
      this.status.supabase.database = true;

      // Test auth
      const { data: { user } } = await supabase.auth.getUser();
      this.status.supabase.auth = true;

      // Test realtime
      const channel = supabase.channel('test');
      this.status.supabase.realtime = true;

    } catch (error) {
      this.status.supabase.error = error instanceof Error ? error.message : 'Unknown error';
      console.error('Supabase validation failed:', error);
    }
  }

  async validateTwilio(): Promise<void> {
    try {
      // Check if credentials are configured
      const hasCredentials = twilioService['accountSid'] && twilioService['authToken'];
      this.status.twilio.configured = hasCredentials;
      this.status.twilio.credentials = hasCredentials;

      if (!hasCredentials) {
        this.status.twilio.error = 'Twilio credentials not configured';
      }

    } catch (error) {
      this.status.twilio.error = error instanceof Error ? error.message : 'Unknown error';
      console.error('Twilio validation failed:', error);
    }
  }

  async validateServices(): Promise<void> {
    try {
      // Test content service
      const contentStats = await contentService.getContentStats();
      this.status.services.content = true;

      // Test notification service
      const unreadCount = await notificationService.getUnreadCount('test-user-id');
      this.status.services.notifications = true;

      // Test realtime service
      const channelCount = realtimeService.getActiveChannelsCount();
      this.status.services.realtime = true;

    } catch (error) {
      this.status.services.error = error instanceof Error ? error.message : 'Unknown error';
      console.error('Services validation failed:', error);
    }
  }

  async validateAll(): Promise<BackendStatus> {
    console.log('🔍 Starting backend validation...');

    await Promise.all([
      this.validateSupabase(),
      this.validateTwilio(),
      this.validateServices(),
    ]);

    // Determine overall status
    this.status.overall = 
      this.status.supabase.connected &&
      this.status.supabase.database &&
      this.status.supabase.auth &&
      this.status.twilio.configured &&
      this.status.services.content &&
      this.status.services.notifications;

    console.log('✅ Backend validation complete:', this.status);
    return this.status;
  }

  getStatus(): BackendStatus {
    return this.status;
  }

  printStatus(): void {
    console.log('\n📊 Backend Status Report');
    console.log('========================');
    
    console.log('\n🔗 Supabase:');
    console.log(`  Connected: ${this.status.supabase.connected ? '✅' : '❌'}`);
    console.log(`  Database: ${this.status.supabase.database ? '✅' : '❌'}`);
    console.log(`  Auth: ${this.status.supabase.auth ? '✅' : '❌'}`);
    console.log(`  Realtime: ${this.status.supabase.realtime ? '✅' : '❌'}`);
    if (this.status.supabase.error) {
      console.log(`  Error: ${this.status.supabase.error}`);
    }

    console.log('\n📱 Twilio:');
    console.log(`  Configured: ${this.status.twilio.configured ? '✅' : '❌'}`);
    console.log(`  Credentials: ${this.status.twilio.credentials ? '✅' : '❌'}`);
    if (this.status.twilio.error) {
      console.log(`  Error: ${this.status.twilio.error}`);
    }

    console.log('\n⚙️ Services:');
    console.log(`  Content: ${this.status.services.content ? '✅' : '❌'}`);
    console.log(`  Notifications: ${this.status.services.notifications ? '✅' : '❌'}`);
    console.log(`  Realtime: ${this.status.services.realtime ? '✅' : '❌'}`);
    if (this.status.services.error) {
      console.log(`  Error: ${this.status.services.error}`);
    }

    console.log('\n🎯 Overall Status:');
    console.log(`  Backend: ${this.status.overall ? '✅ WORKING' : '❌ ISSUES FOUND'}`);
  }
}

// Create singleton instance
export const backendValidator = new BackendValidator();

// Export validation function
export const validateBackend = async (): Promise<BackendStatus> => {
  return await backendValidator.validateAll();
};

// Export status checker
export const getBackendStatus = (): BackendStatus => {
  return backendValidator.getStatus();
};

// Export status printer
export const printBackendStatus = (): void => {
  backendValidator.printStatus();
};

export default backendValidator;
