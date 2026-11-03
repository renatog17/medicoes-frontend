export default function DirectLookup({ invoice = false, busy, onLookup }) {
  function submit(event) {
    event.preventDefault()
    onLookup(new FormData(event.currentTarget).get('id'))
  }

  const label = invoice ? 'ID da fatura' : 'ID do registro'
  return (
    <form className="filters" onSubmit={submit}>
      <span className="filter-label">Consulta direta</span>
      <input name="id" required placeholder={label} aria-label={label} />
      <button className="secondary" disabled={busy}>Consultar ID</button>
    </form>
  )
}
