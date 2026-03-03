package database

import (
	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

func Init() *sql.DB {
	// 1. Connect ke MySQL server tanpa spesifik database untuk membuat database-nya terlebih dahulu
	// Format DSN MySQL: user:password@tcp(host:port)/dbname?parseTime=true
	// Menggunakan root tanpa password (default XAMPP/WAMP)
	serverDsn := "root:@tcp(127.0.0.1:3306)/kelompok3?parseTime=true"
	log.Println("Menghubungkan ke MySQL server untuk inisialisasi...")
	
	serverDb, err := sql.Open("mysql", serverDsn)
	if err != nil {
		log.Fatal("Gagal membuka koneksi ke MySQL server:", err)
	}

	// Tes koneksi ke server MySQL
	if err := serverDb.Ping(); err != nil {
		log.Fatal("Gagal terhubung ke MySQL server! Pastikan MySQL (misal XAMPP) sudah berjalan. Error:", err)
	}

	// 2. Buat database `fruits_db` jika belum ada
	_, err = serverDb.Exec("CREATE DATABASE IF NOT EXISTS fruits_db")
	if err != nil {
		log.Fatal("Gagal membuat database fruits_db:", err)
	}
	
	// Tutup koneksi serverDb karena kita butuh koneksi spesifik ke fruits_db
	serverDb.Close()

	// 3. Menghubungkan ke database `fruits_db`
	log.Println("Database siap, menghubungkan ke fruits_db...")
	dbDsn := "root:@tcp(127.0.0.1:3306)/fruits_db?parseTime=true"
	db, err := sql.Open("mysql", dbDsn)
	if err != nil {
		log.Fatal("Gagal membuka koneksi ke database fruits_db:", err)
	}

	if err := db.Ping(); err != nil {
		log.Fatal("Gagal terhubung ke database fruits_db:", err)
	}

	// 4. Buat tabel jika belum ada
	createTableQuery := `
	CREATE TABLE IF NOT EXISTS fruits (
		id INT AUTO_INCREMENT PRIMARY KEY,
		name VARCHAR(255),
		condition_status VARCHAR(50),
		status VARCHAR(50),
		confidence INT,
		description TEXT,
		image_path VARCHAR(255),
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);`

	_, err = db.Exec(createTableQuery)
	if err != nil {
		log.Fatal("Gagal membuat tabel fruits:", err)
	}

	log.Println("Berhasil terhubung ke MySQL dan inisialisasi tabel fruits selesai.")

	return db
}
