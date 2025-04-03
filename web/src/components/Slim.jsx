import React, { useState } from "react";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import './Slim.css'

export default function Slim() {
    const [menu, setMenu] = useState([
        {
            label: "Dashboard",
            icon: "pi pi-home",
            command: () => console.log("Dashboard"),
        },
        {
            label: "Usuarios",
            icon: "pi pi-users",
            items: [
                { label: "Lista", icon: "pi pi-list", command: () => console.log("Lista Usuarios") },
                { label: "Roles", icon: "pi pi-id-card", command: () => console.log("Roles Usuarios") },
            ],
        },
        {
            label: "Configuración",
            icon: "pi pi-cog",
            command: () => console.log("Configuración"),
        },
    ]);

    return (
        <div className="slim-sidebar">
            {menu.map((item, index) => (
                <div key={index} className="slim-menu-item">
                    <Button 
                        icon={item.icon} 
                        className="p-button-text p-button-plain menu-btn"
                        onClick={item.command}
                    />
                    {item.items && (
                        <Menu model={item.items} popup />
                    )}
                </div>
            ))}
        </div>
    );
}