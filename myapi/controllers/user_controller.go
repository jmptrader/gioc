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
	// Leer el JSON del cuerpo de la petición
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(400, gin.H{"error": "Error leyendo JSON"})
		return
	}
	defer c.Request.Body.Close()                                      // Cerrar el body después de leerlo
	data, err := database.GetControlCarga(database.DB2, string(body)) // o DB2 si usas otra conexión
	if err != nil {
		c.JSON(500, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"success": true,
		"data":    data,
	})
}

func ErrorsBJSON(c *gin.Context) {
	// Leer el JSON del cuerpo de la petición
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(400, gin.H{"error": "Error leyendo JSON"})
		return
	}
	defer c.Request.Body.Close()                                         // Cerrar el body después de leerlo
	data, err := database.GetControlCargaMod(database.DB2, string(body)) // o DB2 si usas otra conexión
	if err != nil {
		c.JSON(500, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"success": true,
		"data":    data,
	})
}

func ErrorsCJSON(c *gin.Context) {
	// Leer el JSON del cuerpo de la petición
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(400, gin.H{"error": "Error leyendo JSON"})
		return
	}
	defer c.Request.Body.Close()                                       // Cerrar el body después de leerlo
	data, err := database.GetControlCargaD(database.DB2, string(body)) // o DB2 si usas otra conexión
	if err != nil {
		c.JSON(500, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"success": true,
		"data":    data,
	})
}

func ErrorsDJSON(c *gin.Context) {
	// Leer el JSON del cuerpo de la petición
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(400, gin.H{"error": "Error leyendo JSON"})
		return
	}
	defer c.Request.Body.Close()                                        // Cerrar el body después de leerlo
	data, err := database.GetControlCargaOp(database.DB2, string(body)) // o DB2 si usas otra conexión
	if err != nil {
		c.JSON(500, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"success": true,
		"data":    data,
	})
}
