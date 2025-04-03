import { jwtVerify, SignJWT } from 'jose';

const SECRET_KEY = new TextEncoder().encode('tu_clave_secreta'); // Clave secreta en formato para jose

const login = async (username, password) => {
  // Simula la validación (reemplaza con tu lógica o llamada al backend real)
  if (username === 'JMP' && password === '123') {
    // Genera el JWT con jose (simulación local)
    const token = await new SignJWT({ username })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(SECRET_KEY);
    return token;
  } else {
    throw new Error('Credenciales inválidas');
  }
};

const isAuthenticated = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }
  try {
    // Verifica la firma del token
    const { payload } = await jwtVerify(token, SECRET_KEY);
    // Verifica la expiración (si la hay)
    // ...
    return true;
  } catch (error) {
    console.error("Error al verificar el token:", error);
    return false;
  }
};

// ... otras funciones (logout, etc.)
const logout = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
}

export default { login, isAuthenticated, logout };