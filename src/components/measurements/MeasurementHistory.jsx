import useRecords from '../../hooks/useRecords.js'
import CollectionState from '../ui/CollectionState.jsx'
import Pagination from '../ui/Pagination.jsx'
import MeasurementForm from './MeasurementForm.jsx'
import MeasurementsTable from './MeasurementsTable.jsx'

export default function MeasurementHistory({ installation }) {
  const list = useRecords('medicoes', { instalacaoId: installation.id })
  const [measurement, setMeasurement] = useState(null)
  const [lookupError, setLookupError] = useState('')
  const [lookingUp, setLookingUp] = useState(false)

  async function lookup(event) {
    event.preventDefault()
    const id = new FormData(event.currentTarget).get('medicaoId')
    setLookingUp(true)
    setLookupError('')
    setMeasurement(null)
    try {
      const result = await measurementsApi.get(id)
      if (String(result.instalacaoId) !== String(installation.id)) {
        throw Error('Esta medição pertence a outra instalação.')
      }
      setMeasurement(result)
    } catch (error) {
      setLookupError(error.message)
    } finally {
      setLookingUp(false)
    }
  }

  return (
    <section className="measurement-history" aria-label="Medições da instalação">
      <div className="records-heading">
        <h2>Medições da instalação #{installation.id}</h2>
        <button type="button" className="secondary" disabled={list.loading} onClick={list.refresh}>Atualizar histórico</button>
      </div>
      <p className="form-note">
        A primeira medição é a referência inicial e pode ter leitura zero ou positiva.
        As seguintes devem ter data posterior e leitura igual ou maior que a anterior.
        Horários no fuso local ({Intl.DateTimeFormat().resolvedOptions().timeZone}).
      </p>
      <MeasurementForm installation={installation} onSaved={list.refresh} />
      <p className="form-note">No mês da referência inicial são permitidas duas medições; nos demais, uma por mês, considerando o horário de Brasília. Falhas de emissão de fatura não são tentadas novamente automaticamente.</p>
      <form className="filters" onSubmit={lookup}>
        <input name="medicaoId" type="number" min="1" step="1" required placeholder="ID da medição" aria-label="ID da medição" />
        <button className="secondary" disabled={lookingUp}>{lookingUp ? 'Consultando…' : 'Consultar medição'}</button>
      </form>
      <Alert>{lookupError}</Alert>
      {measurement && <RecordDetails record={measurement} />}
      <CollectionState
        loading={list.loading}
        error={list.error}
        empty={!list.data.content.length}
        icon="◴"
        onRetry={list.refresh}
        loadingMessage="Carregando medições…"
        emptyMessage="Nenhuma medição encontrada. Cadastre a referência inicial desta instalação."
      >
        <MeasurementsTable rows={list.data.content} page={list.page} />
      </CollectionState>
      <Pagination
        page={list.page}
        totalPages={list.data.totalPages}
        onPageChange={list.setPage}
        loading={list.loading}
        error={list.error}
        summary={list.data.totalElements + ' medição(ões)'}
        label="medições"
      />
    </section>
  )
}
import { useState } from 'react'
import { measurementsApi } from '../../services/measurementsApi.js'
import Alert from '../ui/Alert.jsx'
import RecordDetails from '../records/RecordDetails.jsx'
