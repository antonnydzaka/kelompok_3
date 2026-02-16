package database

import (
	"database/sql"

	_ "github.com/go-sql-driver/mysql"
)

func Init() *sql.DB {
	dns := "root@tcp(localhost:3306)/kelompok3"
	db, err := sql.Open("mysql", dns)
	if err != nil {
		panic(err)
	}
	err = db.Ping()
	if err != nil {
		panic(err)
	}
	return db
}
