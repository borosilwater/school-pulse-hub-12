import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AnnouncementBar from '@/components/ui/announcement-bar';
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
    <div className="min-h-screen">
      {/* Announcement Bar */}
      <AnnouncementBar />
      
      <div 
        className="min-h-screen flex items-center justify-center p-4 relative pt-16"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/building.jpg')`,
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
                src="/images/dept_logo.jpg" 
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
                  className="w-full border-white/30 text-white hover:bg-white/20 hover:text-white transition-all duration-300 bg-white/5"
                  onClick={() => setIsRegistering(true)}
                >
                  Register as {userType.charAt(0).toUpperCase() + userType.slice(1)}
                </Button>
              )}

              {isRegistering && (
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white/20 hover:text-white transition-all duration-300 bg-white/5"
                  onClick={() => setIsRegistering(false)}
                >
                  Back to Login
                </Button>
              )}
            </form>


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
    </div>
  );
};

export default Auth;