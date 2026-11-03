import InstallationFilters from '../components/filters/InstallationFilters.jsx'
import RecordsPage from './RecordsPage.jsx'

export default function InstalacoesPage() {
  return <RecordsPage resource="instalacoes" Filters={InstallationFilters} />
}
