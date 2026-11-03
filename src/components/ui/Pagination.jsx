export default function Pagination({
  page, totalPages, onPageChange, loading, error, summary, label = 'registros',
}) {
  return (
    <footer className="pagination">
      <span>{loading || error ? "—" : summary}</span>
      <div>
        <button
          type="button"
          className="secondary"
          aria-label={'Página anterior de ' + label}
          disabled={loading || page === 0}
          onClick={() => onPageChange(page - 1)}
        >←</button>
        <span>Página {page + 1} de {Math.max(1, totalPages)}</span>
        <button
          type="button"
          className="secondary"
          aria-label={'Próxima página de ' + label}
          disabled={loading || !!error || page + 1 >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >→</button>
      </div>
    </footer>
  )
}
