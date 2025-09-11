import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap,
  Home,
  BookOpen,
  Calendar,
  FileText,
  Users,
  BarChart3,
  Settings,
  Bell,
  ClipboardList,
  Trophy,
  X,
  Image,
  DollarSign,
  Upload,
  UserCheck
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const Sidebar = ({ open, onClose }: SidebarProps) => {
  const location = useLocation();
  const { profile } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['student', 'teacher', 'admin'] },
    { name: 'Applications', href: '/applications', icon: ClipboardList, roles: ['student', 'teacher', 'admin'] },
    { name: 'Fee Management', href: '/fee-management', icon: DollarSign, roles: ['student', 'teacher', 'admin'] },
    { name: 'Documents', href: '/documents', icon: Upload, roles: ['student', 'teacher', 'admin'] },
    { name: 'Faculty', href: '/faculty', icon: UserCheck, roles: ['student', 'teacher', 'admin'] },
    { name: 'News', href: '/news', icon: FileText, roles: ['student', 'teacher', 'admin'] },
    { name: 'Announcements', href: '/announcements', icon: Bell, roles: ['student', 'teacher', 'admin'] },
    { name: 'Events', href: '/events', icon: Calendar, roles: ['student', 'teacher', 'admin'] },
    { name: 'Exam Results', href: '/results', icon: Trophy, roles: ['student', 'teacher', 'admin'] },
    { name: 'Gallery', href: '/gallery', icon: Image, roles: ['student', 'teacher', 'admin'] },
    { name: 'Students', href: '/students', icon: Users, roles: ['teacher', 'admin'] },
    { name: 'Teachers', href: '/teachers', icon: BookOpen, roles: ['admin'] },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['admin'] },
    { name: 'Notifications', href: '/dashboard/notifications', icon: Bell, roles: ['student', 'teacher', 'admin'] },
    { name: 'Settings', href: '/settings', icon: Settings, roles: ['student', 'teacher', 'admin'] },
  ];

  const filteredNavigation = navigation.filter(item => 
    profile?.role && item.roles.includes(profile.role)
  );

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/dashboard/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-card border-r transition-transform duration-300 ease-in-out lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                EduHub
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User info */}
          <div className="p-4 border-b bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="space-y-2">
              <p className="text-sm font-medium truncate">{profile?.full_name}</p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1)}
                </Badge>
                {profile?.class_name && (
                  <Badge variant="outline" className="text-xs">
                    {profile.class_name}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {filteredNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t bg-gradient-to-r from-muted/50 to-accent/10">
            <div className="text-xs text-muted-foreground text-center">
              <p>EduHub v1.0</p>
              <p>Powered by modern technology</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};