export interface Entry {
  Id:          number;
  Title:       string;
  Link:        string;
  Status:      string;
  Diff:        string;
  Sub:         string;
  Revisit:     boolean;
  SolvedTime:  string;
  Note:        string;
}

export interface FormData {
  title:       string;
  link:        string;
  status:      string;
  diff:        string;
  sub:         string;
  revisit:     boolean;
  solved_time: string;
  note:        string;
}
