const relations = [['cliente', 'clientes', 'nome'], ['imovel', 'imoveis', 'endereco'], ['medidor', 'medidores', 'numeroSerie']]

export async function resolveInstallationRelations(rows, fetchRecord) {
  const requests = new Map()
  return Promise.all(rows.map(async row => {
    const resolved = { ...row }
    await Promise.all(relations.map(async ([key, resource, field]) => {
      if (row[key]?.[field]) return
      const id = row[key + 'Id'] ?? row[key]?.id
      if (id == null) return
      const cacheKey = resource + '/' + id
      if (!requests.has(cacheKey)) {
        requests.set(cacheKey, Promise.resolve().then(() => fetchRecord(resource, id)).catch(error => {
          if (error.name === 'AbortError') throw error
          return null
        }))
      }
      const related = await requests.get(cacheKey)
      if (related) resolved[key] = { ...row[key], ...related }
    }))
    return resolved
  }))
}

export function installationRelationInfo(row, field) {
  if (field === 'clienteId') return row.cliente?.nome || ''
  if (field === 'medidorId') {
    const meter = row.medidor
    return [meter?.numeroSerie, meter?.fabricante, meter?.modelo].filter(Boolean).join(' · ')
  }
  const address = row.imovel?.endereco
  return address ? [
    [address.logradouro, address.numero].filter(value => value != null && value !== '').join(', '),
    address.complemento, address.bairro,
    [address.cidade, address.uf].filter(Boolean).join('/'), address.cep,
  ].filter(Boolean).join(' · ') : ''
}
