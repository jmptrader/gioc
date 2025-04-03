import React, { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom'; // 🚀 Importamos useNavigate
import './Navbar.css';

const Navbar = ({ theme, setBreadcrumb }) => {

    const toast = useRef(null);
    const navigate = useNavigate(); // 🚀 Hook para navegar
    const [selectedItem, setSelectedItem] = useState(null); // Estado para el ítem seleccionado

    // Función para inicializar el estado con los valores por defecto del JSON
    const initializeExpandedGroups = (groups) => {
        const expandedState = {};
        groups.forEach((group) => {
            if (group.expanded) {
                expandedState[group.label] = true; // Abrir el grupo si expanded es true
            }
            if (group.items) {
                group.items.forEach((item) => {
                    if (item.expanded) {
                        expandedState[item.label] = true; // Abrir el ítem si expanded es true
                    }
                });
            }
        });
        return expandedState;
    };

    const menuGroups = [
        {
            label: 'Opciones', // Primer nivel (agrupador)
            icon: 'pi pi-folder',
            expanded: true, // Abierto por defecto y no colapsable
            items: [
                {
                    label: 'Monitorear', // Segundo nivel
                    icon: 'pi pi-plus',
                    command: () => navigate('/home/monitorear') // 🚀 Redirige al hacer clic
                },
                {
                    label: 'Administrar', // Segundo nivel
                    icon: 'pi pi-search',
                    command: () => navigate('/home/administrar') // 🚀 Redirige al hacer clic
                },
                {
                    label: 'Calcular', // Tercer nivel
                    icon: 'pi pi-folder-open',
                    command: () => navigate('/home/calcular') // 🚀 Redirige al hacer clic
                }
            ]
        },
        {
            label: 'Profile', // Primer nivel (agrupador)
            icon: 'pi pi-user',
            expanded: true, // Abierto por defecto y no colapsable
            items: [
                {
                    label: 'Settings', // Segundo nivel
                    icon: 'pi pi-cog'
                },
                {
                    label: 'Logout', // Segundo nivel
                    icon: 'pi pi-sign-out'
                }
            ]
        },
        {
            label: 'Advanced', // Primer nivel (agrupador)
            icon: 'pi pi-cog',
            expanded: true, // Abierto por defecto y no colapsable
            items: [
                {
                    label: 'Features', // Segundo nivel
                    icon: 'pi pi-star',
                    items: [
                        {
                            label: 'Level 3 - Feature 1', // Tercer nivel
                            icon: 'pi pi-check'
                        },
                        {
                            label: 'Level 3 - Feature 2', // Tercer nivel
                            icon: 'pi pi-check'
                        }
                    ]
                }
            ]
        }
    ];

    const findBreadcrumbPath = (label, items, path = []) => {
        for (let item of items) {
            const newPath = [...path, { label: item.label }];
            if (item.label === label) return newPath;
            if (item.items) {
                const foundPath = findBreadcrumbPath(label, item.items, newPath);
                if (foundPath) return foundPath;
            }
        }
        return null;
    };

    // Inicializar el estado con los valores por defecto del JSON
    const [expandedGroups, setExpandedGroups] = useState(initializeExpandedGroups(menuGroups));

    // Función para manejar la expansión/colapso de los grupos
    const toggleGroup = (label, parentLabel) => {
        setExpandedGroups((prev) => {
            const newState = { ...prev };

            // Obtener la ruta del padre si existe
            const parentPrefix = parentLabel ? `${parentLabel}-` : '';

            // Cerrar elementos de niveles superiores fuera de la rama actual
            Object.keys(newState).forEach((key) => {
                if (!key.startsWith(parentPrefix) && key !== label) {
                    newState[key] = false;
                }
            });

            // Cerrar hermanos del mismo nivel sin afectar la rama actual
            Object.keys(newState).forEach((key) => {
                if (key.startsWith(parentPrefix) && key !== label && key.split('-').length === label.split('-').length) {
                    newState[key] = false;
                }
            });

            // Alternar el estado del elemento seleccionado
            newState[label] = !prev[label];

            // Mantener abiertos todos los padres de la rama actual
            let parent = parentLabel;
            while (parent) {
                newState[parent] = true;
                parent = parent.includes('-') ? parent.substring(0, parent.lastIndexOf('-')) : null;
            }

            return newState;
        });
    };

    // Función recursiva para renderizar los ítems del menú
    const handleClick = (item) => {
        setSelectedItem(item.label); // Marcar como seleccionado
        const breadcrumbPath = findBreadcrumbPath(item.label, menuGroups);
        setBreadcrumb([...breadcrumbPath]);
        if (item.command) {
            item.command(); // Ejecuta la acción definida en el menú (como `navigate(...)`)
        } else {
            //toast.current.show({ severity: 'info', summary: 'Clic', detail: `Has hecho clic en ${item.label}` });
        }
    };

    const renderMenuItems = (items, level = 0, parentLabel = '') => {
        return items.map((item, index) => {
            const hasSubItems = item.items && item.items.length > 0;
            const itemLabel = parentLabel ? `${parentLabel}-${item.label}` : item.label; // Identificador único
            const isExpanded = expandedGroups[itemLabel];

            return (
                <div key={index}>
                    <div
                        className={`e-menuitem ${selectedItem === item.label ? `selected selected-${theme}` : ''}`} // Aplica clase si está seleccionado
                        onClick={() => hasSubItems ? toggleGroup(itemLabel, parentLabel) : handleClick(item)}
                        /*style={{ cursor: 'pointer', paddingLeft: `${level * 16}px` }}*/
                    >
                        <span className="e-menuitem-icon">{item.icon && <i className={item.icon}></i>}</span>
                        <span className="e-menuitem-text flex-grow-1">{item.label}</span>
                        {hasSubItems && (
                            <span className="e-submenu-icon">
                                {isExpanded ? <i className="pi pi-chevron-down"></i> : <i className="pi pi-chevron-right"></i>}
                            </span>
                        )}
                    </div>
                    {hasSubItems && isExpanded && (
                        <div className="e-submenu-list expanded">
                            {renderMenuItems(item.items, level + 1, itemLabel)}
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        
        <div className={`e-menu ${theme === 'dark' ? 'dark' : 'light'}`} style={{ width: '100%' }}>
            <Toast ref={toast}/>
            {menuGroups.map((group, index) => (
                <div key={index}>
                    <div
                        className={`e-menuitem e-group-header e-group-header-${theme}`}
                        onClick={() => !group.expanded && toggleGroup(group.label)} // Evitar colapsar si está forzado a estar expandido
                        style={{ cursor: group.expanded ? 'default' : 'pointer' }} // Cambiar el cursor solo si es colapsable
                    >
                        <span className="e-menuitem-icon">{group.icon && <i className={group.icon}></i>}</span>
                        <span className="e-menuitem-text flex-grow-1">{group.label}</span>
                        {!group.expanded && ( // Mostrar flecha solo si no está forzado a estar expandido
                            <span className="e-submenu-icon">
                                {expandedGroups[group.label] ? <i className="pi pi-chevron-down"></i> : <i className="pi pi-chevron-right"></i>}
                            </span>
                        )}
                    </div>
                    {(expandedGroups[group.label] || group.expanded) && ( // Mostrar subniveles si está expandido o forzado a estar expandido
                        <div className="e-submenu-list expanded">
                            {renderMenuItems(group.items, 1, group.label)}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Navbar;