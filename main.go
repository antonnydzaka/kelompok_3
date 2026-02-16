package main

import (
	"net/http"
	"main.go/database"
	"main.go/rootes"
)

func main() {
	db := database.Init()

	server := http.NewServeMux()

	rootes.MapRootes(server, db)

	http.ListenAndServe(":8080", server)
}
