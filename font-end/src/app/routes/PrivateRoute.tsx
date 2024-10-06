import React, { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useStore';
import { selectIsAuthenticated } from '@/features/auth/authSlice';

export const PrivateRoute = ({ children }: PropsWithChildren) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to={'/admin/login'} />;
  }
  return <>{children}</>;
};
