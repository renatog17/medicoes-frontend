import { recordColumns } from '../../config/resources.js'
import { formatValue } from '../../utils/formatters.js'
import { installationRelationInfo } from '../../utils/installationRelations.js'

function RecordCell({ resource, row, field }) {
  if (resource === 'instalacoes' && ['clienteId', 'imovelId', 'medidorId'].includes(field)) {
    const info = installationRelationInfo(row, field)
    const id = row[field] ?? row[field.replace('Id', '')]?.id
    return (
      <div className="installation-relation">
        <span>{info || 'Dados indisponíveis'}</span>
        {id != null && <small>ID #{id}</small>}
      </div>
    )
  }
  if (resource === 'imoveis') return formatValue(row.endereco?.[field])
  if (field === 'status') {
    const active = row.dataFim == null
    return <span className={'badge ' + (active ? 'on' : '')}>{active ? 'Ativa' : 'Encerrada'}</span>
  }
  if (field === 'dataInicio') return row[field] ? new Date(row[field]).toLocaleString('pt-BR') : "—"
  const value = row[field] ?? row[field.replace('Id', '')]?.id
  if (resource === 'faturas' && value && typeof value === 'object') return JSON.stringify(value)
  return formatValue(value)
}

function RowActions({ resource, record, busy, onInspect, onDelete }) {
  if (resource === 'instalacoes') {
    return (
      <>
        <button disabled={busy} onClick={() => onInspect(record.id)}>Ver / Medições</button>
        {record.dataFim == null && <button disabled={busy} onClick={() => onInspect(record.id, 'close')}>Encerrar</button>}
      </>
    )
  }
  if (resource === 'faturas') {
    return <button disabled={busy} onClick={() => onInspect(record.id)}>Ver fatura</button>
  }
  return (
    <>
      <button disabled={busy} onClick={() => onInspect(record.id)}>Ver</button>
      <button disabled={busy} onClick={() => onInspect(record.id, 'edit')}>Editar</button>
      <button className="danger-text" disabled={busy} onClick={() => onDelete(record)}>Excluir</button>
    </>
  )
}

export default function RecordsTable({ resource, rows, busy, onInspect, onDelete }) {
  const columns = recordColumns(resource, rows)
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            {columns.map(([key, label]) => <th key={key}>{label}</th>)}
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id}>
              <td className="id">#{row.id}</td>
              {columns.map(([key]) => <td key={key}><RecordCell resource={resource} row={row} field={key} /></td>)}
              <td>
                <div className="row-actions">
                  <RowActions resource={resource} record={row} busy={busy} onInspect={onInspect} onDelete={onDelete} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
