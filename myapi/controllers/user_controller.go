package controllers

import (
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
