import React, {useState} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { sendData } from "../services/apiService";

const Interface = () => {
  
  const data = Array.from({ length: 100 }, (_, id) => ({ id, nombre0: `Nombre0_${id}`, precio0: (Math.random() * 100).toFixed(2), nombre1: `Nombre1_${id}`, precio1: (Math.random() * 100).toFixed(2), nombre2: `Nombre2_${id}`, precio2: (Math.random() * 100).toFixed(2), nombre3: `Nombre3_${id}`, precio3: (Math.random() * 100).toFixed(2), nombre4: `Nombre4_${id}`, precio4: (Math.random() * 100).toFixed(2), }));

  const [response, setResponse] = useState(null);
  const [interfaces, setInterfaces] = useState([]);

  const handleSendData = async () => {
      try {
          const jsonData = { name: "BFP" };
          const result = await sendData(jsonData);
          setResponse(JSON.stringify(result, null, 2));
          setInterfaces(result.data);
      } catch (error) {
          setResponse("Error al enviar los datos");
      }
  };


  return (
    <div>
      <h1>Monitorear Procesos</h1>
      <button onClick={handleSendData} className="bg-blue-500 text-white px-4 py-2 rounded">Consultar</button>
      <DataTable value={interfaces} paginator rows={8} selectionMode="single">
        <Column field="CODIGO_INTERFASE" header="CODIGO_INTERFASE"></Column>
        <Column field="NOMBRE_FISICO" header="NOMBRE_FISICO"></Column>
        <Column field="EXTENSION_FISICA" header="EXTENSION_FISICA"></Column>
        <Column field="DIRECTORIO_UBICACION" header="DIRECTORIO_UBICACION"></Column>
        <Column field="ORIGEN_INTERFASE" header="ORIGEN_INTERFASE"></Column>
        <Column field="PERIODICIDAD" header="PERIODICIDAD"></Column>
        <Column field="DESCRIPCION_INTERFASE" header="DESCRIPCION_INTERFASE"></Column>
        <Column field="POSEE_CABECERA" header="POSEE_CABECERA"></Column>
        <Column field="POSEE_DETALLE" header="POSEE_DETALLE"></Column>
        <Column field="POSEE_TOTALES" header="POSEE_TOTALES"></Column>
        <Column field="ESTADO_INTERFASE" header="ESTADO_INTERFASE"></Column>
        <Column field="TABLA_BD, " header="TABLA_BD"></Column>
        <Column field="TABLA_ORIGEN" header="TABLA_ORIGEN"></Column>
        <Column field="PKG_VALIDACION" header="PKG_VALIDACION"></Column>
        <Column field="TIPO_ORIGEN" header="TIPO_ORIGEN"></Column>
        <Column field="VISTA_VALIDACION" header="VISTA_VALIDACION"></Column>
      </DataTable>
    </div>
  );
};

export default Interface;