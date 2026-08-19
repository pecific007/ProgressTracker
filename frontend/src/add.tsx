import { useState } from 'react'
import ErrorComponent from './error'
import type { FormData } from './types'
import './css/add.css'


function CreateEntryForm() {
  const [status, setStatus] = useState<string[] | null>(null)
  const [difficulty, setDifficulty] = useState<string[] | null>(null)
  const [subject, setSubject] = useState<string[] | null>(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null)

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

  const loadData = async () => {
    const statusResp = await fetch("/api/status")
    if (!statusResp.ok) {
      setError("internal server error")
    } else {
      setError(null);
    }
    const status = await statusResp.json()
    setStatus(status)
    const diffResp = await fetch("/api/difficulty")
    if (!diffResp.ok) {
      setError("internal server error")
    } else {
      setError(null);
    }
    const difficulty = await diffResp.json()
    setDifficulty(difficulty)
    const subResp = await fetch("/api/subject")
    if (!subResp.ok) {
      setError("internal server error")
    } else {
      setError(null);
    }
    const subject = await subResp.json()
    setSubject(subject)
    setLoading(false);
  };

  async function handleFormSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = {
      title: data.get('title'),
      link: data.get('link'),
      status: data.get('status'),
      diff: data.get('diff'),
      sub: data.get('sub'),
      revisit: data.get('revisit') === "on",
      solved_time: data.get("status") === "pending" ? data.get('solved_time') : new Date().toISOString(),
      note: data.get('note'),
    }
    fetch('/api/entries', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    })
    window.location.hash = "#/"
  }

  function handleInput(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = event.target
    const finalValue = type === 'checkbox' ? (event.target as HTMLInputElement).checked : value;
    setForm(prev => ({ ...prev, [name]: finalValue }));
  }

  if (error) {
    return (
      <ErrorComponent error={error} code={500} />
    )
  }

  if (!status || !difficulty || !subject && loading) {
    loadData();
    return (
      <p>Loading...</p>
    )
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
                  onChange={handleInput}
                  required
                  />
          </div>

          <div className="input-wrapper">
              <label htmlFor="status" className="form-label">Status</label>
              <select className="input" id="status" name="status" onChange={handleInput} required>
                {status.map(s => (
                  <option key={ s } value={ s }>{ s }</option>
                ))}
              </select>
          </div>

          <div className="input-wrapper">
              <label htmlFor="subject" className="form-label">Subject</label>
              <select className="input" id="subject" name="sub" onChange={handleInput} required>
                {subject.map(s => (
                  <option key={ s } value={ s }>{ s.replaceAll("_", " ") }</option>
                ))}
              </select>
          </div>

          <fieldset className="input-wrapper">
              <legend className="form-label">Difficulty</legend>

              {difficulty.map(d => (
                  <label key={d} htmlFor={`difficulty-${d}`} className="radio-input-container">
                      <input
                          className="input"
                          id={`difficulty-${d}`}
                          type="radio"
                          name="diff"
                          value={ d }
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
                  name="revisit"
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
                  onChange={handleInput}
              ></textarea>
          </div>

          <button type="submit" className="button">
              Add
          </button>
      </form>
  )
}

export function AddPage() {
    return (
        <CreateEntryForm />
    )
}
