package sqlite

import (
	"database/sql"

	"gitlab.com/pecific007/progress-tracker/internal/models"
)

type EntriesModel struct {
	DB *sql.DB
}

func (m *EntriesModel) Insert(title, link, status, diff, sub, solved_time, note string, revisit bool) error {
	stmt := "INSERT INTO entries(title, link, status, diff, sub, revisit, solved_time, note) VALUES (?,?,?,?,?,?,?,?)"
	_, err := m.DB.Exec(stmt, title, link, status, diff, sub, revisit, solved_time, note)
	return err
}

func (m *EntriesModel) SelectEntry(id int) ([]models.Entry, error) {
	stmt := "SELECT id, title, link, status, diff, sub, revisit, solved_time, note FROM entries WHERE id = ?"
	rows, err := m.DB.Query(stmt, id)
	if err != nil {
		return nil, err
	}
	entries := []models.Entry{}
	for rows.Next() {
		e := models.Entry{}
		if err := rows.Scan(&e.Id, &e.Title, &e.Link,
			&e.Status, &e.Diff, &e.Sub, &e.Revisit,
			&e.SolvedTime, &e.Note); err != nil {
			return nil, err
		}
		entries = append(entries, e)
	}
	return entries, nil
}

func (m *EntriesModel) DeleteEntry(id int) error {
	stmt := "DELETE FROM entries WHERE id = ?"
	_, err := m.DB.Exec(stmt, id)
	return err
}

func (m *EntriesModel) UpdateEntry(id int, title, link, status, diff, sub, solved_time, note string, revisit bool) error {
	stmt := "UPDATE entries SET title=?, link=?, status=?, diff=?, sub=?, revisit=?, solved_time=?, note=? WHERE id = ?"
	_, err := m.DB.Exec(stmt, title, link, status, diff, sub, revisit, solved_time, note, id)
	return err
}

func (m *EntriesModel) All() ([]models.Entry, error) {
	stmt := "SELECT id, title, link, status, diff, sub, revisit, solved_time, note FROM entries ORDER BY id DESC"
	rows, err := m.DB.Query(stmt)
	if err != nil {
		return nil, err
	}
	entries := []models.Entry{}
	for rows.Next() {
		e := models.Entry{}
		if err := rows.Scan(&e.Id, &e.Title, &e.Link,
			&e.Status, &e.Diff, &e.Sub, &e.Revisit,
			&e.SolvedTime, &e.Note); err != nil {
			return nil, err
		}
		entries = append(entries, e)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}
	return entries, nil
}
