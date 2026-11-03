import { resources } from '../../config/resources.js'
import { sectionPaths } from '../../config/routes.js'
import Link from '../ui/Link.jsx'

export default function Sidebar({ section }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-icon">m<span>•</span></span>
        <div>Medições<small>Gestão de instalações</small></div>
      </div>
      <p className="nav-label">ESPAÇO DE TRABALHO</p>
      <nav aria-label="Navegação principal">
        {Object.entries(resources).map(([key, resource]) => (
          <Link
            key={key}
            href={sectionPaths[key]}
            className={section === key ? 'selected' : ''}
            aria-current={section === key ? 'page' : undefined}
          >
            <span>{resource.icon}</span>
            {resource.title}
            <span className="nav-arrow">›</span>
          </Link>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <span className="small-mark">M</span>
        <div>Central de gestão<small>Cadastros e histórico</small></div>
      </div>
    </aside>
  )
}
