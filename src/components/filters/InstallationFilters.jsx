import { labels } from '../../config/resources.js'
import { formFilters } from '../../utils/recordForms.js'

export default function InstallationFilters({ onApply }) {
  return (
    <form className="filters" onSubmit={event => { event.preventDefault(); onApply(formFilters(event.currentTarget)) }}>
      <span className="filter-label">Filtrar por</span>
      {['clienteId', 'imovelId', 'medidorId'].map(key => (
        <input key={key} name={key} type="number" min="1" placeholder={labels[key]} aria-label={labels[key]} />
      ))}
      <select name="ativa" aria-label="Situação">
        <option value="">Todas as situações</option>
        <option value="true">Ativas</option>
        <option value="false">Encerradas</option>
      </select>
      <button className="secondary">Aplicar</button>
    </form>
  )
}
