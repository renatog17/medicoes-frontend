import { formFilters } from '../../utils/recordForms.js'

export default function InvoiceFilters({ filters, onApply }) {
  function clear(event) {
    event.currentTarget.form.reset()
    onApply({})
  }

  return (
    <form className="filters" onSubmit={event => { event.preventDefault(); onApply(formFilters(event.currentTarget)) }}>
      <label className="filter-label" htmlFor="invoice-competence">Competência</label>
      <input id="invoice-competence" name="competencia" type="text" placeholder="Competência" />
      <button className="secondary">Aplicar filtro</button>
      {Object.keys(filters).length > 0 && (
        <button type="button" className="secondary" onClick={clear}>Limpar filtro</button>
      )}
    </form>
  )
}
