package database

import (
	"context"
	"database/sql"
	"fmt"
	"time"
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
