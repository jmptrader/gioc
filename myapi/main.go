package main

import (
	"myapi/database"
	"myapi/routes"
)

func main() {
	database.InitDB()

	r := routes.SetupRouter()
	r.Run(":8080")
}
