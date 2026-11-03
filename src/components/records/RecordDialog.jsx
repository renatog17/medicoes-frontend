import { useState } from 'react'
import { resources } from '../../config/resources.js'
import MeasurementHistory from '../measurements/MeasurementHistory.jsx'
import Modal from '../ui/Modal.jsx'
import RecordDetails from './RecordDetails.jsx'
import RecordEditor from './RecordEditor.jsx'

export default function RecordDialog({ resource, modal, busy, onClose, onSaved, onRemove }) {
  const [saving, setSaving] = useState(false)
  const { mode, record } = modal
  const config = resources[resource]

  return (
    <Modal onClose={onClose} locked={busy || saving} titleId="record-dialog-title">
      {['create', 'edit', 'close'].includes(mode) ? (
        <RecordEditor
          resource={resource}
          record={record}
          closing={mode === 'close'}
          onClose={onClose}
          onSaved={onSaved}
          onBusyChange={setSaving}
        />
      ) : mode === 'delete' ? (
        <div>
          <p className="eyebrow">EXCLUSÃO DE REGISTRO</p>
          <h2 id="record-dialog-title">Excluir {config.singular} #{record.id}?</h2>
          <p className="form-note">
            O registro deixará de aparecer nos cadastros. Vínculos com instalações, inclusive encerradas,
            impedem a exclusão. CIN e número de série permanecem reservados.
          </p>
          <footer className="modal-footer">
            <button className="secondary" disabled={busy} onClick={onClose}>Cancelar</button>
            <button className="danger" disabled={busy} onClick={onRemove}>{busy ? 'Excluindo…' : 'Confirmar exclusão'}</button>
          </footer>
        </div>
      ) : (
        <div>
          <div className="modal-heading">
            <h2 id="record-dialog-title">{resource === 'faturas' ? 'Fatura' : 'Registro'} #{record.id}</h2>
            <button className="icon-button" aria-label="Fechar" onClick={onClose}>×</button>
          </div>
          <RecordDetails record={record} />
          {resource === 'instalacoes' && <MeasurementHistory installation={record} />}
          <footer className="modal-footer">
            <button className="secondary" onClick={onClose}>Fechar</button>
          </footer>
        </div>
      )}
    </Modal>
  )
}
