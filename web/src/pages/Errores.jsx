import React, { useState, useEffect } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { sendDataErrores0, sendDataErrores1, sendDataErrores2, sendDataErrores3 } from "../services/apiService";

const MyTabbedPage = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [enabledTabs, setEnabledTabs] = useState([true, false, false, false]);
    const [selectedRowTab0, setSelectedRowTab0] = useState(null);
    const [selectedRowTab1, setSelectedRowTab1] = useState(null);
    const [selectedRowTab2, setSelectedRowTab2] = useState(null);
    const [selectedRowTab3, setSelectedRowTab3] = useState(null);
    const [loading, setLoading] = useState(false);

    const [dataTab0, setDataTab0] = useState([]);
    const [dataTab1, setDataTab1] = useState([]);
    const [dataTab2, setDataTab2] = useState([]);
    const [dataTab3, setDataTab3] = useState([]);

    const [totalRecords, setTotalRecords] = useState(0); // Total de registros
    const [first, setFirst] = useState(0); // ⬅️ estado para controlar la página

    useEffect(() => {
        loadPage(0, 10);
    }, []);

    // Manejador de paginación
    const onPage = (event) => {
        setFirst(event.first); // ⬅️ Actualiza el estado
        loadPage(event.first, event.rows);
    };

    const loadPage = (firstIndex, rows) => {
        setLoading(true);
        const currentPage = firstIndex / rows + 1;
        sendDataErrores0({ page: currentPage, pageSize: rows }).then((data) => {
            setDataTab0(data.data.data);
            setTotalRecords(data.data.total);
            setLoading(false);
        });
    };

    const handleRowClickTab0 = (rowData) => {
        setSelectedRowTab0(rowData);
        const newTabs = [...enabledTabs];
        newTabs[1] = true;
        setEnabledTabs(newTabs);
        // Simular una carga antes de mostrar el tab 3
        setLoading(true);
        // Simula la carga de datos para el primer tab
        sendDataErrores1({ id: rowData.ID_SECUENCIA }).then((data) => {
            setActiveIndex(1);
            setDataTab1(data.data);  // Guardar los datos
            setLoading(false);   // Detener el spinner
        });
    };

    const handleRowClickTab1 = (rowData) => {
        setSelectedRowTab1(rowData);
        const newTabs = [...enabledTabs];
        newTabs[2] = true;
        setEnabledTabs(newTabs);
        // Simular una carga antes de mostrar el tab 3
        setLoading(true);
        // Simula la carga de datos para el primer tab
        sendDataErrores2({ id: rowData.ID_SECUENCIA }).then((data) => {
            setActiveIndex(2);
            setDataTab2(data.data);  // Guardar los datos
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
        sendDataErrores3({ id: rowData.ID_SECUENCIA }).then((data) => {
            setActiveIndex(3);
            setDataTab3(data.data);  // Guardar los datos
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
                setEnabledTabs([true, false, false, false]);
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
                        <DataTable
                            value={dataTab0}
                            paginator
                            rows={10}
                            first={first} // ⬅️ Aquí se indica la página actual
                            totalRecords={totalRecords}
                            onPage={onPage}
                            lazy
                            loading={loading}
                            selectionMode="single"
                            onRowClick={(e) => handleRowClickTab0(e.data)}
                        >
                            <Column field="ID_SECUENCIA" header="Id Secuencia" />
                            <Column field="FECHA_PROCESO" header="Fecha Proceso" />
                            <Column field="FECHA_CARGA" header="Fecha Carga" />
                            <Column header="IND_INICI0" body={(rowData) => iconTemplate(rowData.IND_INICI0)} align="center" />
                            <Column header="IND_FINALIZADO" body={(rowData) => iconTemplate(rowData.IND_FINALIZADO)} align="center" />
                            <Column header="IND_ERROR" body={(rowData) => errorIconTemplate(rowData.IND_ERROR)} align="center" />
                            <Column field="HORA_INICIO" header="Hora Iniciado" />
                            <Column field="HORA_FIN" header="Hora Finalizado" />
                            <Column header="IND_REPROCESO" body={(rowData) => iconTemplate(rowData.IND_REPROCESO)} align="center" />
                            <Column field="MENSAJE" header="Mensaje" />
                        </DataTable>
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
                            <Column field="ID_SECUENCIA" header="Id Secuencia" />
                            <Column field="FECHA_CARGA" header="Fecha Carga" />
                            <Column field="MODULO_CARGA" header="Modulo" />
                            <Column header="IND_INICIO" body={(rowData) => iconTemplate(rowData.IND_INICIO)} align="center" />
                            <Column header="IND_FINALIZADO" body={(rowData) => iconTemplate(rowData.IND_FINALIZADO)} align="center" />
                            <Column header="IND_ERROR" body={(rowData) => errorIconTemplate(rowData.IND_ERROR)} align="center" />
                            <Column field="HORA_INICIO" header="Hora Iniciado" />
                            <Column field="HORA_FIN" header="Hora Finalizado" />
                            <Column header="IND_REPRECESO" body={(rowData) => iconTemplate(rowData.reproceso)} align="center" />
                            <Column field="MENSAJE" header="Mensaje" />
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
                            <Column field="ID_SECUENCIA" header="Id Secuencia" />
                            <Column field="MODULO_CARGA" header="Modulo" />
                            <Column field="PRODUCT_NAME" header="Nombre Producto" />
                            <Column field="TRANSACTION_NAME" header="Nombre Transaccion" />
                            <Column field="CANTIDAD_REGISTROS" header="Nro Registros" />
                            <Column header="IND_ERROR" body={(rowData) => errorIconTemplate(rowData.IND_ERROR)} align="center" />
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
                            <Column field="ID_SECUENCIA" header="Id Secuencia" />
                            <Column field="MODULO_CARGA" header="Modulo" />
                            <Column field="ID_MOVIMIENTO" header="Nombre Movimiento" />
                            <Column field="ACCOUNT_NUMBER" header="Account Number" />
                            <Column header="IND_ERROR" body={(rowData) => errorIconTemplate(rowData.IND_ERROR)} align="center" />
                            <Column header="IND_CONSISTENCIA" field="consistencia" />
                            <Column field="MENSAJE" header="Mensaje" />
                        </DataTable>
                    )}
                </TabPanel>
            </TabView>
        </div>
    );
};

export default MyTabbedPage;
