import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
const source = (await readFile(new URL('../src/api.js', import.meta.url), 'utf8')).replace('import.meta.env.VITE_API_BASE_URL', "'/api'")
const { api, pageData, validCpf } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'))

test('medições preservam decimais e os detalhes de validação', async () => {
 const original = globalThis.fetch
 try {
  globalThis.fetch = async (url, options) => {
   assert.equal(options.body, '{"leitura":9999999999999.999999}')
   return new Response('{"id":1,"leitura":9999999999999.999999}', {status:201})
  }
  assert.equal((await api('/medicoes', 'POST', '{"leitura":9999999999999.999999}')).leitura, '9999999999999.999999')
  globalThis.fetch = async () => new Response('{"detail":"Conflito de sequência","errors":[{"field":"leitura","message":"Inválida"}]}', {status:409})
  await assert.rejects(api('/medicoes'), error => error.status === 409 && error.errors[0].field === 'leitura')
 } finally { globalThis.fetch = original }
})
test('CPF: verifica dígitos e rejeita repetições e máscaras', () => {
 assert.equal(validCpf('52998224725'),true)
 for(const cpf of ['11111111111','52998224726','529.982.247-25','']) assert.equal(validCpf(cpf),false)
})
test('normaliza as páginas Spring e rejeita contrato inválido', () => {
 assert.deepEqual(pageData({content:[{id:1}],page:{totalElements:21,totalPages:2}}),{content:[{id:1}],totalElements:21,totalPages:2})
 assert.throws(()=>pageData({message:'unexpected'}))
})
test('requisições: serialização, exclusão 204, conflitos e falha de conexão', async () => {
 const original=globalThis.fetch
 try {
  globalThis.fetch=async (url,options)=>{assert.equal(url,'/api/medidores');assert.equal(options.method,'POST');assert.deepEqual(JSON.parse(options.body),{numeroSerie:'X'});return new Response('{"id":1}',{status:201})}
  assert.deepEqual(await api('/medidores','POST',{numeroSerie:'X'}),{id:1})
  globalThis.fetch=async()=>new Response(null,{status:204})
  assert.equal(await api('/medidores/1','DELETE'),null)
  globalThis.fetch=async()=>new Response('{"detail":"Série reservada"}',{status:409})
  await assert.rejects(api('/medidores','POST',{}),/Série reservada/)
  globalThis.fetch=async()=>{throw new TypeError('fetch failed')}
  await assert.rejects(api('/clientes'),/conectar à API/)
 } finally {globalThis.fetch=original}
})
