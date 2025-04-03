import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Button } from 'primereact/button';

const ThemeSwitcher = () => {
    const { theme, setTheme } = useContext(ThemeContext);

    const toggleTheme = () => {
        setTheme(theme === 'lara-light-blue' ? 'lara-dark-blue' : 'lara-light-blue');
    };

    return (
        <Button
            icon={theme === 'lara-light-blue' ? 'pi pi-moon' : 'pi pi-sun'}
            className="p-button-rounded p-button-text"
            onClick={toggleTheme}
            tooltip="Cambiar tema"
        />
    );
};

export default ThemeSwitcher;
