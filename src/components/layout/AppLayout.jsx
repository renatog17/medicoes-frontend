import { resources } from '../../config/resources.js'
import Sidebar from './Sidebar.jsx'

export default function AppLayout({ section, children }) {
  return (
    <div className="app-shell">
      <Sidebar section={section} />
      <div className="workspace">
        <header className="topbar">
          <span>Workspace <span className="slash">/</span><strong>{resources[section]?.title || 'Página não encontrada'}</strong></span>
          <span className="environment">API integrada</span>
        </header>
        <main>
          {children}
          <p className="page-footnote">Medições <span>•</span> Gestão de clientes, imóveis e equipamentos</p>
        </main>
      </div>
    </div>
  )
}
