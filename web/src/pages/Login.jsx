import React, { useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext'; // Importa el contexto
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import authService from '../services/authService';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await authService.login(username, password);
      localStorage.setItem('token', token);
      navigate('/home', { replace: true });
    } catch (error) {
      setError(true);
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (

    <div className="flex flex-column align-content-center align-items-center justify-content-center" style={{ height: '90vh' }}>
      <div className="surface-card p-4 shadow-8 border-round w-full lg:w-6" style={{ maxWidth: '400px' }}>
        <form onSubmit={handleSubmit}>
          <h2 className="p-text-center">Iniciar Sesión</h2>
          <div className="p-field">
            <label htmlFor="username">Usuario</label>
            <InputText
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mb-3"
            />
          </div>
          <div className="p-field">
            <label htmlFor="password">Contraseña</label>
            <InputText
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-3"
            />
          </div>
          <div className="p-field p-text-center pt-6">
            <Button label="Ingresar" type="submit" icon="pi pi-user" className="w-full" />
            {error && <p style={{ color: 'red' }}>Credenciales incorrectas</p>}
          </div>
        </form>
      </div>
    </div>

  );
};

export default Login;