package rootes

import (
	"database/sql"
	"net/http"

	"main.go/controll"
)

func MapRootes(server *http.ServeMux, db *sql.DB) {
	server.HandleFunc("/home",controll.Home)
	server.HandleFunc("/home/addfood",controll.Add)

}
