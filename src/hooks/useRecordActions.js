import { useState } from 'react'
import { recordsApi } from '../services/recordsApi.js'

export default function useRecordActions(resource, { onSaved, onRemoved }) {
  const [modal, setModal] = useState(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')

  async function inspect(id, mode = 'detail') {
    setBusy(true)
    try {
      const record = await recordsApi.get(resource, id)
      setModal({ mode, record })
    } catch (err) {
      setNotice('Erro: ' + err.message)
    } finally {
      setBusy(false)
    }
  }

  function saved(message) {
    setModal(null)
    setNotice(message)
    onSaved()
  }

  async function remove() {
    setBusy(true)
    try {
      await recordsApi.remove(resource, modal.record.id)
      setModal(null)
      setNotice('Registro excluído.')
      onRemoved()
    } catch (err) {
      setNotice('Erro: ' + err.message)
      setModal(null)
    } finally {
      setBusy(false)
    }
  }

  return {
    modal, busy, notice, inspect, saved, remove,
    create: () => setModal({ mode: 'create' }),
    confirmRemoval: record => setModal({ mode: 'delete', record }),
    close: () => setModal(null),
    dismissNotice: () => setNotice(''),
  }
}
