package main

import (
	"database/sql"
	"log"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
	"gitlab.com/pecific007/progress-tracker/internal/sqlite"
)

type app struct {
	entries *sqlite.EntriesModel
}

func main() {
	db, err := sql.Open("sqlite3", "./app.db")
	if err != nil {
		log.Fatal(err)
	}

	app := app{
		entries: &sqlite.EntriesModel{
			DB: db,
		},
	}

	srv := http.Server{
		Addr:    ":8080",
		Handler: app.routes(),
	}
	log.Println("Listening on :8080")
	log.Fatal(srv.ListenAndServe())
}
