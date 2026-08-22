import { useState } from "react"
import { LoadingComponent } from "./App"
import ErrorComponent from "./error"
import type { Entry, Tags, FormProps } from "./types"

export function EntryForm(props: FormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<Tags>({
    status: [],
    subject: [],
    difficulty: [],
  });
  const [form, setForm] = useState<Entry>({
    Id: 0,
    Title: '',
    Link: '',
    Status: 'solved',
    Diff: '',
    Sub: 'unknown',
    Revisit: false,
    SolvedTime: '',
    Note: '',
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
    if (props.data) {
      setForm(props.data)
    }
    setLoading(false);
  }

  if (error) {
    return (
      <ErrorComponent error={error} />
    )
  }

  if (loading) {
    loadData();
    <LoadingComponent />
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    const finalValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setForm(prev => ({ ...prev, [name]: finalValue }));
    console.log("final", finalValue, "form", form)
    // if (type == "checkbox" || type == "radio") {
    //   setForm(prev => ({ ...prev, [name]: finalValue }));
    // }
  }

  async function handleFormSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const reqBody = {
      title: form.Title,
      link: form.Link,
      status: form.Status,
      diff: form.Diff,
      sub: form.Sub,
      revisit: form.Revisit,
      solved_time: form.Status === "pending" ? form.SolvedTime : new Date().toISOString(),
      note: form.Note
    }

    console.log(props.data);
    const resp = await fetch(`/api/entries${(props.data ? '/'+  form.Id : '')}`, {
      method: props.method,
      headers: { "Content-Type": "text/json" },
      body: JSON.stringify(reqBody)
    })
    if (!resp.ok) {
      const error: { error: string } = await resp.json();
      setError(error.error);
      return;
    }
    setError(null);
    window.location.hash = ""
  }

  return (
    <form className="form" onSubmit={handleFormSubmit}>
      <div className="input-wrapper">
        <label htmlFor="title" className="form-label">Title</label>
        <input className="input" id="title" name="Title"
        type="text" placeholder="Title" autoFocus
        autoComplete="off" defaultValue={form.Title}
        onChange={handleInput} required />
      </div>

      <div className="input-wrapper">
        <label htmlFor="link" className="form-label">Link</label>
        <input className="input" id="link" name="Link" type="url"
        placeholder="https://example.com" autoComplete="off"
        defaultValue={form.Link} onChange={handleInput} required />
      </div>

      <div className="input-wrapper">
          <label htmlFor="status" className="form-label">Status</label>
          <select className="input" id="status" name="Status" defaultValue={form.Status} onChange={handleInput} required>
            {tags.status.map(s => (
              <option key={ s } value={ s }>{ s.replaceAll("_", " ") }</option>
            ))}
          </select>
      </div>

      <div className="input-wrapper">
          <label htmlFor="subject" className="form-label">Subject</label>
          <select className="input" id="subject" name="Sub" defaultValue={form.Sub} onChange={handleInput} required>
            {tags.subject.map(s => (
              <option key={ s } value={ s }>{ s.replaceAll("_", " ") }</option>
            ))}
          </select>
      </div>

      <fieldset className="input-wrapper">
        <legend className="form-label">Difficulty</legend>
        {tags.difficulty.map(d => (
          <label key={d} htmlFor={`difficulty-${d}`} className="radio-input-container">
            <input className="input" id={`difficulty-${d}`} type="radio"
            name="Diff" value={d} checked={form.Diff === d}
            onChange={handleInput} required />
            <span className="form-check-label">{d}</span>
          </label>
        ))}
      </fieldset>

      <div className="form-check input-wrapper">
        <input className="input" id="revisit" type="checkbox"
        name="Revisit" checked={form.Revisit}
        onChange={handleInput} />
        <label className="form-check-label" htmlFor="revisit">Revisit</label>
      </div>

      <div className="input-wrapper">
        <textarea
          className="input"
          style={{ fontFamily: "monospace" }}
          id="note"
          name="Note"
          placeholder="Add a note..."
          defaultValue={form.Note}
          onChange={handleInput}
        ></textarea>
      </div>

      <button type="submit" className="button">
        {props.button}
      </button>
    </form>
  )
}
