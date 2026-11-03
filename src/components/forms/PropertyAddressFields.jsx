import { useState } from 'react'
import useRecords from '../../hooks/useRecords.js'
import Pagination from '../ui/Pagination.jsx'
import Alert from '../ui/Alert.jsx'
import AddressFields from './AddressFields.jsx'

export default function PropertyAddressFields() {
  const clients = useRecords('clientes')
  const [selectedId, setSelectedId] = useState('')
  const [copied, setCopied] = useState(null)
  const selected = clients.data.content.find(client => String(client.id) === selectedId)

  return (
    <>
      <div className="full">
        <label className="field">
          <span>Usar endereço de um cliente (opcional)</span>
          <select value={selectedId} disabled={clients.loading || !!clients.error}
            onChange={event => setSelectedId(event.target.value)}>
            <option value="">{clients.loading ? 'Carregando clientes…' : 'Selecione um cliente'}</option>
            {clients.data.content.map(client => (
              <option key={client.id} value={client.id} disabled={!client.enderecoCobranca}>
                {client.nome} — ID {client.id}{!client.enderecoCobranca ? ' (sem endereço)' : ''}
              </option>
            ))}
          </select>
        </label>
        <p className="form-note">Copie o endereço de cobrança do cliente e ajuste os campos se necessário.</p>
        <Alert>{clients.error}</Alert>
        {clients.error && (
          <button type="button" className="secondary" onClick={clients.refresh}>Tentar novamente</button>
        )}
        {!clients.loading && !clients.error && clients.data.totalElements === 0 && (
          <p className="form-note">Nenhum cliente cadastrado. Preencha o endereço abaixo.</p>
        )}
        {clients.data.totalPages > 1 && (
          <Pagination page={clients.page} totalPages={clients.data.totalPages}
            loading={clients.loading} error={clients.error} label="clientes"
            summary={clients.data.totalElements + ' clientes'}
            onPageChange={page => { setSelectedId(''); clients.setPage(page) }} />
        )}
        <button type="button" className="secondary"
          disabled={!selected?.enderecoCobranca || clients.loading || !!clients.error}
          onClick={() => setCopied(previous => ({
            address: { ...selected.enderecoCobranca },
            name: selected.nome,
            revision: (previous?.revision || 0) + 1,
          }))}>
          Copiar endereço
        </button>
        {copied && <p className="form-note" role="status">Endereço de {copied.name} copiado. Confira os dados antes de salvar.</p>}
      </div>
      <AddressFields key={copied?.revision || 0} addressKey="endereco" address={copied?.address} />
    </>
  )
}
