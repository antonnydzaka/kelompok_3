package main

import (
	"net/http"

	"main.go/database"
	"main.go/middleware"
	"main.go/rootes"
)

func main() {
	db := database.Init()
	defer db.Close()

	server := http.NewServeMux()
	rootes.MapRootes(server, db)

	handler := middleware.CORS(server)

	println("Server: http://localhost:8080")
	println("API: GET /api/fruits | POST /api/analyze | GET /api/health")
	println("DB: SQLite (fruits.db) | Set DB_DSN untuk MySQL")
	http.ListenAndServe(":8080", handler)
}
