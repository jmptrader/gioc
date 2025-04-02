package database

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/godror/godror"
)

var DB *sql.DB

func Connect() {
	// Configura la cadena de conexión
	dsn := "TAE/Reporte1@(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=45.33.0.230)(PORT=1521))(CONNECT_DATA=(SID=ORCL)))"

	// Abre la conexión
	db, err := sql.Open("godror", dsn)
	if err != nil {
		log.Fatal("Error al conectar a Oracle:", err)
	}

	// Verifica la conexión
	err = db.Ping()
	if err != nil {
		log.Fatal("No se pudo conectar a Oracle:", err)
	}

	fmt.Println("Conectado exitosamente a Oracle")
	DB = db
}
