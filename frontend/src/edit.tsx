import ErrorComponent from "./error";
import type { Entry } from "./types";
import { useState } from 'react'
import { type FormData } from "./types";

type Tags = {
  status: string[];
  subject: string[];
  difficulty: string[];
}

export function EditPage(id: { id: string }) {
  const [data, setData] = useState<Entry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState<Tags>({
    status: [],
    subject: [],
    difficulty: [],
  });
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormData>({
    title: '',
    link: '',
    status: '',
    diff: '',
    sub: '',
    revisit: false,
    solved_time: '',
    note: '',
  })

  async function loadData() {
    // Getting the stuff:
    const statusResp = await fetch("/api/status")
    if (!statusResp.ok) {
      const error: { error: string } = await statusResp.json();
      setError(error.error);
      return;
    }
    const statusJSON = await statusResp.json();
    const difficultyResp = await fetch('/api/difficulty')
    if (!difficultyResp.ok) {
      const error: { error: string } = await difficultyResp.json();
      setError(error.error);
      return;
    }
    const difficultyJSON = await difficultyResp.json();
    const subjectResp = await fetch('/api/subject')
    if (!subjectResp.ok) {
      const error: { error: string } = await subjectResp.json();
      setError(error.error);
      return;
    }
    setError(null);
    const subjectJSON = await subjectResp.json();
    setTags({
      status: statusJSON,
      difficulty: difficultyJSON,
      subject: subjectJSON,
    });
    // Getting the entry data
    const entryResp = await fetch(`/api/entry?id=${id.id}`)
    if (!entryResp.ok) {
      const error: { error: string } = await entryResp.json();
      setError(error.error);
      return;
    }
    const entryJSON = await entryResp.json();
    setData(entryJSON[0])
    setLoading(false);
  }

  if (error) {
    return (
      <ErrorComponent error={error} />
    )
  }

  if (loading) {
    loadData();
    return (
      <p>Loading...</p>
    )
  }

  async function handleFormSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const ndata = new FormData(e.currentTarget);
    const reqBody = {
      title: ndata.get('title'),
      link: ndata.get('link'),
      status: ndata.get('status'),
      diff: ndata.get('Diff'),
      sub: ndata.get('sub'),
      revisit: ndata.get('Revisit') === "on",
      solved_time: ndata.get('status') === "pending" ? ndata.get("solved_time") : new Date().toISOString(),
      note: ndata.get('note'),
    }

    const resp = await fetch(`/api/entries/${ data.Id }`, {
      method: "PATCH",
      headers: { "Content-Type": "text/json" },
      body: JSON.stringify({id: data.Id, ...reqBody})
    })
    if (!resp.ok) {
      const error: { error: string } = await resp.json();
      setError(error.error);
    }
    setError(null);
    window.location.hash = ""
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    const finalValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setForm(prev => ({ ...prev, [name]: finalValue }));
    if (type == "checkbox" || type == "radio") {
      setData(prev => ({ ...prev, [name]: finalValue }));
    }
  }

  return (
      <form className="form" onSubmit={handleFormSubmit}>
          <div className="input-wrapper">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                  className="input"
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Title"
                  autoFocus
                  autoComplete="off"
                  defaultValue={data.Title}
                  onChange={handleInput}
                  required
                  />
          </div>

          <div className="input-wrapper">
              <label htmlFor="link" className="form-label">Link</label>
              <input
                  className="input"
                  id="link"
                  name="link"
                  type="url"
                  placeholder="https://example.com"
                  autoComplete="off"
                  defaultValue={data.Link}
                  onChange={handleInput}
                  required
                  />
          </div>

          <div className="input-wrapper">
              <label htmlFor="status" className="form-label">Status</label>
              <select className="input" id="status" name="status" defaultValue={ data.Status } onChange={handleInput} required>
                {tags.status.map(s => (
                  <option key={ s } value={ s }>{ s }</option>
                ))}
              </select>
          </div>

          <div className="input-wrapper">
              <label htmlFor="subject" className="form-label">Subject</label>
              <select className="input" id="subject" name="sub" defaultValue={ data.Sub } onChange={handleInput} required>
                {tags.subject.map(s => (
                  <option key={ s } value={ s }>{ s.replaceAll("_", " ") }</option>
                ))}
              </select>
          </div>

          <fieldset className="input-wrapper">
              <legend className="form-label">Difficulty</legend>

              {tags.difficulty.map(d => (
                  <label key={d} htmlFor={`difficulty-${d}`} className="radio-input-container">
                      <input
                          className="input"
                          id={`difficulty-${d}`}
                          type="radio"
                          name="Diff"
                          value={ d }
                          checked={ data.Diff === d }
                          onChange={handleInput}
                          required
                          />
                      <span className="form-check-label">
                          { d }
                      </span>
                  </label>
                  ))}
          </fieldset>

          <div className="form-check input-wrapper">
              <input
                  className="input"
                  id="revisit"
                  type="checkbox"
                  name="Revisit"
                  checked={ data.Revisit }
                  onChange={handleInput}
                  />
              <label className="form-check-label" htmlFor="revisit">
                  Revisit
              </label>
          </div>

      <div className="input-wrapper">
              <textarea
                  className="input"
                  style={{ fontFamily: "monospace" }}
                  id="note"
                  name="note"
                  placeholder="Add a note..."
                  defaultValue={ data.Note }
                  onChange={handleInput}
              ></textarea>
          </div>

          <button type="submit" className="button">
              Save
          </button>
      </form>
  )
}
