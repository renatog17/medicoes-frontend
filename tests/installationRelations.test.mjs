import { test } from 'node:test'
import assert from 'node:assert/strict'
import { resolveInstallationRelations, installationRelationInfo } from '../src/utils/installationRelations.js'

test('resolve vínculos uma vez por ID e mantém os dados já incluídos na instalação', async () => {
  const calls = []
  const rows = [{ id: 1, clienteId: 2, imovelId: 3, medidor: { id: 4, numeroSerie: 'ABC' } },
    { id: 5, clienteId: 2 }]
  const resolved = await resolveInstallationRelations(rows, async (resource, id) => {
    calls.push([resource, id])
    return resource === 'clientes' ? { id, nome: 'Ana' } : { id, endereco: { logradouro: 'Rua A', numero: 0, cidade: 'Salvador', uf: 'BA' } }
  })
  assert.deepEqual(calls, [['clientes', 2], ['imoveis', 3]])
  assert.equal(installationRelationInfo(resolved[0], 'clienteId'), 'Ana')
  assert.equal(installationRelationInfo(resolved[0], 'medidorId'), 'ABC')
  assert.equal(installationRelationInfo(resolved[0], 'imovelId'), 'Rua A, 0 · Salvador/BA')
  assert.equal(rows[0].cliente, undefined)
})

test('falha em um vínculo preserva a instalação e os demais vínculos', async () => {
  const [row] = await resolveInstallationRelations([{ id: 1, clienteId: 2, medidorId: 3 }], async resource => {
    if (resource === 'clientes') throw Error('Indisponível')
    return { numeroSerie: 'ABC', fabricante: 'Marca', modelo: 'M1' }
  })
  assert.equal(row.clienteId, 2)
  assert.equal(installationRelationInfo(row, 'clienteId'), '')
  assert.equal(installationRelationInfo(row, 'medidorId'), 'ABC · Marca · M1')
  await assert.rejects(resolveInstallationRelations([{ clienteId: 2 }], async () => {
    throw Object.assign(Error('Cancelado'), { name: 'AbortError' })
  }), { name: 'AbortError' })
})
