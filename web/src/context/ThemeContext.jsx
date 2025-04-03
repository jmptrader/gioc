import React, { createContext, useState, useEffect } from 'react';

// Crear el contexto del tema
export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  // Estado para almacenar el tema actual
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'lara-dark-blue');

  // Efecto para aplicar el tema en el `head`
  useEffect(() => {
    const themeLink = document.getElementById('theme-link');
    if (themeLink) {
      //themeLink.href = `https://unpkg.com/primereact/resources/themes/${theme}/theme.css`;
      themeLink.href  = `/themes/${theme}/theme.css`;
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <link id="theme-link" rel="stylesheet" href={`/themes/${theme}/theme.css`} />
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
