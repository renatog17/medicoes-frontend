import { addressFields } from './locations.js'

export const resources = {
  clientes: {
    title: 'Clientes',
    singular: 'cliente',
    icon: "◎",
    description: 'Gerencie os clientes e seus dados de cobrança.',
    fields: [['nome', 'Nome', true], ['cin', 'CIN / CPF', true], ['email', 'E-mail'], ['telefone', 'Telefone']],
    addressKey: 'enderecoCobranca',
  },
  imoveis: {
    title: 'Imóveis',
    singular: 'imóvel',
    icon: "⌂",
    description: 'Organize os endereços dos imóveis atendidos.',
    fields: [],
    addressKey: 'endereco',
  },
  medidores: {
    title: 'Medidores',
    singular: 'medidor',
    icon: "◴",
    description: 'Mantenha o cadastro dos equipamentos de medição.',
    fields: [['numeroSerie', 'Número de série', true], ['fabricante', 'Fabricante'], ['modelo', 'Modelo']],
  },
  instalacoes: {
    title: 'Instalações',
    singular: 'instalação',
    icon: "⇄",
    description: 'Vincule clientes, imóveis e medidores e acompanhe o histórico.',
    fields: [
      ['clienteId', 'ID do cliente', true],
      ['imovelId', 'ID do imóvel', true],
      ['medidorId', 'ID do medidor', true],
      ['dataInicio', 'Data de início', true],
      ['diaEmissao', 'Dia de emissão da fatura (1 a 31)'],
      ['observacoes', 'Observações'],
    ],
  },
  faturas: {
    title: 'Faturas',
    singular: 'fatura',
    icon: "▤",
    description: 'Consulte as faturas emitidas e filtre por competência.',
    fields: [],
    readOnly: true,
  },
}

export const labels = {
  id: 'ID',
  endereco: 'Endereço',
  enderecoCobranca: 'Endereço de cobrança',
  dataFim: 'Encerramento',
  ativa: 'Ativa',
  falhaEmissaoFatura: 'Falha na emissão da fatura',
  ...Object.fromEntries(addressFields),
  ...Object.fromEntries(Object.values(resources).flatMap(resource => resource.fields.map(([key, label]) => [key, label]))),
}

export function fieldLabel(key) {
  return labels[key] || key.replace(/[A-Z]/g, letter => ' ' + letter.toLowerCase())
}

export function recordColumns(resource, rows) {
  if (resource === 'imoveis') {
    return addressFields.filter(([key]) => ['logradouro', 'numero', 'uf', 'cidade'].includes(key))
  }
  if (resource === 'instalacoes') {
    return [['clienteId', 'Cliente'], ['imovelId', 'Imóvel'], ['medidorId', 'Medidor'], ['dataInicio', 'Início'], ['status', 'Situação']]
  }
  if (resource === 'faturas') {
    return [...new Set(rows.flatMap(row => Object.keys(row).filter(key => key !== 'id')))]
      .map(key => [key, fieldLabel(key)])
  }
  return resources[resource].fields
}
