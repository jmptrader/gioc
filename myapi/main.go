package main

import (
	"myapi/database"
	"myapi/routes"
)

func main() {
	database.InitDBs()

	r := routes.SetupRouter()
	r.Run(":8080")
}
