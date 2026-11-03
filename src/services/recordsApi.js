import { api } from './api.js'
import { pageData } from '../utils/pagination.js'
import { resolveInstallationRelations } from '../utils/installationRelations.js'

function recordPath(resource, id) {
  return '/' + resource + '/' + encodeURIComponent(id)
}

export const recordsApi = {
  async list(resource, params, signal) {
    const data = await api('/' + resource + '?' + new URLSearchParams(params), 'GET', undefined, signal)
    const page = pageData(data)
    if (resource === 'instalacoes') {
      page.content = await resolveInstallationRelations(page.content,
        (related, id) => api(recordPath(related, id), 'GET', undefined, signal))
    }
    return page
  },
  async get(resource, id) {
    const record = await api(recordPath(resource, id))
    if (resource !== 'instalacoes') return record
    const [resolved] = await resolveInstallationRelations([record],
      (related, relatedId) => api(recordPath(related, relatedId)))
    return resolved
  },
  create(resource, body) {
    return api('/' + resource, 'POST', body)
  },
  update(resource, id, body) {
    return api(recordPath(resource, id), 'PUT', body)
  },
  remove(resource, id) {
    return api(recordPath(resource, id), 'DELETE')
  },
  closeInstallation(id, body) {
    return api(recordPath('instalacoes', id) + '/encerramento', 'POST', body)
  },
}
