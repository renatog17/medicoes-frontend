const base = (import.meta.env?.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

const statusMessages = {
  400: 'Confira os dados informados.',
  404: 'Registro não encontrado.',
  409: 'Conflito: registro duplicado ou vinculado a uma instalação.',
}

export async function api(path, method = 'GET', body, signal) {
  let response
  try {
    response = await fetch(base + path, {
      method,
      signal,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}),
    })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw Error('Não foi possível conectar à API. Verifique se o backend está em execução.', { cause: err })
  }

  const text = await response.text()
  let data
  try {
    // Keep meter readings as strings to preserve the API's decimal precision.
    data = text ? JSON.parse(text.replace(/("leitura"\s*:\s*)(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g, '$1"$2"')) : null
  } catch {
    data = null
  }

  if (!response.ok) {
    const error = Error(data?.detail || data?.message || statusMessages[response.status] || 'Erro HTTP ' + response.status)
    error.status = response.status
    error.errors = data?.errors || []
    throw error
  }
  if (response.status !== 204 && !data) throw Error('Resposta inesperada da API. Verifique a URL configurada.')
  return data
}
