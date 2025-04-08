package controllers

import (
	"fmt"
	"io"
	"myapi/database"
	"myapi/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Obtener usuarios
func GetUsers(c *gin.Context) {
	// Definir un mensaje de ejemplo
	message := models.Message{
		Name:    "Go",
		Content: "Este es un mensaje de prueba en una petición GET.",
	}

	// Responder con JSON
	c.JSON(http.StatusOK, message)
}

// HandleProcessJSON procesa una solicitud JSON con Gin
func HandleProcessJSON(c *gin.Context) {
	// Leer el JSON del cuerpo de la petición
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(400, gin.H{"error": "Error leyendo JSON"})
		return
	}
	defer c.Request.Body.Close() // Cerrar el body después de leerlo

	// Llamar al procedimiento almacenado en Oracle
	result, err := database.CallProcessJSON(string(body))
	if err != nil {
		c.JSON(500, gin.H{"error": fmt.Sprintf("Error en Oracle: %v", err)})
		return
	}

	// Responder con el JSON generado
	c.Data(200, "application/json", []byte(result))
}

func ErrorsAJSON(c *gin.Context) {
	horaFinalizado1 := "10:15"
	var registros = []models.MessageA{
		{
			ID:             1,
			Secuencia:      "A001",
			FechaCarga:     "2025-04-08",
			Modulo:         "Ventas",
			Iniciado:       true,
			Finalizado:     true,
			Error:          false,
			HoraIniciado:   "10:00",
			HoraFinalizado: &horaFinalizado1,
			Reproceso:      false,
			Mensaje:        "Proceso exitoso",
		},
		{
			ID:             2,
			Secuencia:      "A002",
			FechaCarga:     "2025-04-08",
			Modulo:         "Inventario",
			Iniciado:       true,
			Finalizado:     false,
			Error:          true,
			HoraIniciado:   "11:00",
			HoraFinalizado: nil,
			Reproceso:      true,
			Mensaje:        "Error en carga",
		},
	}

	c.JSON(http.StatusOK, registros)
}

func ErrorsBJSON(c *gin.Context) {
	transacciones := []models.MessageB{
		{
			ID:                101,
			Secuencia:         "A001",
			Modulo:            "Ventas",
			NombreProducto:    "Producto A",
			NombreTransaccion: "Carga Inicial",
			NroRegistros:      120,
			Error:             false,
		},
		{
			ID:                102,
			Secuencia:         "A001",
			Modulo:            "Ventas",
			NombreProducto:    "Producto B",
			NombreTransaccion: "Reproceso",
			NroRegistros:      80,
			Error:             true,
		},
		{
			ID:                103,
			Secuencia:         "A002",
			Modulo:            "Inventario",
			NombreProducto:    "Producto C",
			NombreTransaccion: "Carga Manual",
			NroRegistros:      45,
			Error:             false,
		},
		{
			ID:                104,
			Secuencia:         "A002",
			Modulo:            "Inventario",
			NombreProducto:    "Producto D",
			NombreTransaccion: "Carga Programada",
			NroRegistros:      95,
			Error:             true,
		},
	}

	c.JSON(http.StatusOK, transacciones)
}

func ErrorsCJSON(c *gin.Context) {
	movimientos := []models.MessageC{
		{
			ID:               201,
			Secuencia:        "A001",
			Modulo:           "Ventas",
			NombreMovimiento: "Ajuste Precio",
			AccountNumber:    "123-456-789",
			Error:            false,
			Consistencia:     true,
			Mensaje:          "Movimiento aplicado correctamente",
		},
		{
			ID:               202,
			Secuencia:        "A001",
			Modulo:           "Ventas",
			NombreMovimiento: "Reverso Descuento",
			AccountNumber:    "321-654-987",
			Error:            true,
			Consistencia:     false,
			Mensaje:          "Error en la validación del movimiento",
		},
		{
			ID:               203,
			Secuencia:        "A002",
			Modulo:           "Inventario",
			NombreMovimiento: "Transferencia Stock",
			AccountNumber:    "555-111-222",
			Error:            false,
			Consistencia:     true,
			Mensaje:          "Operación completada",
		},
		{
			ID:               204,
			Secuencia:        "A002",
			Modulo:           "Inventario",
			NombreMovimiento: "Ajuste Inventario",
			AccountNumber:    "888-333-444",
			Error:            true,
			Consistencia:     false,
			Mensaje:          "Inconsistencias detectadas",
		},
	}

	c.JSON(http.StatusOK, movimientos)
}
