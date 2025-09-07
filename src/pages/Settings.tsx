import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Smartphone,
  Save,
  Eye,
  EyeOff,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettings {
  sms_notifications: boolean;
  email_notifications: boolean;
  announcement_notifications: boolean;
  exam_result_notifications: boolean;
  event_notifications: boolean;
}

interface ProfileSettings {
  full_name: string;
  phone: string;
  address: string;
  date_of_birth: string;
  class_name?: string;
  student_id?: string;
}

const Settings = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Profile settings
  const [profileSettings, setProfileSettings] = useState<ProfileSettings>({
    full_name: '',
    phone: '',
    address: '',
    date_of_birth: '',
    class_name: '',
    student_id: ''
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    sms_notifications: true,
    email_notifications: false,
    announcement_notifications: true,
    exam_result_notifications: true,
    event_notifications: true
  });

  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (profile) {
      setProfileSettings({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        date_of_birth: profile.date_of_birth || '',
        class_name: profile.class_name || '',
        student_id: profile.student_id || ''
      });
    }
    loadNotificationSettings();
  }, [profile]);

  const loadNotificationSettings = async () => {
    if (!user) return;

    try {
      // Load notification preferences from database
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        setNotificationSettings({
          sms_notifications: data.sms_notifications ?? true,
          email_notifications: data.email_notifications ?? false,
          announcement_notifications: data.announcement_notifications ?? true,
          exam_result_notifications: data.exam_result_notifications ?? true,
          event_notifications: data.event_notifications ?? true
        });
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const saveProfileSettings = async () => {
    if (!user || !profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileSettings.full_name,
          phone: profileSettings.phone,
          address: profileSettings.address,
          date_of_birth: profileSettings.date_of_birth || null,
          class_name: profileSettings.class_name || null,
          student_id: profileSettings.student_id || null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const saveNotificationSettings = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          sms_notifications: notificationSettings.sms_notifications,
          email_notifications: notificationSettings.email_notifications,
          announcement_notifications: notificationSettings.announcement_notifications,
          exam_result_notifications: notificationSettings.exam_result_notifications,
          event_notifications: notificationSettings.event_notifications,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Notifications Updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error) {
      console.error('Error updating notifications:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update notification settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      toast({
        title: "Password Changed",
        description: "Your password has been successfully updated.",
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: "Password Change Failed",
        description: "Failed to change password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const testSMSNotification = async () => {
    if (!profileSettings.phone) {
      toast({
        title: "Phone Number Required",
        description: "Please add your phone number to test SMS notifications.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { twilioService } = await import('@/lib/twilio');
      
      const result = await twilioService.sendSMS({
        to: profileSettings.phone,
        body: `🎓 Test SMS from EduPortal!\n\nHi ${profileSettings.full_name}! Your SMS notifications are working perfectly. You'll receive important updates about announcements, exam results, and events.\n\nThank you for using EduPortal! 🚀`
      });

      if (result.success) {
        toast({
          title: "Test SMS Sent!",
          description: "Check your phone for the test message.",
        });
      } else {
        toast({
          title: "SMS Test Failed",
          description: result.error || "Failed to send test SMS.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error sending test SMS:', error);
      toast({
        title: "SMS Test Failed",
        description: "Failed to send test SMS. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account and preferences</p>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          {profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1)} Account
        </Badge>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center">
            <SettingsIcon className="mr-2 h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={profileSettings.full_name}
                    onChange={(e) => setProfileSettings({ ...profileSettings, full_name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={profileSettings.phone}
                      onChange={(e) => setProfileSettings({ ...profileSettings, phone: e.target.value })}
                      placeholder="+91 9876543210"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Textarea
                    id="address"
                    value={profileSettings.address}
                    onChange={(e) => setProfileSettings({ ...profileSettings, address: e.target.value })}
                    placeholder="Enter your address"
                    className="pl-10"
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={profileSettings.date_of_birth}
                      onChange={(e) => setProfileSettings({ ...profileSettings, date_of_birth: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
                {profile?.role === 'student' && (
                  <div className="space-y-2">
                    <Label htmlFor="class_name">Class</Label>
                    <Input
                      id="class_name"
                      value={profileSettings.class_name}
                      onChange={(e) => setProfileSettings({ ...profileSettings, class_name: e.target.value })}
                      placeholder="e.g., Class 10-A"
                    />
                  </div>
                )}
              </div>

              {profile?.role === 'student' && (
                <div className="space-y-2">
                  <Label htmlFor="student_id">Student ID</Label>
                  <Input
                    id="student_id"
                    value={profileSettings.student_id}
                    onChange={(e) => setProfileSettings({ ...profileSettings, student_id: e.target.value })}
                    placeholder="Enter your student ID"
                  />
                </div>
              )}

              <Button onClick={saveProfileSettings} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">SMS Notifications</Label>
                    <p className="text-sm text-gray-600">Receive important updates via SMS</p>
                  </div>
                  <Switch
                    checked={notificationSettings.sms_notifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, sms_notifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive updates via email (coming soon)</p>
                  </div>
                  <Switch
                    checked={notificationSettings.email_notifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, email_notifications: checked })
                    }
                    disabled
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Announcement Notifications</Label>
                    <p className="text-sm text-gray-600">Get notified about new announcements</p>
                  </div>
                  <Switch
                    checked={notificationSettings.announcement_notifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, announcement_notifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Exam Result Notifications</Label>
                    <p className="text-sm text-gray-600">Get notified when exam results are published</p>
                  </div>
                  <Switch
                    checked={notificationSettings.exam_result_notifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, exam_result_notifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Event Notifications</Label>
                    <p className="text-sm text-gray-600">Get notified about upcoming events</p>
                  </div>
                  <Switch
                    checked={notificationSettings.event_notifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, event_notifications: checked })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={saveNotificationSettings} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Preferences'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={testSMSNotification} 
                  disabled={loading || !notificationSettings.sms_notifications}
                >
                  <Smartphone className="mr-2 h-4 w-4" />
                  {loading ? 'Sending...' : 'Test SMS'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current_password">Current Password</Label>
                  <Input
                    id="current_password"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new_password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new_password"
                      type={showPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="Enter new password"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirm New Password</Label>
                  <Input
                    id="confirm_password"
                    type={showPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <Button onClick={changePassword} disabled={saving}>
                <Shield className="mr-2 h-4 w-4" />
                {saving ? 'Changing...' : 'Change Password'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="mr-2 h-5 w-5" />
                App Preferences
              </CardTitle>
              <CardDescription>
                Customize your app experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Language</Label>
                    <p className="text-sm text-gray-600">Choose your preferred language</p>
                  </div>
                  <Select defaultValue="en">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिंदी</SelectItem>
                      <SelectItem value="mr">मराठी</SelectItem>
                      <SelectItem value="gu">ગુજરાતી</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Theme</Label>
                    <p className="text-sm text-gray-600">Choose your preferred theme</p>
                  </div>
                  <Select defaultValue="light">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  All settings are automatically saved
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;