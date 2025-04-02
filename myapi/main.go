package main

import (
	"myapi/database"
	"myapi/routes"
)

func main() {
	database.Connect()

	r := routes.SetupRouter()
	r.Run(":8080")
}
