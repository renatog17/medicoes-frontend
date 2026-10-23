const base = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')
export async function api(path, method = 'GET', body, signal) {
  let response
  try { response = await fetch(base + path, { method, signal, headers: { Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}) }, ...(body ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}) }) }
  catch (e) { if (e.name === 'AbortError') throw e; throw Error('Não foi possível conectar à API. Verifique se o backend está em execução.', { cause: e }) }
  const text = await response.text()
  let data
  try { data = text ? JSON.parse(text.replace(/("leitura"\s*:\s*)(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g, '$1"$2"')) : null } catch { data = null }
  if (!response.ok) {
    const error = Error(data?.detail || data?.message || ({400:'Confira os dados informados.',404:'Registro não encontrado.',409:'Conflito: registro duplicado ou vinculado a uma instalação.'}[response.status]) || `Erro HTTP ${response.status}`)
    error.status = response.status
    error.errors = data?.errors || []
    throw error
  }
  if (response.status !== 204 && !data) throw Error('Resposta inesperada da API. Verifique a URL configurada.')
  return data
}
export function pageData(data) {
  if (Array.isArray(data)) return { content:data, totalElements:data.length, totalPages:1 }
  if (!Array.isArray(data?.content)) throw Error('A listagem da API não contém content.')
  return { content:data.content, totalElements:data.totalElements ?? data.page?.totalElements ?? data.content.length, totalPages:data.totalPages ?? data.page?.totalPages ?? 1 }
}
export function validCpf(value) {
  if (!/^\d{11}$/.test(value) || /^(\d)\1{10}$/.test(value)) return false
  return [9,10].every(n => { const remainder = [...value.slice(0,n)].reduce((sum,v,i) => sum + Number(v)*(n+1-i),0)*10%11; return (remainder===10?0:remainder)===Number(value[n]) })
}
