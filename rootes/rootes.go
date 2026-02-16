package rootes

import (
	"database/sql"
	"net/http"
	"main.go/help"
)

func MapRootes(server *http.ServeMux, db *sql.DB) {
	server.HandleFunc("/", help.NewHelloWord())
}
