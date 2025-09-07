// Application Configuration
// Centralized configuration for all backend services

export interface AppConfig {
  supabase: {
    url: string;
    anonKey: string;
    serviceRoleKey?: string;
  };
  twilio: {
    accountSid: string;
    authToken: string;
    phoneNumber: string;
  };
  app: {
    name: string;
    version: string;
    environment: 'development' | 'production' | 'test';
  };
  features: {
    smsNotifications: boolean;
    emailNotifications: boolean;
    realtimeUpdates: boolean;
    fileUploads: boolean;
  };
}

class ConfigManager {
  private config: AppConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): AppConfig {
    return {
      supabase: {
        url: import.meta.env.VITE_SUPABASE_URL || 'https://xydedbcwggivzamgywos.supabase.co',
        anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5ZGVkYmN3Z2dpdnphbWd5d29zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjQyMTQsImV4cCI6MjA3Mjc0MDIxNH0.pNUO6ajYZsgnwjbcbBkqC01zNtdPqXI_yQc2BVBgmAg',
        serviceRoleKey: import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
      },
      twilio: {
        accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || 'your_twilio_account_sid',
        authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN || 'your_twilio_auth_token',
        phoneNumber: import.meta.env.VITE_TWILIO_PHONE_NUMBER || '+1234567890',
      },
      app: {
        name: 'EduPortal',
        version: '1.0.0',
        environment: (import.meta.env.MODE as 'development' | 'production' | 'test') || 'development',
      },
      features: {
        smsNotifications: true,
        emailNotifications: false, // Not implemented yet
        realtimeUpdates: true,
        fileUploads: true,
      },
    };
  }

  getConfig(): AppConfig {
    return this.config;
  }

  getSupabaseConfig() {
    return this.config.supabase;
  }

  getTwilioConfig() {
    return this.config.twilio;
  }

  getAppConfig() {
    return this.config.app;
  }

  getFeatureConfig() {
    return this.config.features;
  }

  isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
    return this.config.features[feature];
  }

  isDevelopment(): boolean {
    return this.config.app.environment === 'development';
  }

  isProduction(): boolean {
    return this.config.app.environment === 'production';
  }

  isTest(): boolean {
    return this.config.app.environment === 'test';
  }

  validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate Supabase configuration
    if (!this.config.supabase.url) {
      errors.push('Supabase URL is not configured');
    }
    if (!this.config.supabase.anonKey) {
      errors.push('Supabase anonymous key is not configured');
    }

    // Validate Twilio configuration
    if (!this.config.twilio.accountSid) {
      errors.push('Twilio Account SID is not configured');
    }
    if (!this.config.twilio.authToken) {
      errors.push('Twilio Auth Token is not configured');
    }
    if (!this.config.twilio.phoneNumber) {
      errors.push('Twilio Phone Number is not configured');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  printConfig(): void {
    console.log('🔧 Application Configuration:');
    console.log('============================');
    console.log(`App Name: ${this.config.app.name}`);
    console.log(`Version: ${this.config.app.version}`);
    console.log(`Environment: ${this.config.app.environment}`);
    console.log(`Supabase URL: ${this.config.supabase.url}`);
    console.log(`Twilio Account SID: ${this.config.twilio.accountSid}`);
    console.log(`Features:`);
    console.log(`  - SMS Notifications: ${this.config.features.smsNotifications ? '✅' : '❌'}`);
    console.log(`  - Email Notifications: ${this.config.features.emailNotifications ? '✅' : '❌'}`);
    console.log(`  - Realtime Updates: ${this.config.features.realtimeUpdates ? '✅' : '❌'}`);
    console.log(`  - File Uploads: ${this.config.features.fileUploads ? '✅' : '❌'}`);
  }
}

// Create singleton instance
export const config = new ConfigManager();

// Export individual configs for convenience
export const supabaseConfig = config.getSupabaseConfig();
export const twilioConfig = config.getTwilioConfig();
export const appConfig = config.getAppConfig();
export const featureConfig = config.getFeatureConfig();

// Export validation function
export const validateConfig = () => config.validateConfig();

// Export feature check functions
export const isFeatureEnabled = (feature: keyof AppConfig['features']) => 
  config.isFeatureEnabled(feature);

// Export environment check functions
export const isDevelopment = () => config.isDevelopment();
export const isProduction = () => config.isProduction();
export const isTest = () => config.isTest();

export default config;
