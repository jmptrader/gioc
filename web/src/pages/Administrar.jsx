import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const Administrar = () => {
  const data = [
    { id: 1, nombre: 'Producto A', precio: 10 },
    { id: 2, nombre: 'Producto B', precio: 20 },
    // ... más datos
  ];

  return (
    <div>
      <h1>Administrar Parámetros</h1>
      <DataTable value={data}>
        <Column field="id" header="ID"></Column>
        <Column field="nombre" header="Nombre"></Column>
        <Column field="precio" header="Precio"></Column>
      </DataTable>
    </div>
  );
};

export default Administrar;