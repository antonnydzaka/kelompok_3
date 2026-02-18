package database

import (
	"database/sql"
	"os"

	_ "github.com/go-sql-driver/mysql"
	_ "modernc.org/sqlite"	
)

func Init() *sql.DB {
	// Cek env - kalau DB_DSN di-set (MySQL), pakai itu. Kalau tidak, pakai SQLite (tanpa install apa pun)
	dsn := os.Getenv("DB_DSN")
	if dsn != "" {
		db, err := sql.Open("mysql", dsn)
		if err == nil && db.Ping() == nil {
			initMySQL(db)
			return db
		}
	}

	// Default: SQLite - file lokal, tidak perlu MySQL
	dbPath := "fruits.db"
	db, err := sql.Open("sqlite", dbPath)
	if err != nil {
		panic(err)
	}
	if err := db.Ping(); err != nil {
		panic(err)
	}
	db.SetMaxOpenConns(1) // SQLite single-writer
	initSQLite(db)
	return db
}

func initMySQL(db *sql.DB) {
	q := `CREATE TABLE IF NOT EXISTS fruits (
		id INT AUTO_INCREMENT PRIMARY KEY,
		name VARCHAR(100) NOT NULL,
		condition_status VARCHAR(50) NOT NULL,
		status VARCHAR(50) NOT NULL,
		confidence INT NOT NULL,
		description TEXT,
		image_path VARCHAR(500),
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)`
	db.Exec(q)
}

func initSQLite(db *sql.DB) {
	q := `CREATE TABLE IF NOT EXISTS fruits (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name VARCHAR(100) NOT NULL,
		condition_status VARCHAR(50) NOT NULL,
		status VARCHAR(50) NOT NULL,
		confidence INTEGER NOT NULL,
		description TEXT,
		image_path VARCHAR(500),
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	)`
	db.Exec(q)
}
