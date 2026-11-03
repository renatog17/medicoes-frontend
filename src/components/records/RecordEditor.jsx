import { useEffect, useRef, useState } from 'react'
import { validCpf } from '../../utils/validation.js'
import { resources } from '../../config/resources.js'
import { recordsApi } from '../../services/recordsApi.js'
import { installationsApi } from '../../services/installationsApi.js'
import { localDateTime } from '../../utils/formatters.js'
import { recordBody } from '../../utils/recordForms.js'
import AddressFields from '../forms/AddressFields.jsx'
import PropertyAddressFields from '../forms/PropertyAddressFields.jsx'
import FormField from '../forms/FormField.jsx'
import Alert from '../ui/Alert.jsx'

export default function RecordEditor({ resource, record, closing, onClose, onSaved, onBusyChange }) {
  const config = resources[resource]
  const fields = closing ? [['dataFim', 'Data de encerramento', true]] : config.fields
  const form = useRef(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [pendingInstallation, setPendingInstallation] = useState(null)
  const newInstallation = resource === 'instalacoes' && !record && !closing

  useEffect(() => {
    form.current?.querySelector('input')?.focus()
  }, [])

  async function submit(event) {
    event.preventDefault()
    setError('')
    setSaving(true)
    onBusyChange?.(true)
    try {
      const values = new FormData(event.currentTarget)
      const initialReading = values.get('leituraInicial')
      values.delete('leituraInicial')
      const body = pendingInstallation || recordBody(resource, values, { record, closing })
      if (resource === 'clientes' && !validCpf(body.cin)) {
        throw Error('Informe um CPF válido.')
      }
      if (newInstallation) {
        await installationsApi.createWithInitialReading(body, initialReading, setPendingInstallation, pendingInstallation)
      }
      else if (closing) await recordsApi.closeInstallation(record.id, body)
      else if (record) await recordsApi.update(resource, record.id, body)
      else await recordsApi.create(resource, body)
      onSaved(newInstallation ? 'Instalação e medição inicial cadastradas.' : closing ? 'Instalação encerrada.' : 'Registro salvo com sucesso.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
      onBusyChange?.(false)
    }
  }

  return (
    <form ref={form} onSubmit={submit}>
      <div className="modal-heading">
        <div>
          <p className="eyebrow">{config.title}</p>
          <h2 id="record-dialog-title">{closing ? 'Encerrar instalação' : record ? 'Editar registro' : 'Cadastrar ' + config.singular}</h2>
        </div>
        <button type="button" className="icon-button" disabled={saving} onClick={onClose} aria-label="Fechar">×</button>
      </div>
      <p className="form-note">{closing ? 'O histórico da instalação será preservado.' : 'Campos com * são obrigatórios.'}</p>
      <Alert>{error}</Alert>
      {pendingInstallation && (
        <p className="form-note" role="status">A instalação {pendingInstallation.id} já foi criada. Falta registrar a medição inicial. Tente salvar novamente. Se fechar, registre a leitura na tela de medições dessa instalação.</p>
      )}
      <fieldset className="form-grid" disabled={saving || !!pendingInstallation} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
        {fields.map(field => {
          const [key] = field
          const value = key.startsWith('data') ? localDateTime(record?.[key] || new Date()) : record?.[key]
          return <FormField key={key} field={field} defaultValue={value} />
        })}
        {!closing && config.addressKey && (
          resource === 'imoveis' && !record
            ? <PropertyAddressFields />
            : <AddressFields addressKey={config.addressKey} address={record?.[config.addressKey]} />
        )}
        {!closing && resource === 'instalacoes' && (
          <p className="form-note full">Consulte os IDs nas telas de clientes, imóveis e medidores. Os três cadastros precisam existir.</p>
        )}
      </fieldset>
      {newInstallation && (
        <label className="field" style={{ marginTop: 18 }}>
          <span>Medição 0 — leitura inicial *</span>
          <input name="leituraInicial" type="text" inputMode="decimal" required disabled={saving}
            placeholder="Ex.: 100,123456" aria-describedby="initial-reading-note" />
          <small id="initial-reading-note" className="form-note">Informe a leitura do medidor no início da instalação. Será registrada na data de início; o valor pode ser zero ou maior.</small>
        </label>
      )}
      <footer className="modal-footer">
        <button className="secondary" type="button" onClick={onClose} disabled={saving}>Cancelar</button>
        <button className="primary" disabled={saving}>{saving ? 'Salvando…' : closing ? 'Confirmar encerramento' : 'Salvar registro'}</button>
      </footer>
    </form>
  )
}
