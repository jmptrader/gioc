import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const Monitorear = () => {
  
  const data = Array.from({ length: 100 }, (_, id) => ({ id, nombre0: `Nombre0_${id}`, precio0: (Math.random() * 100).toFixed(2), nombre1: `Nombre1_${id}`, precio1: (Math.random() * 100).toFixed(2), nombre2: `Nombre2_${id}`, precio2: (Math.random() * 100).toFixed(2), nombre3: `Nombre3_${id}`, precio3: (Math.random() * 100).toFixed(2), nombre4: `Nombre4_${id}`, precio4: (Math.random() * 100).toFixed(2), }));


  return (
    <div>
      <h1>Monitorear Procesos</h1>
      <DataTable value={data} paginator rows={8} selectionMode="single">
        <Column field="id" header="ID"></Column>
        <Column field="nombre0" header="Nombre0"></Column>
        <Column field="precio0" header="Precio0"></Column>
        <Column field="nombre1" header="Nombre1"></Column>
        <Column field="precio1" header="Precio1"></Column>
        <Column field="nombre2" header="Nombre2"></Column>
        <Column field="precio2" header="Precio2"></Column>
        <Column field="nombre3" header="Nombre3"></Column>
        <Column field="precio4" header="Precio4"></Column>
      </DataTable>
    </div>
  );
};

export default Monitorear;