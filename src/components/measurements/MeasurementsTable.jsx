export default function MeasurementsTable({ rows, page }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>ID</th><th>Data e hora</th><th>Leitura</th><th>Referência</th><th>Emissão da fatura</th></tr>
        </thead>
        <tbody>
          {rows.map((item, index) => (
            <tr key={item.id}>
              <td>#{item.id}</td>
              <td>{new Date(item.dataMedicao).toLocaleString('pt-BR')}</td>
              <td>{item.leitura}</td>
              <td>{page === 0 && index === 0 ? 'Referência inicial (medição 0)' : "—"}</td>
              <td>{item.falhaEmissaoFatura === true ? 'Falhou — sem nova tentativa automática' : item.falhaEmissaoFatura === false ? 'Sem falha registrada' : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
