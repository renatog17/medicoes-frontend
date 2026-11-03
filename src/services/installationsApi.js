import { recordsApi } from './recordsApi.js'
import { measurementsApi } from './measurementsApi.js'
import { reading } from '../utils/measurements.js'

export const installationsApi = {
  async createWithInitialReading(body, value, onCreated, existingInstallation) {
    const initialReading = reading(value)
    const installation = existingInstallation || {
      ...body,
      ...await recordsApi.create('instalacoes', body),
    }
    onCreated(installation)
    await measurementsApi.create(installation, installation.dataInicio, initialReading)
    return installation
  },
}
