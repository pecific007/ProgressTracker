
import { EntryForm } from "./formComps";
import './css/add.css'

export function AddPage() {
    return (
      <EntryForm method="POST" button='Add' />
    )
}
