import { useRef } from 'react';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

const FiltroFechas = ({ fechaDesde, fechaHasta, setFechaDesde, setFechaHasta, onFilter }) => {
    const toast = useRef(null);

    const showWarn = (msg) => {
        toast.current.show({ severity: 'warn', summary: 'Validación', detail: msg, life: 3000 });
    };

    const aplicarFiltro = () => {
        if (!fechaDesde && !fechaHasta) {
            showWarn("Debes seleccionar al menos una fecha.");
            return;
        }

        if (fechaDesde && fechaHasta && fechaHasta < fechaDesde) {
            showWarn("La fecha 'Hasta' no puede ser menor que la fecha 'Desde'.");
            return;
        }

        onFilter({ desde: fechaDesde, hasta: fechaHasta });
    };

    const limpiarFechas = () => {
        setFechaDesde(null);
        setFechaHasta(null);
        onFilter({ desde: null, hasta: null });
    };

    return (
        <div className="flex flex-wrap gap-4 items-end py-4 border rounded-lg shadow-md bg-white max-w-md">
            <Toast ref={toast} />

            <div className="flex flex-col align-items-center gap-1">
                <label className="mb-1 text-sm font-medium text-gray-700">Desde</label>
                <Calendar
                    id="fechaDesde"
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.value)}
                    dateFormat="dd/mm/yy"
                    showIcon
                    placeholder="dd/mm/yyyy"
                    maxDate={fechaHasta || undefined}
                />
            </div>

            <div className="flex flex-col align-items-center gap-1">
                <label className="mb-1 text-sm font-medium text-gray-700">Hasta</label>
                <Calendar
                    id="fechaHasta"
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.value)}
                    dateFormat="dd/mm/yy"
                    showIcon
                    placeholder="dd/mm/yyyy"
                    minDate={fechaDesde || undefined}
                />
            </div>

            <div className="flex gap-2">
                <Button
                    label="Filtrar"
                    icon="pi pi-filter"
                    onClick={aplicarFiltro}
                    disabled={!fechaDesde && !fechaHasta}
                />
                <Button
                    label="Limpiar"
                    icon="pi pi-times"
                    className="p-button-secondary"
                    onClick={limpiarFechas}
                />
            </div>
        </div>
    );
};

export default FiltroFechas;
