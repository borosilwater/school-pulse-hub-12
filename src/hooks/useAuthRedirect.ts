import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  const redirectToDashboard = () => {
    if (!loading && user && profile) {
      // Redirect based on user role
      switch (profile.role) {
        case 'admin':
          navigate('/dashboard/admin');
          break;
        case 'teacher':
          navigate('/dashboard/teacher');
          break;
        case 'student':
          navigate('/dashboard/student');
          break;
        default:
          navigate('/dashboard');
      }
    }
  };

  const redirectToAuth = () => {
    if (!loading && !user) {
      navigate('/auth');
    }
  };

  return {
    user,
    profile,
    loading,
    redirectToDashboard,
    redirectToAuth,
    isAuthenticated: !!user && !!profile
  };
};