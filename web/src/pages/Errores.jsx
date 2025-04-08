import React, { useState, useEffect } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { sendDataErrores1, sendDataErrores2, sendDataErrores3 } from "../services/apiService";

const MyTabbedPage = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [enabledTabs, setEnabledTabs] = useState([true, true, false, false]);
    const [selectedRowTab1, setSelectedRowTab1] = useState(null);
    const [selectedRowTab2, setSelectedRowTab2] = useState(null);
    const [selectedRowTab3, setSelectedRowTab3] = useState(null);
    const [loading, setLoading] = useState(false);

    const [dataTab1, setDataTab1] = useState([]);
    const [dataTab2, setDataTab2] = useState([]);
    const [dataTab3, setDataTab3] = useState([]);

    // Cargar datos automáticamente cuando se monta el componente (primer tab por defecto)
    useEffect(() => {
        // Simula la carga de datos para el primer tab
        sendDataErrores1().then((data) => {
            setDataTab1(data);  // Guardar los datos
            setLoading(false);   // Detener el spinner
        });
    }, []); // El array vacío asegura que se ejecute solo al montar el componente

    const handleRowClickTab1 = (rowData) => {
        setSelectedRowTab1(rowData);
        const newTabs = [...enabledTabs];
        newTabs[2] = true;
        setEnabledTabs(newTabs);
        // Simular una carga antes de mostrar el tab 3
        setLoading(true);
        // Simula la carga de datos para el primer tab
        sendDataErrores2().then((data) => {
            setActiveIndex(2);
            setDataTab2(data);  // Guardar los datos
            setLoading(false);   // Detener el spinner
        });
    };

    const handleRowClickTab2 = (rowData) => {
        setSelectedRowTab2(rowData);
        const newTabs = [...enabledTabs];
        newTabs[3] = true;
        setEnabledTabs(newTabs);
        // Simular una carga antes de mostrar el tab 3
        setLoading(true);
        setLoading(true);
        // Simula la carga de datos para el primer tab
        sendDataErrores3().then((data) => {
            setActiveIndex(3);
            setDataTab3(data);  // Guardar los datos
            setLoading(false);   // Detener el spinner
        });
    };

    const handleTabChange = (e) => {

        console.log("Tab changed to index:", e.index);
        const newIndex = e.index;

        setLoading(true); // Activar loading
        setTimeout(() => {
            // Simular carga con retraso
            if (newIndex === 0) {
                setEnabledTabs([true, true, false, false]);
                setSelectedRowTab1(null);
            }
            setActiveIndex(newIndex);
            setLoading(false); // Ocultar loading después de simular
        }, 800); // 800ms de carga
    };

    // Column templates
    const iconTemplate = (value) => {
        return value ? (
            <i className="pi pi-check text-green-500" title="Sí"></i>
        ) : (
            <i className="pi pi-times text-red-500" title="No"></i>
        );
    };

    const errorIconTemplate = (rowData) => {
        return rowData.error ? (
            <i className="pi pi-exclamation-triangle text-yellow-500" title="Con error"></i>
        ) : (
            <i className="pi pi-check-circle text-green-500" title="Sin error"></i>
        );
    };

    return (
        <div className="card">
            <TabView activeIndex={activeIndex} onTabChange={handleTabChange}>
                <TabPanel header="Inicio" disabled={!enabledTabs[0]}>
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                        </div>
                    ) : (
                        <div></div>
                    )}
                </TabPanel>
                <TabPanel header="Control Carga" disabled={!enabledTabs[1]}>
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                        </div>
                    ) : (
                        <DataTable
                            value={dataTab1}
                            selectionMode="single"
                            onRowClick={(e) => handleRowClickTab1(e.data)}
                        >
                            <Column field="id" header="Id Secuencia" />
                            <Column field="fechaCarga" header="Fecha Carga" />
                            <Column field="modulo" header="Modulo" />
                            <Column header="Iniciado" body={(rowData) => iconTemplate(rowData.iniciado)} align="center" />
                            <Column header="Finalizado" body={(rowData) => iconTemplate(rowData.finalizado)} align="center" />
                            <Column header="Error" body={(rowData) => errorIconTemplate(rowData.error)} align="center" />
                            <Column field="horaIniciado" header="Hora Iniciado" />
                            <Column field="horaFinalizado" header="Hora Finalizado" />
                            <Column header="Reproceso" body={(rowData) => iconTemplate(rowData.reproceso)} align="center" />
                            <Column field="mensaje" header="Mensaje" />
                        </DataTable>
                    )}
                </TabPanel>

                <TabPanel header="Detalle Producto" disabled={!enabledTabs[2]}>
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                        </div>
                    ) : (
                        <DataTable value={dataTab2} selectionMode="single" onRowClick={(e) => handleRowClickTab2(e.data)}>
                            <Column field="id" header="Id Secuencia" />
                            <Column field="secuencia" header="Secuencia" />
                            <Column field="modulo" header="Modulo" />
                            <Column field="nombreProducto" header="Nombre Producto" />
                            <Column field="nombreTransaccion" header="Nombre Transaccion" />
                            <Column field="nroRegistros" header="Nro Registros" />
                            <Column header="Error" body={(rowData) => errorIconTemplate(rowData.error)} align="center" />
                        </DataTable>
                    )}
                </TabPanel>

                <TabPanel header="Carga Operacion" disabled={!enabledTabs[3]}>
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                        </div>
                    ) : (
                        <DataTable value={dataTab3} selectionMode="single">
                            <Column field="id" header="Id Secuencia" />
                            <Column field="secuencia" header="Secuencia" />
                            <Column field="modulo" header="Modulo" />
                            <Column field="nombreMovimiento" header="Nombre Movimiento" />
                            <Column field="accountNumber" header="Account Number" />
                            <Column header="Error" body={(rowData) => errorIconTemplate(rowData.error)} align="center" />
                            <Column header="Consistencia" field="consistencia" />
                            <Column field="mensaje" header="Mensaje" />
                        </DataTable>
                    )}
                </TabPanel>
            </TabView>
        </div>
    );
};

export default MyTabbedPage;
