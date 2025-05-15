'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const RequireAuth = ({ children, role }) => {
  const { user, loading, isAuthenticated, verificationInProgress } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || verificationInProgress) return;

    if (!isAuthenticated || !user) {
      router.replace('/login');
      return;
    }

    if (role && user.role !== role) {
      const path = user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
      router.replace(path);
      return;
    }
  }, [loading, isAuthenticated, user, router, role, verificationInProgress]);

  if (loading || verificationInProgress) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Only render children if authenticated and role matches (if role is specified)
  if (isAuthenticated && (!role || user.role === role)) {
    return children;
  }

  return null;
}

export default RequireAuth;