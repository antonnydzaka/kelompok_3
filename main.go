package main

import (
	"net/http"
	"main.go/database"
	
)

func main() {
	database.Init()

	server := http.NewServeMux()

	http.ListenAndServe(":8080", server)
}
