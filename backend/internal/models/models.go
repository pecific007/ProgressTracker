package models

type Entry struct {
	Id         int
	Title      string
	Link       string
	Status     string
	Diff       string
	Sub        string
	Revisit    bool
	SolvedTime string
	Note       string
}
