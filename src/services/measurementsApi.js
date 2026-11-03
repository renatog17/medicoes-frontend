import { api } from './api.js'
import { measurementBody } from '../utils/measurements.js'
import { recordsApi } from './recordsApi.js'

export const measurementsApi = {
  list(params = {}, signal) {
    return recordsApi.list('medicoes', params, signal)
  },
  get(id) {
    return recordsApi.get('medicoes', id)
  },
  create(installation, date, reading) {
    return api('/medicoes', 'POST', measurementBody(installation, date, reading))
  },
}
