import DirectLookup from '../components/filters/DirectLookup.jsx'
import RecordDialog from '../components/records/RecordDialog.jsx'
import RecordsHeader from '../components/records/RecordsHeader.jsx'
import RecordsTable from '../components/records/RecordsTable.jsx'
import Alert from '../components/ui/Alert.jsx'
import CollectionState from '../components/ui/CollectionState.jsx'
import Pagination from '../components/ui/Pagination.jsx'
import { resources } from '../config/resources.js'
import useRecordActions from '../hooks/useRecordActions.js'
import useRecords from '../hooks/useRecords.js'

export default function RecordsPage({ resource, Filters }) {
  const config = resources[resource]
  const list = useRecords(resource)
  const actions = useRecordActions(resource, { onSaved: list.refresh, onRemoved: list.afterRemoval })
  const filtered = Object.keys(list.filters).length > 0
  const emptyMessage = config.readOnly
    ? 'Altere o filtro de competência ou tente novamente mais tarde.'
    : filtered ? 'Altere os filtros para consultar outros registros.'
      : 'Cadastre o primeiro ' + config.singular + ' para começar.'

  return (
    <>
      <RecordsHeader
        resource={resource}
        total={list.data.totalElements}
        loading={list.loading}
        error={list.error}
        filtered={filtered}
        onCreate={actions.create}
      />
      <Alert variant={actions.notice.startsWith('Erro:') ? 'error' : 'success'} onDismiss={actions.dismissNotice}>
        {actions.notice}
      </Alert>
      <section className="records">
        <div className="records-heading">
          <div>
            <h2>{config.readOnly ? 'Faturas' : 'Todos os registros'}</h2>
            <p>{config.readOnly ? 'Consulte as faturas emitidas e seus detalhes.' : 'Consulte e mantenha seus cadastros atualizados.'}</p>
          </div>
          <button className="secondary" disabled={list.loading} onClick={list.refresh}>↻ Atualizar</button>
        </div>
        <DirectLookup invoice={config.readOnly} busy={actions.busy} onLookup={actions.inspect} />
        {Filters && <Filters filters={list.filters} onApply={list.applyFilters} />}
        <CollectionState
          loading={list.loading}
          error={list.error}
          empty={!list.data.content.length}
          onRetry={list.refresh}
          icon={config.icon}
          emptyMessage={emptyMessage}
        >
          <RecordsTable
            resource={resource}
            rows={list.data.content}
            busy={actions.busy}
            onInspect={actions.inspect}
            onDelete={actions.confirmRemoval}
          />
        </CollectionState>
        <Pagination
          page={list.page}
          totalPages={list.data.totalPages}
          onPageChange={list.setPage}
          loading={list.loading}
          error={list.error}
          summary={list.data.totalElements + ' registro(s) · até 20 por página'}
        />
      </section>
      {actions.modal && (
        <RecordDialog
          key={actions.modal.mode + '-' + (actions.modal.record?.id || 'new')}
          resource={resource}
          modal={actions.modal}
          busy={actions.busy}
          onClose={actions.close}
          onSaved={actions.saved}
          onRemove={actions.remove}
        />
      )}
    </>
  )
}
