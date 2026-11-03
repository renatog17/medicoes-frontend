import { fieldMask, maskValue } from '../../utils/formatters.js'

export default function FormField({ field, prefix = '', defaultValue = '' }) {
  const [key, label, required = false] = field
  const type = key.startsWith('data') ? 'datetime-local'
    : key.endsWith('Id') || key === 'diaEmissao' ? 'number'
      : key === 'email' ? 'email' : 'text'
  const mask = fieldMask(key)

  return (
    <label className="field">
      <span>{label}{required ? ' *' : ''}</span>
      <input
        name={prefix + key}
        type={type}
        min={type === 'number' ? 1 : undefined}
        max={key === 'diaEmissao' ? 31 : undefined}
        step={type === 'number' ? 1 : undefined}
        required={required}
        defaultValue={maskValue(defaultValue, key)}
        inputMode={mask ? 'numeric' : undefined}
        maxLength={mask?.maxLength}
        placeholder={mask?.placeholder}
        onChange={mask ? event => { event.target.value = maskValue(event.target.value, key) } : undefined}
      />
    </label>
  )
}
