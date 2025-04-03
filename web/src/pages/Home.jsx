import React, { useContext, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext'; // Importa el contexto

import authService from '../services/authService';

const Home = () => {
  const { theme } = useContext(ThemeContext); // Obtiene el tema desde el contexto
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/login' && authService.isAuthenticated()) {
      navigate('/home');
    }
  }, [navigate, location]);

  return (
      <div className="flex flex-column h-screen">
        <div className="flex-grow-1">
        
        </div>
      </div>
  );
};

export default Home;
