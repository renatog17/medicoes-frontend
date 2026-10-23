import { test } from 'node:test'
import assert from 'node:assert/strict'
import { reading, measurementBody } from '../src/measurements.js'

test('leitura mantém precisão máxima e rejeita arredondamento implícito', () => {
  assert.equal(reading('9999999999999,999999'), '9999999999999.999999')
  assert.equal(reading('0'), '0')
  for (const value of ['-1', '1.1234567', '10000000000000', '1e3', '', 'NaN']) assert.throws(() => reading(value))
})
test('datas respeitam os limites inclusivos de instalações encerradas', () => {
  const installation = { id: 1, dataInicio: '2026-10-14T12:00:00Z', dataFim: '2026-10-15T12:00:00Z' }
  const body = measurementBody(installation, '2026-10-14T09:00:00-03:00', '9999999999999.999999')
  assert.ok(body.includes('"dataMedicao":"2026-10-14T12:00:00.000Z"'))
  assert.ok(body.includes('"leitura":9999999999999.999999'))
  assert.doesNotThrow(() => measurementBody(installation, installation.dataFim, '0'))
  for (const date of ['', 'invalid', '2026-10-14T11:59:59Z', '2026-10-15T12:00:01Z']) assert.throws(() => measurementBody(installation, date, '1'))
})
