// src/routes.js
import Home from './pages/Home';
import Monitorear from './pages/Monitorear';
import Administrar from './pages/Administrar';
import Calculadora from './pages/Calculadora';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import Interface from './pages/Interface';

const routesConfig = [
  { path: "/login", element: <Login />, isPrivate: false },
  { path: "/", element: <Home />, isPrivate: true },
  { path: "/home", element: <Home />, isPrivate: true },
  { path: "/home/monitorear", element: <Monitorear />, isPrivate: true },
  { path: "/home/interface", element: <Interface />, isPrivate: true },
  { path: "/home/calcular", element: <Calculadora />, isPrivate: true },
  { path: "/home/administrar", element: <Administrar />, isPrivate: true },
  { path: "*", element: <PageNotFound />, isPrivate: false },
];

export default routesConfig;
