import { fieldLabel } from '../../config/resources.js'
import { formatValue } from '../../utils/formatters.js'

export default function RecordDetails({ record }) {
  return (
    <dl className="details">
      {Object.entries(record).map(([key, value]) => (
        <div key={key}>
          <dt>{fieldLabel(key)}</dt>
          <dd>
            {value && typeof value === 'object'
              ? <RecordDetails record={value} />
              : ['dataInicio', 'dataFim'].includes(key) && value
                ? new Date(value).toLocaleString('pt-BR')
                : formatValue(value)}
          </dd>
        </div>
      ))}
    </dl>
  )
}
