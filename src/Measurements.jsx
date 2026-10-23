import { useEffect, useState } from 'react'
import { api, pageData } from './api'
import { measurementBody } from './measurements.js'

export default function Measurements({ installation }) {
  const [page, setPage] = useState(0)
  const [revision, setRevision] = useState(0)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    // Reset the request state when synchronizing with another history page.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    setLoadError('')
    api(`/medicoes?${new URLSearchParams({ instalacaoId: installation.id, page, size: 20 })}`, 'GET', undefined, controller.signal)
      .then(pageData).then(data => { if (!controller.signal.aborted) setResult(data) })
      .catch(e => { if (e.name !== 'AbortError') setLoadError(e.message) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [installation.id, page, revision])
  async function submit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form))
    setError(''); setFieldErrors({}); setNotice('')
    setSaving(true)
    try {
      await api('/medicoes', 'POST', measurementBody(installation, values.dataMedicao, values.leitura))
      form.reset()
      setNotice('Medição cadastrada com sucesso.')
      setRevision(v => v + 1)
    } catch (e) {
      setError(e.message)
      setFieldErrors(Object.fromEntries((e.errors || []).map(item => [item.field, item.message])))
      if (e.status === 409) setRevision(v => v + 1)
    } finally { setSaving(false) }
  }
  return <section className="measurement-history" aria-label="Medições da instalação">
    <div className="records-heading"><h2>Medições da instalação #{installation.id}</h2><button type="button" className="secondary" disabled={loading} onClick={() => setRevision(v => v + 1)}>Atualizar histórico</button></div>
    <p className="form-note">A primeira medição é a referência inicial e pode ter leitura zero ou positiva. As seguintes devem ter data posterior e leitura igual ou maior que a anterior. Horários no fuso local ({Intl.DateTimeFormat().resolvedOptions().timeZone}).</p>
    <form onSubmit={submit}>
      <h3>Cadastrar medição</h3>
      {error && <p role="alert" className="alert error">{error}</p>}
      {notice && <p role="status" className="alert success">{notice}</p>}
      <div className="form-grid">
        <label className="field"><span>Data e hora *</span><input name="dataMedicao" type="datetime-local" step="any" required aria-invalid={!!fieldErrors.dataMedicao} aria-describedby="date-error"/><small id="date-error" className="danger-text">{fieldErrors.dataMedicao}</small></label>
        <label className="field"><span>Leitura *</span><input name="leitura" type="text" inputMode="decimal" required placeholder="Ex.: 100,123456" aria-invalid={!!fieldErrors.leitura} aria-describedby="reading-error"/><small id="reading-error" className="danger-text">{fieldErrors.leitura}</small></label>
      </div>
      {fieldErrors.instalacaoId && <p role="alert">{fieldErrors.instalacaoId}</p>}
      <button className="primary" disabled={saving}>{saving ? 'Salvando…' : 'Cadastrar medição'}</button>
    </form>
    {loadError ? <p className="alert error" role="alert">{loadError}</p> : loading ? <p role="status">Carregando medições…</p> : !result?.content.length ? <p className="form-note">Nenhuma medição encontrada. Cadastre a referência inicial desta instalação.</p> : <div className="table-wrap"><table><thead><tr><th>ID</th><th>Data e hora</th><th>Leitura</th><th>Referência</th></tr></thead><tbody>{result.content.map((item, index) => <tr key={item.id}><td>#{item.id}</td><td>{new Date(item.dataMedicao).toLocaleString('pt-BR')}</td><td>{item.leitura}</td><td>{page === 0 && index === 0 ? 'Referência inicial (medição 0)' : '—'}</td></tr>)}</tbody></table></div>}
    <footer className="pagination"><span>{loading || loadError ? '—' : `${result?.totalElements ?? 0} medição(ões)`}</span><div><button type="button" className="secondary" aria-label="Página anterior de medições" disabled={loading || page === 0} onClick={() => setPage(v => v - 1)}>←</button><span>Página {page + 1} de {Math.max(1, result?.totalPages || 0)}</span><button type="button" className="secondary" aria-label="Próxima página de medições" disabled={loading || !!loadError || page + 1 >= (result?.totalPages || 0)} onClick={() => setPage(v => v + 1)}>→</button></div></footer>
  </section>
}
