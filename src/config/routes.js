export const sectionPaths = {
  clientes: '/clientes',
  imoveis: '/imoveis',
  medidores: '/medidores',
  instalacoes: '/instalacoes',
  faturas: '/faturas',
}

export function sectionFromPath(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/clientes'
  return Object.keys(sectionPaths).find(section => sectionPaths[section] === path) || null
}
