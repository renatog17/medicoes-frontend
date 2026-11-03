import { test } from 'node:test'
import assert from 'node:assert/strict'
import { installationsApi } from '../src/services/installationsApi.js'
import { recordsApi } from '../src/services/recordsApi.js'
import { measurementsApi } from '../src/services/measurementsApi.js'

test('instalação exige leitura válida antes de criar e permite retomar somente a medição', async t => {
  const body = { clienteId: 1, imovelId: 2, medidorId: 3, dataInicio: '2026-10-28T12:00:00.000Z' }
  let creates = 0
  let measurements = 0
  let pending
  t.mock.method(recordsApi, 'create', async (resource, sent) => {
    creates++
    assert.equal(resource, 'instalacoes')
    assert.deepEqual(sent, body)
    return { id: 42, ...sent }
  })
  t.mock.method(measurementsApi, 'create', async (installation, date, value) => {
    measurements++
    assert.equal(installation.id, 42)
    assert.equal(date, body.dataInicio)
    assert.equal(value, '100.123456')
    if (measurements === 1) throw Error('Falha ao registrar medição')
  })
  const remember = installation => { pending = installation }
  for (const invalid of ['', '-1', '1.1234567']) {
    await assert.rejects(installationsApi.createWithInitialReading(body, invalid, remember))
  }
  assert.equal(creates, 0)
  await assert.rejects(installationsApi.createWithInitialReading(body, '100,123456', remember), /Falha/)
  assert.equal(pending.id, 42)
  await installationsApi.createWithInitialReading(body, '100,123456', remember, pending)
  assert.equal(creates, 1)
  assert.equal(measurements, 2)
})

test('leitura inicial aceita zero e não tenta medir se a criação falhar', async t => {
  t.mock.method(recordsApi, 'create', async () => { throw Error('Conflito') })
  const measure = t.mock.method(measurementsApi, 'create', async () => {})
  await assert.rejects(installationsApi.createWithInitialReading({}, '0', () => {}), /Conflito/)
  assert.equal(measure.mock.callCount(), 0)
})
