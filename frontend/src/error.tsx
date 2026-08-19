export default function ErrorComponent(error: { error: string, code?: number }) {
  return (
    <div className="error">
      <h1>Error: { error.code ? error.code: '' }</h1>
      <p>{error.error}. <a href="/">Back home.</a></p>
    </div>
  )
}
