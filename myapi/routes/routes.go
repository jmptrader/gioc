package routes

import (
	"myapi/controllers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// Configuración de CORS
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{"http://localhost:3000", "http://frontend", "http://localhost:5173"} // Asegúrate de incluir el origen de tu frontend
	corsConfig.AllowMethods = []string{"GET", "POST", "OPTIONS"}                                            // Métodos permitidos
	corsConfig.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}                           // Cabeceras permitidas
	corsConfig.AllowCredentials = true                                                                      // Permite credenciales si es necesario (cookies, autenticación)

	// Aplicar el middleware CORS
	r.Use(cors.New(corsConfig))

	api := r.Group("/api")
	{
		api.GET("/users", controllers.GetUsers)
		api.POST("/process", controllers.HandleProcessJSON)
		api.POST("/errorsA", controllers.ErrorsAJSON)
		api.POST("/errorsB", controllers.ErrorsBJSON)
		api.POST("/errorsC", controllers.ErrorsCJSON)
	}

	return r
}
