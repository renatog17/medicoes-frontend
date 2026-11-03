import { test } from 'node:test'
import assert from 'node:assert/strict'
import { recordBody } from '../src/utils/recordForms.js'
import { maskValue } from '../src/utils/formatters.js'
import { sectionFromPath } from '../src/config/routes.js'

test('a máscara fica na interface e CPF, telefone e CEP são enviados apenas com números', () => {
  const body = recordBody('clientes', Object.entries({
    nome: 'Cliente',
    cin: '529.982.247-25',
    telefone: '(71) 99999-1234',
    'enderecoCobranca.logradouro': 'Rua 1-A',
    'enderecoCobranca.cep': '42800-000',
    'enderecoCobranca.uf': 'BA',
    'enderecoCobranca.cidade': 'Camaçari',
    email: '',
  }))
  assert.equal(body.cin, '52998224725')
  assert.equal(body.telefone, '71999991234')
  assert.equal(body.enderecoCobranca.cep, '42800000')
  assert.equal(body.enderecoCobranca.logradouro, 'Rua 1-A')
  assert.equal(body.enderecoCobranca.cidade, 'Camaçari')
  assert.equal(body.email, null)
  assert.equal(recordBody('imoveis', [['endereco.cep', '40000-000']]).endereco.cep, '40000000')
})

test('as máscaras aceitam valores parciais, colagem, telefone fixo e celular', () => {
  assert.equal(maskValue('5299', 'cin'), '529.9')
  assert.equal(maskValue('529.982.247-25', 'cin'), '529.982.247-25')
  assert.equal(maskValue('42800000', 'cep'), '42800-000')
  assert.equal(maskValue('7133331234', 'telefone'), '(71) 3333-1234')
  assert.equal(maskValue('71999991234', 'telefone'), '(71) 99999-1234')
  assert.equal(maskValue('1-A', 'numero'), '1-A')
})

test('o formulário de instalação mantém IDs numéricos e datas em UTC', () => {
  const body = recordBody('instalacoes', Object.entries({
    clienteId: '1', imovelId: '2', medidorId: '3', dataInicio: '2026-10-28T09:00:00-03:00',
  }))
  assert.deepEqual([body.clienteId, body.imovelId, body.medidorId], [1, 2, 3])
  assert.equal(body.dataInicio, '2026-10-28T12:00:00.000Z')
  assert.throws(() => recordBody('instalacoes', [['dataFim', '2026-10-28T11:00:00Z']], {
    record: { dataInicio: body.dataInicio }, closing: true,
  }), /posterior/)
})

test('rotas aceitam acesso direto e barra final e identificam páginas inexistentes', () => {
  assert.equal(sectionFromPath('/'), 'clientes')
  assert.equal(sectionFromPath('/instalacoes/'), 'instalacoes')
  assert.equal(sectionFromPath('/faturas'), 'faturas')
  assert.equal(sectionFromPath('/clientes/inexistente'), null)
})

test('dia de emissão aceita somente inteiros de 1 a 31 e preserva o padrão da API', () => {
  const body = day => recordBody('instalacoes', Object.entries({
    clienteId: '1', imovelId: '2', medidorId: '3', dataInicio: '2026-10-28T12:00:00Z', diaEmissao: day,
  }))
  for (const day of ['1', '20', '31']) assert.equal(body(day).diaEmissao, Number(day))
  assert.equal(body('').diaEmissao, null)
  for (const day of ['0', '32', '1.5', 'abc']) assert.throws(() => body(day), /inteiro de 1 a 31/)
})
