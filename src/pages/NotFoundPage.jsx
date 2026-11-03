import Link from '../components/ui/Link.jsx'

export default function NotFoundPage() {
  return (
    <div className="empty">
      <span>404</span>
      <h1>Página não encontrada</h1>
      <p>Selecione uma seção no menu ou volte para a lista de clientes.</p>
      <Link href="/clientes" className="primary">Ir para clientes</Link>
    </div>
  )
}
