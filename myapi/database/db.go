package database

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"time"

	_ "github.com/godror/godror"
)

var (
	DB1 *sql.DB // Conexión a base de datos 1
	DB2 *sql.DB // Conexión a base de datos 2
)

func InitDBs() {
	var err error

	// Base de datos 1
	dsn1 := "SAR/reportes@(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=45.33.0.230)(PORT=1521))(CONNECT_DATA=(SID=ORCL)))"
	DB1, err = sql.Open("godror", dsn1)
	if err != nil {
		log.Fatal("Error conectando a Oracle (DB1):", err)
	}
	if err = DB1.Ping(); err != nil {
		log.Fatal("Error en el ping a Oracle (DB1):", err)
	}

	// Base de datos 2
	dsn2 := "TAE/Reporte1@(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=45.33.0.230)(PORT=1521))(CONNECT_DATA=(SID=ORCL)))"
	DB2, err = sql.Open("godror", dsn2)
	if err != nil {
		log.Fatal("Error conectando a Oracle (DB2):", err)
	}
	if err = DB2.Ping(); err != nil {
		log.Fatal("Error en el ping a Oracle (DB2):", err)
	}
}

// CallProcessJSON ejecuta el procedimiento almacenado en Oracle
func CallProcessJSON(inputJSON string) (string, error) {
	var outputJSON string

	// Contexto con timeout para evitar bloqueos
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Ejecutar el procedimiento almacenado
	_, err := DB1.ExecContext(ctx, "BEGIN SAR_WEBAPP.MONITOR_INTERFASES_ENTRADA(:1, :2); END;",
		inputJSON,
		sql.Out{Dest: &outputJSON},
	)

	if err != nil {
		return "", fmt.Errorf("error ejecutando el procedimiento: %v", err)
	}

	// Verificar que el procedimiento devolvió datos
	if outputJSON == "" {
		return "", fmt.Errorf("procedimiento no devolvió datos")
	}

	return outputJSON, nil
}

func GetControlCarga(db *sql.DB, inputJSON string) (map[string]interface{}, error) {
	// Parsear JSON
	var input map[string]interface{}
	if err := json.Unmarshal([]byte(inputJSON), &input); err != nil {
		return nil, fmt.Errorf("error al parsear el JSON de entrada: %w", err)
	}

	// Extraer parámetros de paginación
	page := intFromJSON(input, "page", 1)
	pageSize := intFromJSON(input, "pageSize", 100)
	offset := (page - 1) * pageSize

	// Consulta paginada
	query := `
		SELECT * FROM (
			SELECT Tae_control_carga_cab.*, ROWNUM AS rnum
			FROM Tae_control_carga_cab
			WHERE ROWNUM <= :maxRow
		)
		WHERE rnum > :minRow
	`

	data, err := ExecuteSqlQueryWithTimeout(db, query, []interface{}{offset + pageSize, offset}, 20*time.Second)
	if err != nil {
		return nil, err
	}

	// Consulta total de registros
	var total int
	countQuery := `SELECT COUNT(*) FROM Tae_control_carga_cab`
	err = db.QueryRow(countQuery).Scan(&total)
	if err != nil {
		return nil, fmt.Errorf("error obteniendo el total de registros: %w", err)
	}

	// Retornar datos + total
	return map[string]interface{}{
		"data":       data,
		"total":      total,
		"page":       page,
		"pageSize":   pageSize,
		"totalPages": (total + pageSize - 1) / pageSize,
	}, nil
}

func GetControlCargaMod(db *sql.DB, inputJSON string) ([]map[string]interface{}, error) {
	// Paso 1: Intentamos parsear el JSON a un mapa de tipo map[string]interface{}
	var input map[string]interface{}
	err := json.Unmarshal([]byte(inputJSON), &input)
	if err != nil {
		return nil, fmt.Errorf("error al parsear el JSON de entrada: %w", err)
	}

	// Paso 2: Accedemos al valor de 'id' en el mapa
	id, ok := input["id"].(float64) // El valor será de tipo float64 al deserializar el JSON
	if !ok {
		return nil, fmt.Errorf("el campo 'id' no se encontró o no es del tipo correcto")
	}

	// Consulta sin parámetros, devuelve todo
	query := "SELECT m.*, c.FECHA_CARGA, c.IND_REPROCESO FROM Tae_control_carga_mod m inner join Tae_control_carga_cab c on m.ID_SECUENCIA=c.ID_SECUENCIA where m.ID_SECUENCIA = :1"
	return ExecuteSqlQueryWithTimeout(db, query, []interface{}{id}, 20*time.Second)
}

func GetControlCargaD(db *sql.DB, inputJSON string) (map[string]interface{}, error) {

	// Parsear JSON
	var input map[string]interface{}
	if err := json.Unmarshal([]byte(inputJSON), &input); err != nil {
		return nil, fmt.Errorf("error al parsear el JSON de entrada: %w", err)
	}

	// Extraer parámetros de paginación
	page := intFromJSON(input, "page", 1)
	pageSize := intFromJSON(input, "pageSize", 100)
	offset := (page - 1) * pageSize

	// Consulta paginada
	query := `
		SELECT * FROM (
			SELECT Tae_control_carga_d.*, ROWNUM AS rnum
			FROM Tae_control_carga_d 
			WHERE ROWNUM <= :maxRow
		)
		WHERE rnum > :minRow
	`

	data, err := ExecuteSqlQueryWithTimeout(db, query, []interface{}{offset + pageSize, offset}, 20*time.Second)
	if err != nil {
		return nil, err
	}

	// Consulta total de registros
	var total int
	countQuery := `SELECT COUNT(*) FROM Tae_control_carga_d`
	err = db.QueryRow(countQuery).Scan(&total)
	if err != nil {
		return nil, fmt.Errorf("error obteniendo el total de registros: %w", err)
	}

	// Retornar datos + total
	return map[string]interface{}{
		"data":       data,
		"total":      total,
		"page":       page,
		"pageSize":   pageSize,
		"totalPages": (total + pageSize - 1) / pageSize,
	}, nil

}
func GetControlCargaOp(db *sql.DB, inputJSON string) ([]map[string]interface{}, error) {
	// Paso 1: Intentamos parsear el JSON a un mapa de tipo map[string]interface{}
	var input map[string]interface{}
	err := json.Unmarshal([]byte(inputJSON), &input)
	if err != nil {
		return nil, fmt.Errorf("error al parsear el JSON de entrada: %w", err)
	}

	// Paso 2: Accedemos al valor de 'id' en el mapa
	id, ok := input["id"].(float64) // El valor será de tipo float64 al deserializar el JSON
	if !ok {
		return nil, fmt.Errorf("el campo 'id' no se encontró o no es del tipo correcto")
	}

	// Consulta sin parámetros, devuelve todo
	query := "SELECT * FROM Tae_control_carga_operacion where id_secuencia = :1"
	return ExecuteSqlQueryWithTimeout(db, query, []interface{}{id}, 20*time.Second)
}

func intFromJSON(input map[string]interface{}, key string, defaultValue int) int {
	if val, ok := input[key]; ok {
		if num, ok := val.(float64); ok {
			return int(num)
		}
	}
	return defaultValue
}
