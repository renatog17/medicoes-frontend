import { digitsOnly } from './formatters.js'

export function formFilters(form) {
  return Object.fromEntries([...new FormData(form)].filter(([, value]) => value !== ''))
}

export function recordBody(resource, entries, { record, closing = false } = {}) {
  const body = {}
  for (const [key, value] of entries) {
    if (key.includes('.')) {
      const [parent, child] = key.split('.')
      body[parent] ??= {}
      body[parent][child] = value || null
    } else {
      body[key] = value || null
    }
  }

  for (const key of ['cin', 'telefone']) {
    if (body[key]) body[key] = digitsOnly(body[key])
  }
  for (const key of ['endereco', 'enderecoCobranca']) {
    if (body[key]?.cep) body[key].cep = digitsOnly(body[key].cep)
  }

  if (resource === 'instalacoes') {
    if (closing) {
      if (new Date(body.dataFim) <= new Date(record.dataInicio)) {
        throw Error('O encerramento deve ser posterior ao início.')
      }
      body.dataFim = new Date(body.dataFim).toISOString()
    } else {
      for (const key of ['clienteId', 'imovelId', 'medidorId']) body[key] = Number(body[key])
      if (body.diaEmissao != null) {
        const day = Number(body.diaEmissao)
        if (!Number.isInteger(day) || day < 1 || day > 31) {
          throw Error('O dia de emissão deve ser um inteiro de 1 a 31.')
        }
        body.diaEmissao = day
      }
      body.dataInicio = new Date(body.dataInicio).toISOString()
    }
  }
  return body
}
