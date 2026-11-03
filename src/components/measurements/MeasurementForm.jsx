import { useState } from 'react'
import { measurementsApi } from '../../services/measurementsApi.js'
import Alert from '../ui/Alert.jsx'

export default function MeasurementForm({ installation, onSaved }) {
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form))
    setError('')
    setFieldErrors({})
    setNotice('')
    setSaving(true)
    try {
      await measurementsApi.create(installation, values.dataMedicao, values.leitura)
      form.reset()
      setNotice('Medição cadastrada com sucesso.')
      onSaved()
    } catch (err) {
      setError(err.message)
      setFieldErrors(Object.fromEntries((err.errors || []).map(item => [item.field, item.message])))
      if (err.status === 409) onSaved()
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit}>
      <h3>Cadastrar medição</h3>
      <Alert>{error}</Alert>
      <Alert variant="success">{notice}</Alert>
      <div className="form-grid">
        <label className="field">
          <span>Data e hora *</span>
          <input name="dataMedicao" type="datetime-local" step="any" required aria-invalid={!!fieldErrors.dataMedicao} aria-describedby="date-error" />
          <small id="date-error" className="danger-text">{fieldErrors.dataMedicao}</small>
        </label>
        <label className="field">
          <span>Leitura *</span>
          <input name="leitura" type="text" inputMode="decimal" required placeholder="Ex.: 100,123456" aria-invalid={!!fieldErrors.leitura} aria-describedby="reading-error" />
          <small id="reading-error" className="danger-text">{fieldErrors.leitura}</small>
        </label>
      </div>
      {fieldErrors.instalacaoId && <p role="alert">{fieldErrors.instalacaoId}</p>}
      <button className="primary" disabled={saving}>{saving ? 'Salvando…' : 'Cadastrar medição'}</button>
    </form>
  )
}
