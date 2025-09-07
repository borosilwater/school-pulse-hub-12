import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw,
  Database,
  Smartphone,
  Bell,
  Activity,
  Wifi,
  WifiOff
} from 'lucide-react';
import { validateBackend, getBackendStatus, type BackendStatus } from '@/lib/backend-validation';

const BackendHealthCheck = () => {
  const [status, setStatus] = useState<BackendStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkBackendHealth = async () => {
    setLoading(true);
    try {
      const backendStatus = await validateBackend();
      setStatus(backendStatus);
      setLastChecked(new Date());
    } catch (error) {
      console.error('Backend health check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const getStatusIcon = (isHealthy: boolean) => {
    return isHealthy ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getStatusBadge = (isHealthy: boolean) => {
    return (
      <Badge variant={isHealthy ? 'default' : 'destructive'}>
        {isHealthy ? 'Healthy' : 'Issues'}
      </Badge>
    );
  };

  if (!status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Backend Health Check
          </CardTitle>
          <CardDescription>Checking backend services...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Backend Health Status
              </CardTitle>
              <CardDescription>
                Real-time status of all backend services
                {lastChecked && (
                  <span className="block text-xs text-muted-foreground mt-1">
                    Last checked: {lastChecked.toLocaleTimeString()}
                  </span>
                )}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(status.overall)}
              <Button
                variant="outline"
                size="sm"
                onClick={checkBackendHealth}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Supabase Status */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Supabase
                  {getStatusIcon(status.supabase.connected && status.supabase.database)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Connection</span>
                  {getStatusIcon(status.supabase.connected)}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Database</span>
                  {getStatusIcon(status.supabase.database)}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Authentication</span>
                  {getStatusIcon(status.supabase.auth)}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Realtime</span>
                  {getStatusIcon(status.supabase.realtime)}
                </div>
                {status.supabase.error && (
                  <div className="text-xs text-red-600 mt-2">
                    Error: {status.supabase.error}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Twilio Status */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Twilio SMS
                  {getStatusIcon(status.twilio.configured && status.twilio.credentials)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Configured</span>
                  {getStatusIcon(status.twilio.configured)}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Credentials</span>
                  {getStatusIcon(status.twilio.credentials)}
                </div>
                {status.twilio.error && (
                  <div className="text-xs text-red-600 mt-2">
                    Error: {status.twilio.error}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Services Status */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Services
                  {getStatusIcon(status.services.content && status.services.notifications)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Content Service</span>
                  {getStatusIcon(status.services.content)}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Notifications</span>
                  {getStatusIcon(status.services.notifications)}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Realtime</span>
                  {getStatusIcon(status.services.realtime)}
                </div>
                {status.services.error && (
                  <div className="text-xs text-red-600 mt-2">
                    Error: {status.services.error}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Overall Status */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  {status.overall ? (
                    <Wifi className="h-4 w-4 text-green-600" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-red-600" />
                  )}
                  Overall Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">
                    {status.overall ? 'All Systems Operational' : 'Issues Detected'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {status.overall 
                      ? 'All backend services are working correctly'
                      : 'Some backend services may have issues'
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
            >
              <Database className="h-4 w-4 mr-2" />
              Supabase Dashboard
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://console.twilio.com', '_blank')}
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Twilio Console
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={checkBackendHealth}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Recheck All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackendHealthCheck;
