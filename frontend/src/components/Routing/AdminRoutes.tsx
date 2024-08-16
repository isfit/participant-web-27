import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthenticationContext';
import { ROLES } from '../../config/roles';

interface Props {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<Props> = ({ children }) => {
  const { user } = useAuth();

  // check admin role and redirect if not admin
  console.log(user);
  if (!user || user.role !== ROLES.ADMIN) {
    console.log('Missing admin role');
    console.log(user?.role);
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedAdminRoute;