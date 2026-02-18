package rootes

import (
	"database/sql"
	"net/http"
	"path/filepath"

	"main.go/controll"
)

func MapRootes(server *http.ServeMux, db *sql.DB) {
	// REST API
	server.HandleFunc("/api/fruits", controll.GetFruitsHandler(db))
	server.HandleFunc("/api/analyze", controll.AnalyzeFruitHandler(db))
	server.HandleFunc("/api/health", controll.HealthHandler)

	// Serve uploaded images
	uploadsPath, _ := filepath.Abs("uploads")
	server.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir(uploadsPath))))

	// Legacy routes (redirect to SPA if needed)
	server.HandleFunc("/home", controll.Home)
	server.HandleFunc("/home/addfood", controll.Add)
}
