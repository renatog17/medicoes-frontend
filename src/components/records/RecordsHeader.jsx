import { resources } from '../../config/resources.js'

export default function RecordsHeader({ resource, total, loading, error, filtered, onCreate }) {
  const config = resources[resource]
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">GERENCIAMENTO</p>
          <h1>{config.title}</h1>
          <p>{config.description}</p>
        </div>
        {!config.readOnly && <button className="primary" onClick={onCreate}>＋ Cadastrar {config.singular}</button>}
      </div>
      <div className="overview">
        <div className="overview-icon">{config.icon}</div>
        <div>
          <span>Total de {config.title.toLowerCase()}{filtered ? ' no filtro' : ''}</span>
          <strong>{loading || error ? "—" : total}</strong>
        </div>
        <p>Dados consultados<br />diretamente na API</p>
      </div>
    </>
  )
}
