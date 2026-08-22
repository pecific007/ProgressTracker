import ErrorComponent from "./error";
import type { Entry } from "./types";
import { useState } from 'react'
import { EntryForm } from "./formComps";

export function EditPage(id: { id: string }) {
  const [data, setData] = useState<Entry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  async function loadData() {
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

  return (
      <EntryForm method="PATCH" button='Save' data={data} />
  )
}
