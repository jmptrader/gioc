import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authService from '../services/authService';

const PrivateRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await authService.isAuthenticated();
      setIsAuthenticated(auth);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Cargando...</div>; // Puedes mostrar un componente de carga
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;