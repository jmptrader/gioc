package database

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/godror/godror"
)

var DB *sql.DB

// Conectar a Oracle
func InitDB() {
	var err error
	dsn := "SAR/reportes@(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=45.33.0.230)(PORT=1521))(CONNECT_DATA=(SID=ORCL)))"
	DB, err = sql.Open("godror", dsn)
	if err != nil {
		log.Fatal("Error conectando a Oracle:", err)
	}

	err = DB.Ping()
	if err != nil {
		log.Fatal("Error en el ping a Oracle:", err)
	}
}

// CallProcessJSON ejecuta el procedimiento almacenado en Oracle
func CallProcessJSON(inputJSON string) (string, error) {
	var outputJSON string

	// Contexto con timeout para evitar bloqueos
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Ejecutar el procedimiento almacenado
	_, err := DB.ExecContext(ctx, "BEGIN SAR_WEBAPP.MONITOR_INTERFASES_ENTRADA(:1, :2); END;",
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
