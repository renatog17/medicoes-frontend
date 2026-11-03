import InvoiceFilters from '../components/filters/InvoiceFilters.jsx'
import RecordsPage from './RecordsPage.jsx'

export default function FaturasPage() {
  return <RecordsPage resource="faturas" Filters={InvoiceFilters} />
}
