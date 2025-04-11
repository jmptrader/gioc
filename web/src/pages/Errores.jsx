import React, { useState, useEffect } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import FiltroFechas from "../components/FiltroFechas";
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
    const [first2, setFirst2] = useState(0); // ⬅️ estado para controlar la página
    const [totalRecords2, setTotalRecords2] = useState(0); // Total de registros
    const [idDetalle, setIdDetalle] = useState(0); // ID del registro seleccionado

    const [initialized, setInitialized] = useState(false);

    const [fechaDesde, setFechaDesde] = useState(null);
    const [fechaHasta, setFechaHasta] = useState(null);


    useEffect(() => {
        if (!initialized) {
            loadPage(0, 10);
            setInitialized(true);
            return;
        }

        if (idDetalle !== 0) {
            loadPage2(0, 10, idDetalle);
        }
    }, [idDetalle]);

    // Manejador de paginación
    const onPage = (event) => {
        setFirst(event.first); // ⬅️ Actualiza el estado
        loadPage(event.first, event.rows);
    };

    const onPage2 = (event) => {
        setFirst2(event.first); // ⬅️ Actualiza el estado
        loadPage2(event.first, event.rows, idDetalle);
    };

    const loadPage = (firstIndex, rows, desde = fechaDesde, hasta = fechaHasta) => {
        setLoading(true);
        const currentPage = firstIndex / rows + 1;

        sendDataErrores0({
            page: currentPage,
            pageSize: rows,
            fechaInicio: formatDate(desde),
            fechaFin: formatDate(hasta)
        }).then((data) => {
            setDataTab0(data.data.data);
            setTotalRecords(data.data.total);
            setLoading(false);
        });
    };


    const loadPage2 = (firstIndex, rows, id) => {
        setLoading(true);
        const currentPage = firstIndex / rows + 1;
        sendDataErrores2({ page: currentPage, pageSize: rows, id: id }).then((data) => {
            setDataTab2(data.data.data);
            setTotalRecords2(data.data.total);
            setLoading(false);
            setActiveIndex(2);
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
        setIdDetalle(rowData.ID_SECUENCIA);
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

    const handleFilter = ({ desde, hasta }) => {

        // Convertir las fechas a formato 'YYYY-MM-DD' (solo la parte de la fecha)
        const fechaDesdeFormatted = formatDate(desde);
        const fechaHastaFormatted = hasta ? formatDate(hasta) : null;  // Si 'hasta' es null, lo dejamos como null

        setFechaDesde(desde);
        setFechaHasta(hasta);

        setFirst(0);

        loadPage(0, 10, fechaDesdeFormatted, fechaHastaFormatted);
    };

    // Función para formatear la fecha a 'YYYY-MM-DD'
    const formatDate = (date) => {
        if (!date) return null;  // Si la fecha es null o undefined, devolvemos null
        const d = new Date(date);
        return d.toISOString().split('T')[0];  // Formato 'YYYY-MM-DD'
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
                        <>
                            <FiltroFechas
                                fechaDesde={fechaDesde}
                                fechaHasta={fechaHasta}
                                setFechaDesde={setFechaDesde}
                                setFechaHasta={setFechaHasta}
                                onFilter={handleFilter}
                            />

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
                                <Column header="Iniciado" body={(rowData) => iconTemplate(rowData.IND_INICI0)} align="center" />
                                <Column header="Finalizado" body={(rowData) => iconTemplate(rowData.IND_FINALIZADO)} align="center" />
                                <Column header="Error" body={(rowData) => errorIconTemplate(rowData.IND_ERROR)} align="center" />
                                <Column field="HORA_INICIO" header="Hora Iniciado" />
                                <Column field="HORA_FIN" header="Hora Finalizado" />
                                <Column header="Reproceso" body={(rowData) => iconTemplate(rowData.IND_REPROCESO)} align="center" />
                                <Column field="MENSAJE" header="Mensaje" />
                            </DataTable>
                        </>
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
                            <Column header="Iniciado" body={(rowData) => iconTemplate(rowData.IND_INICIO)} align="center" />
                            <Column header="Finalizado" body={(rowData) => iconTemplate(rowData.IND_FINALIZADO)} align="center" />
                            <Column header="Error" body={(rowData) => errorIconTemplate(rowData.IND_ERROR)} align="center" />
                            <Column field="HORA_INICIO" header="Hora Iniciado" />
                            <Column field="HORA_FIN" header="Hora Finalizado" />
                            <Column header="Reproceso" body={(rowData) => iconTemplate(rowData.reproceso)} align="center" />
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
                        <DataTable
                            value={dataTab2}
                            paginator
                            rows={10}
                            first={first2} // ⬅️ Aquí se indica la página actual
                            totalRecords={totalRecords2}
                            onPage={onPage2}
                            lazy
                            loading={loading}
                            selectionMode="single"
                            onRowClick={(e) => handleRowClickTab2(e.data)}
                        >
                            <Column field="ID_SECUENCIA" header="Id Secuencia" />
                            <Column field="MODULO_CARGA" header="Modulo" />
                            <Column field="PRODUCT_NAME" header="Nombre Producto" />
                            <Column field="TRANSACTION_NAME" header="Nombre Transaccion" />
                            <Column field="CANTIDAD_REGISTROS" header="Nro Registros" />
                            <Column header="Error" body={(rowData) => errorIconTemplate(rowData.IND_ERROR)} align="center" />
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
                            <Column header="Error" body={(rowData) => errorIconTemplate(rowData.IND_ERROR)} align="center" />
                            <Column header="Consistencia" field="consistencia" />
                            <Column field="MENSAJE" header="Mensaje" />
                        </DataTable>
                    )}
                </TabPanel>
            </TabView>
        </div>
    );
};

export default MyTabbedPage;
