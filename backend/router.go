package main

import "net/http"

func (app *app) routes() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/status", app.getStatusHandler)
	mux.HandleFunc("GET /api/difficulty", app.getDifficultiesHandler)
	mux.HandleFunc("GET /api/subject", app.getSubjectsHandler)
	mux.HandleFunc("GET /api/entries", app.getAllPosts)
	mux.HandleFunc("GET /api/entry", app.getEntry)
	mux.HandleFunc("POST /api/entries", app.createEntry)
	mux.HandleFunc("DELETE /api/entries/{id}", app.deleteEntry)
	mux.HandleFunc("PATCH /api/entries/{id}", app.updateEntry)
	return mux
}
