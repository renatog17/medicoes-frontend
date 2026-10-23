export function reading(value) {
  const normalized = value.trim().replace(',', '.')
  if (!/^\d{1,13}(?:\.\d{1,6})?$/.test(normalized)) throw Error('Informe uma leitura não negativa, com até 13 dígitos inteiros e 6 decimais.')
  return normalized.replace(/^0+(?=\d)/, '')
}
export function measurementBody(installation, date, value) {
  const instant = new Date(date)
  if (!date || !Number.isFinite(instant.getTime())) throw Error('Informe uma data e hora válidas.')
  if (instant < new Date(installation.dataInicio) || (installation.dataFim && instant > new Date(installation.dataFim))) throw Error('A data deve estar dentro do período da instalação.')
  return `{"instalacaoId":${JSON.stringify(installation.id)},"dataMedicao":${JSON.stringify(instant.toISOString())},"leitura":${reading(value)}}`
}
