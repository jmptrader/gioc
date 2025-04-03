import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext'; // Importa el contexto
import { SplitButton } from 'primereact/splitbutton';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from 'primereact/badge';
import ThemeSwitcher from '../components/ThemeSwitcher';
import authService from '../services/authService';
import { NodeService } from '../services/nodeService';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import '../App.css';
import Navbar from './Navbar';
import { BreadCrumb } from 'primereact/breadcrumb';
import Slim from './Slim';

const Layout = ({ children }) => {
    const { theme } = useContext(ThemeContext); // Obtiene el tema desde el contexto
    const navigate = useNavigate();
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const currentDate = new Date().toLocaleDateString();
    const [logo, setLogo] = useState("svg");
    const [nodes, setNodes] = useState([]);
    const [css, setCss] = useState("dark");
    const [breadcrumb, setBreadcrumb] = useState([]);
    const home = { icon: 'pi pi-home', url: '/home' };

    useEffect(() => {
        setLogo("svg")
        setCss("dark")
        if (theme == "lara-light-blue") {
            setLogo("png")
            setCss("light")
        }
        NodeService.getTreeNodes(navigate).then(data => setNodes(data));
    }, [theme, navigate, css]);

    // Manejar la selección sin que el menú colapse
    const handleItemClick = (key, path) => {
        setExpandedKeys((prev) => ({
            ...prev,
            [key]: true, // Mantener abierto el menú padre
        }));
        navigate(path);
    };

    // Items del SplitButton
    const items = [
        {
            label: 'Salir',
            icon: 'pi pi-sign-out',
            command: () => {
                authService.logout(); // Asegúrate de que esta función borre los datos de autenticación
                localStorage.removeItem('token'); // Si usas localStorage para guardar el token
                sessionStorage.removeItem('token'); // O sessionStorage si es necesario
                navigate('/login');
            }
        }
    ];

    const onNodeSelect = (event) => {
        const node = event.node; // Acceder al nodo seleccionado
        console.log("Nodo seleccionado:", node);

        if (node?.command) {
            node.command(); // Ejecuta la navegación si existe
        } else {
            console.warn("El nodo no tiene un comando asociado.");
        }
    };



    return (
        <div className="layout-wrapper">
            {/* Cabecera */}
            <header className={`flex navbar-border-bottom-${css}`}>
                <div className="flex-none flex align-items-center justify-content-center gap-2">
                    <Button
                        icon="pi pi-bars"
                        className="p-button-text"
                        onClick={() => setSidebarVisible(!sidebarVisible)}
                    />
                    <img src={`https://test.aditiva.com/assets/logo.${logo}`} alt="logo" height="30" />
                </div>
                <div className="flex-grow-1 flex align-items-center justify-content-center">
                    {/* Espacio vacío para centrar otros elementos */}
                </div>
                <div className="flex-none flex align-items-center justify-content-center gap-2">
                    <ThemeSwitcher />
                    <Button icon="pi pi-bell" rounded text severity="info" aria-label="Bell" />
                    <Button icon="pi pi-cog" rounded text severity="info" aria-label="Cog" />
                    <SplitButton label="Jorge Martinez" text icon="pi pi-user" model={items} />
                </div>
            </header>

            {/* Sidebar */}
            <div className={`sidebar sidebar-border-right-${css} ${sidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'}`}>
                <h2>Menú</h2>
                {
                    <Navbar theme={css} setBreadcrumb={setBreadcrumb} />
                }
                {/*<Tree value={nodes} selectionMode="single" onNodeClick={onNodeSelect} />*/}

            </div>

            {/* Contenido principal */}
            <main className="main-content">
                <div className="content">
                    {/* Renderizar el breadcrumb */}
                    <BreadCrumb model={breadcrumb} home={home} />
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className={`footer footer-border-top-${css} p-p-3`}>
                <div className="flex justify-content-between flex-wrap">
                    {/* Sección izquierda: Información de la aplicación */}
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-copyright" style={{ fontSize: '1rem' }}></i>
                        <span>2025 Aditiva S.A. Todos los derechos reservados</span>
                    </div>

                    {/* Sección derecha: Ambiente, fecha y otros datos */}
                    <div className="flex align-items-center gap-5">
                        {/* Ambiente */}
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-desktop" style={{ fontSize: '1.2rem' }}></i>
                            <span>Ambiente: <strong>Producción</strong></span>
                        </div>

                        {/* Fecha actual */}
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-calendar" style={{ fontSize: '1.2rem' }}></i>
                            <span>Fecha: <strong>{currentDate}</strong></span>
                        </div>

                        {/* Otro dato (ejemplo: estado del servidor) */}
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-server" style={{ fontSize: '1.2rem' }}></i>
                            <span>Estado: <Badge value="En línea" severity="success"></Badge></span>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default Layout;