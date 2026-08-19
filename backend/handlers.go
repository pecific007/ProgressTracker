package main

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
)

type RequestBody struct {
	Title      string `json:"title"`
	Link       string `json:"link"`
	Status     string `json:"status"`
	Diff       string `json:"diff"`
	Sub        string `json:"sub"`
	Revisit    bool   `json:"revisit"`
	SolvedTime string `json:"solved_time"`
	Note       string `json:"note"`
}

func (r *RequestBody) Validate() error {
	if r.Title == "" {
		return errors.New("missing data: title")
	}
	if r.Link == "" {
		return errors.New("missing data: link")
	}
	if r.Status == "" {
		return errors.New("missing data: status")
	}
	if r.Sub == "" {
		return errors.New("missing data: subject")
	}
	if r.Diff == "" {
		return errors.New("missing data: difficulty")
	}

	if !isValidStatus(r.Status) {
		return errors.New("invlid data: status")
	}
	if !isValidDifficulty(r.Diff) {
		return errors.New("invlid data: difficulty")
	}
	if !isValidSubject(r.Sub) {
		return errors.New("invlid data: subject")
	}
	return nil
}

func (a *app) getStatusHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(AllStatus)
}

func (a *app) getDifficultiesHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(AllDifficulties)
}

func (a *app) getSubjectsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(AllSubjects)
}

func (a *app) getEntry(w http.ResponseWriter, r *http.Request) {
	params := r.URL.Query()
	id, err := strconv.Atoi(params.Get("id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid entry id")
		return
	}
	entry, err := a.entries.SelectEntry(id)
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid entry id")
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(entry)
}

func (a *app) getAllPosts(w http.ResponseWriter, r *http.Request) {
	entries, err := a.entries.All()
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(entries)
}

func writeError(w http.ResponseWriter, status int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]string{
		"error": message,
	})
}

func writeJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func (a *app) updateEntry(w http.ResponseWriter, r *http.Request) {
	var reqBody RequestBody
	if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
		writeError(w, http.StatusBadRequest, "bad request")
		return
	}
	if err := reqBody.Validate(); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	id_str := r.PathValue("id")
	id, err := strconv.Atoi(id_str)
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid data: id")
		return
	}
	if err := a.entries.UpdateEntry(id, reqBody.Title,
		reqBody.Link, reqBody.Status, reqBody.Diff,
		reqBody.Sub, reqBody.SolvedTime, reqBody.Note, reqBody.Revisit); err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{
		"status": "ok",
	})
}

func (a *app) deleteEntry(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusInternalServerError, "invalid data: id")
		return
	}
	if err := a.entries.DeleteEntry(id); err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}
	// Status 204 is used for when something is deleted and no additional information is returned
	writeJSON(w, 204, "ok")
}

func (a *app) createEntry(w http.ResponseWriter, r *http.Request) {
	var reqBody RequestBody
	if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
		writeError(w, http.StatusBadRequest, "bad request")
		return
	}

	if err := reqBody.Validate(); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	if err := a.entries.Insert(reqBody.Title,
		reqBody.Link, reqBody.Status, reqBody.Diff,
		reqBody.Sub, reqBody.SolvedTime, reqBody.Note, reqBody.Revisit); err != nil {
		writeError(w, http.StatusInternalServerError, "internal server error")
		return
	}
	writeJSON(w, http.StatusCreated, map[string]string{
		"status": "ok",
	})
}
