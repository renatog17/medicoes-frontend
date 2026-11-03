export default function CollectionState({
  loading, error, empty, onRetry, icon, emptyMessage, children,
  loadingMessage = 'Carregando registros…',
}) {
  if (error) {
    return (
      <div className="empty" role="alert">
        <span>!</span>
        <h3>Não foi possível carregar os registros</h3>
        <p>{error}</p>
        <button className="secondary" onClick={onRetry}>Tentar novamente</button>
      </div>
    )
  }
  if (loading) {
    return <div className="empty" role="status"><div className="spinner" /><p>{loadingMessage}</p></div>
  }
  if (empty) {
    return (
      <div className="empty">
        <span>{icon}</span>
        <h3>Nenhum registro encontrado</h3>
        <p>{emptyMessage}</p>
      </div>
    )
  }
  return children
}
