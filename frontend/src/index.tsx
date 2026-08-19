import { useState, useEffect } from 'react'
import ErrorComponent from './error'
import type { Entry } from './types'
import './css/index.css'

export function formatDate(timestamp: string): string {
  const datime = new Date(timestamp)
  const year = datime.getFullYear();
  const month = String(datime.getMonth() + 1).padStart(2, "0");
  const day = String(datime.getDate()).padStart(2, "0");
  const hour = String(datime.getHours()).padStart(2, "0");
  const minutes = String(datime.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hour}:${minutes}`;
}

function EntryCard() {
  const [entries, setEntries] = useState<Entry[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch("/api/entries")
        if (!resp.ok) {
          const error: { error: string } = await resp.json()
          setError(error.error)
          return
        } else {
          setError(null);
        }
        const data: Entry[] = await resp.json()
        setEntries(data)
      } catch (err) {
        setError("Unable to connect to server")
      } finally {
        setLoading(false)
      }
    })();
  }, [])

  if (error) {
    return (
      <ErrorComponent error={error} />
    )
  }
  if (!entries && loading) {
    return (
      <p>Loading...</p>
    )
  }
  if (entries.length == 0) {
    return (
      <p>No entries yet.<a href="#/add">Add an entry.</a></p>
    )
  }

  async function handleDelete(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const ok = confirm("Are you sure you want to delete this entry?");
    if (!ok) return;
    const data = new FormData(event.currentTarget);
    const body = {
      id: data.get("id")
    }
    const deleteResponse = await fetch(`/api/entries/${body.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!deleteResponse.ok) {
      const error: { error: string } = await deleteResponse.json();
      alert(`Error: ${error.error}`);
    }
    window.location.reload();
  }


  return (
    <div className="entries">
      {entries.map(d => (
        <div className="entry-wrapper" key={ d.Id }>
          <div className="entry-header">
            <h1 className="entry-title">{ d.Title }</h1>
            <span className="entry-date">{` ${d.SolvedTime != "" ? "Solved at: " + formatDate(d.SolvedTime) : ""}`}</span>
          </div>
          <div className="entry-info">
            <span className="entry-status" data-status={ d.Status }>{ d.Status }</span>
            <span className="entry-sub">{ d.Sub.replaceAll("_", " ") }</span>
            <span className="entry-difficulty" data-difficulty={d.Diff}>{ d.Diff }</span>
            {d.Revisit && <span className="entry-revisit">re-visit</span>}
          </div>
          <details className="entry-data">
            <summary className="entry-more">more</summary>
            <div className="entry-data">
              <a href={d.Link}>
                <input type="link" className="entry-link hyperlink" value={ d.Link } readOnly />
              </a>
              <div className="entry-note">
                { d.Note }
              </div>
              <div className="entry-actions">
                <a className="entry-action-edit" href={`#/edit/${d.Id}`}>Edit</a>
                <form onSubmit={ e => { handleDelete(e) }}>
                  <input type="hidden" value={ d.Id } name="id" />
                  <button className="entry-action-delete">Delete</button>
                </form>
              </div>
            </div>
          </details>
        </div>
      ))}
    </div>
  )
}

function SearchAndFilter() {
  return (
    <div className="search-filter-bar">
      <input type="text" placeholder="search..." />
      <button>Search</button>
    </div>
  )
}

export function IndexPage() {
  return (
    <EntryCard />
  )
}
