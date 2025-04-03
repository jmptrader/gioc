import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';

import ThemeProvider from './context/ThemeContext'; // Importar el proveedor de tema
import routesConfig from './routes';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

const App = () => {
  return (
    <PrimeReactProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {routesConfig.map(({ path, element, isPrivate }, index) =>
              isPrivate ? (
                <Route key={index} element={<PrivateRoute />}>
                  <Route path={path} element={<Layout>{element}</Layout>} />
                </Route>
              ) : (
                <Route key={index} path={path} element={element} />
              )
            )}
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </PrimeReactProvider>
  );
};

export default App;
