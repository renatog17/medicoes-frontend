export function formatValue(value) {
  if (value == null) return "—"
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não'
  return String(value)
}

export function localDateTime(value = new Date()) {
  const date = new Date(value)
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

export function digitsOnly(value) {
  return String(value ?? '').replace(/\D/g, '')
}

const masks = {
  cin: { pattern: '###.###.###-##', placeholder: '000.000.000-00', maxLength: 14 },
  telefone: { placeholder: '(00) 00000-0000', maxLength: 15 },
  cep: { pattern: '#####-###', placeholder: '00000-000', maxLength: 9 },
}

export function fieldMask(key) {
  return masks[key]
}

export function maskValue(value, key) {
  const mask = masks[key]
  if (!mask) return value ?? ''
  const digits = digitsOnly(value).slice(0, key === 'cep' ? 8 : 11)
  const pattern = key === 'telefone'
    ? (digits.length > 10 ? '(##) #####-####' : '(##) ####-####')
    : mask.pattern
  let result = ''
  let index = 0
  for (const character of pattern) {
    if (index >= digits.length) break
    result += character === '#' ? digits[index++] : character
  }
  return result
}
