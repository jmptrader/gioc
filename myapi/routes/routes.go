package routes

import (
	"myapi/controllers"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	api := r.Group("/api")
	{
		api.GET("/users", controllers.GetUsers)
		api.POST("/process", controllers.HandleProcessJSON)
	}

	return r
}
