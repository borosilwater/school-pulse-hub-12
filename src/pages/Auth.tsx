import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, UserRole } from '@/hooks/useAuth';
import { Home, Eye, EyeOff, User as UserTie, GraduationCap, Shield, Lock, IdCard, UserCog } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState<UserRole>('teacher');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  const { user, signIn, signUp } = useAuth();

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn(email, password);
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signUp(email, password, fullName, userType);
    setLoading(false);
  };

  const getUserTypeIcon = (type: UserRole) => {
    switch (type) {
      case 'teacher':
        return <UserTie className="h-4 w-4" />;
      case 'student':
        return <GraduationCap className="h-4 w-4" />;
      case 'admin':
        return <Shield className="h-4 w-4" />;
      default:
        return <UserTie className="h-4 w-4" />;
    }
  };

  const getUserTypeColor = (type: UserRole) => {
    switch (type) {
      case 'teacher':
        return 'from-purple-600 to-purple-700';
      case 'student':
        return 'from-green-600 to-green-700';
      case 'admin':
        return 'from-red-600 to-red-700';
      default:
        return 'from-purple-600 to-purple-700';
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Home Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-5 left-5 bg-white/15 backdrop-blur-md border border-white/20 text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 rounded-full w-12 h-12"
        onClick={() => window.location.href = '/'}
      >
        <Home className="h-5 w-5" />
      </Button>

      <div className="w-full max-w-md">
        <Card className="bg-white/15 backdrop-blur-lg border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4">
              <img 
                src="https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=70&h=70&fit=crop" 
                alt="School Logo" 
                className="h-16 w-16 rounded-full object-cover shadow-lg animate-float"
              />
            </div>
            <CardTitle className="text-2xl text-white font-bold mb-2 text-shadow">
              School Portal
            </CardTitle>
            <CardDescription className="text-white/90 text-shadow">
              Select your login type to continue
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* User Type Selector */}
            <div className="flex rounded-lg overflow-hidden bg-white/10 border border-white/20">
              {(['teacher', 'student', 'admin'] as UserRole[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`flex-1 py-3 px-2 text-center font-medium transition-all duration-300 ${
                    userType === type 
                      ? `bg-gradient-to-r ${getUserTypeColor(type)} text-white shadow-lg` 
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                  onClick={() => setUserType(type)}
                >
                  <div className="flex items-center justify-center gap-1 text-sm">
                    {getUserTypeIcon(type)}
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </div>
                </button>
              ))}
            </div>

            {/* Login/Register Form */}
            <form onSubmit={isRegistering ? handleSignUp : handleSignIn} className="space-y-4">
              {isRegistering && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white font-medium text-shadow">
                    Full Name
                  </Label>
                  <div className="relative">
                    <UserTie className="absolute left-3 top-3 h-4 w-4 text-white/70" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={isRegistering}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-blue-400 transition-all duration-300"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium text-shadow">
                  {userType === 'student' ? 'Student ID' : userType === 'admin' ? 'Admin Username' : 'Email or Employee ID'}
                </Label>
                <div className="relative">
                  {userType === 'student' ? (
                    <IdCard className="absolute left-3 top-3 h-4 w-4 text-white/70" />
                  ) : userType === 'admin' ? (
                    <UserCog className="absolute left-3 top-3 h-4 w-4 text-white/70" />
                  ) : (
                    <UserTie className="absolute left-3 top-3 h-4 w-4 text-white/70" />
                  )}
                  <Input
                    id="email"
                    type={userType === 'student' || userType === 'admin' ? 'text' : 'email'}
                    placeholder={
                      userType === 'student' 
                        ? 'Enter your student ID' 
                        : userType === 'admin' 
                        ? 'Enter your admin username'
                        : 'Enter your email or employee ID'
                    }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-blue-400 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium text-shadow">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-white/70" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-blue-400 transition-all duration-300"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-white/70 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {!isRegistering && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-white/20 bg-white/10 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                    />
                    <Label htmlFor="remember" className="text-white/90 text-shadow">
                      Remember me
                    </Label>
                  </div>
                  <a href="#" className="text-blue-300 hover:text-white transition-colors text-shadow">
                    Forgot password?
                  </a>
                </div>
              )}

              <Button 
                type="submit" 
                className={`w-full bg-gradient-to-r ${getUserTypeColor(userType)} hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold py-3`}
                disabled={loading}
              >
                {loading 
                  ? (isRegistering ? 'Creating Account...' : 'Signing In...') 
                  : (isRegistering ? `Register as ${userType.charAt(0).toUpperCase() + userType.slice(1)}` : `${userType.charAt(0).toUpperCase() + userType.slice(1)} Login`)
                }
              </Button>

              {!isRegistering && userType !== 'admin' && (
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white/10 transition-all duration-300"
                  onClick={() => setIsRegistering(true)}
                >
                  Register as {userType.charAt(0).toUpperCase() + userType.slice(1)}
                </Button>
              )}

              {isRegistering && (
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white/10 transition-all duration-300"
                  onClick={() => setIsRegistering(false)}
                >
                  Back to Login
                </Button>
              )}
            </form>

            {/* Social Login */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-white/70 text-shadow">or continue with</span>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
              <button className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.5 12.5c0-1.2-.1-2.4-.3-3.6H12v6.8h6.4c-.3 1.5-1.1 2.8-2.4 3.7v3.1h3.9c2.3-2.1 3.6-5.2 3.6-8.9z"/>
                  <path d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3.1c-1.1.7-2.5 1.1-4 1.1-3.1 0-5.7-2.1-6.6-4.9H1.5v3.1C3.6 21.4 7.5 24 12 24z"/>
                  <path d="M5.4 14.2c-.2-.7-.4-1.4-.4-2.2s.1-1.5.4-2.2V6.7H1.5C.5 8.6 0 10.2 0 12s.5 3.4 1.5 5.3l3.9-3.1z"/>
                  <path d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.2 15.1 0 12 0 7.5 0 3.6 2.6 1.5 6.7l3.9 3.1C6.3 6.9 8.9 4.8 12 4.8z"/>
                </svg>
              </button>
              <button className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </button>
            </div>

            <div className="text-center text-sm text-white/80 text-shadow">
              Need help? <a href="#" className="text-blue-300 hover:text-white transition-colors underline">Contact school administration</a>
            </div>
          </CardContent>
        </Card>
      </div>

      <style>{`
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        @keyframes floating {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-float {
          animation: floating 3s ease-in-out infinite;
        }
        
        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Auth;