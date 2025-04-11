package database

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/godror/godror"
)

func ExecuteSqlQueryWithTimeout(db *sql.DB, query string, args []interface{}, timeout time.Duration) ([]map[string]interface{}, error) {
	// Crear un contexto con un timeout específico
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	var resultados []map[string]interface{}

	// Llamar a ExecuteQueryWithContext pasando el contexto y la función de escaneo
	err := ExecuteQueryWithContext(db, query, args, ctx, func(rows *sql.Rows) error {
		columns, err := rows.Columns()
		if err != nil {
			return err
		}

		values := make([]interface{}, len(columns))
		valuePtrs := make([]interface{}, len(columns))

		for i := range values {
			valuePtrs[i] = &values[i]
		}

		if err := rows.Scan(valuePtrs...); err != nil {
			return err
		}

		rowMap := make(map[string]interface{})
		for i, col := range columns {
			val := values[i]
			if b, ok := val.([]byte); ok {
				rowMap[col] = string(b)
			} else {
				rowMap[col] = val
			}
		}

		resultados = append(resultados, rowMap)
		return nil
	})

	if err != nil {
		return nil, err
	}

	return resultados, nil
}

func ExecuteQueryWithContext(db *sql.DB, query string, params []interface{}, ctx context.Context, scanFunc func(*sql.Rows) error) error {
	// Crear una consulta con el contexto proporcionado
	rows, err := db.QueryContext(ctx, query, params...)
	if err != nil {
		return fmt.Errorf("error ejecutando la consulta: %w", err)
	}
	defer rows.Close()

	// Iterar sobre las filas con rows.Next()
	for rows.Next() {
		// Pasamos las filas a la función de escaneo
		if err := scanFunc(rows); err != nil {
			return fmt.Errorf("error procesando las filas: %w", err)
		}
	}

	// Verificar si hubo algún error durante la iteración
	if err := rows.Err(); err != nil {
		return fmt.Errorf("error iterando las filas: %w", err)
	}

	return nil
}

// ExecuteSqlQueryWithNamedParams ejecuta una consulta con parámetros con nombre usando godror
func ExecuteSqlQueryWithNamedParams(db *sql.DB, query string, params map[string]interface{}, timeout time.Duration) ([]map[string]interface{}, error) {
	// Crear contexto con timeout
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	// Preparar la consulta
	stmt, err := db.PrepareContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("error preparando consulta: %v", err)
	}
	defer stmt.Close()

	// Convertir los parámetros a la forma que godror espera
	namedArgs := make([]interface{}, 0, len(params))
	for name, value := range params {
		namedArgs = append(namedArgs, sql.Named(name, value))
	}

	// Ejecutar la consulta
	rows, err := stmt.QueryContext(ctx, namedArgs...)
	if err != nil {
		return nil, fmt.Errorf("error ejecutando consulta: %v", err)
	}
	defer rows.Close()

	// Obtener información de las columnas
	columns, err := rows.Columns()
	if err != nil {
		return nil, fmt.Errorf("error obteniendo columnas: %v", err)
	}

	// Procesar los resultados
	var results []map[string]interface{}
	for rows.Next() {
		// Crear slice para los valores y otro para los punteros
		values := make([]interface{}, len(columns))
		pointers := make([]interface{}, len(columns))
		for i := range values {
			pointers[i] = &values[i]
		}

		// Escanear la fila
		if err := rows.Scan(pointers...); err != nil {
			return nil, fmt.Errorf("error escaneando fila: %v", err)
		}

		// Crear mapa para la fila actual
		row := make(map[string]interface{})
		for i, col := range columns {
			// Convertir valores especiales de Oracle
			if v, ok := values[i].(godror.Number); ok {
				row[col] = v.String()
			} else if v, ok := values[i].(time.Time); ok {
				row[col] = v
			} else {
				row[col] = values[i]
			}
		}

		results = append(results, row)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error en iteración de filas: %v", err)
	}

	return results, nil
}
