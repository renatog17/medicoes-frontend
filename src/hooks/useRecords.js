import { useEffect, useState } from 'react'
import { recordsApi } from '../services/recordsApi.js'

export default function useRecords(resource, fixedFilters = {}) {
  const [page, setPage] = useState(0)
  const [filters, setFilters] = useState({})
  const [data, setData] = useState({ content: [], totalElements: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [revision, setRevision] = useState(0)
  const query = new URLSearchParams({ page, size: 20, ...filters, ...fixedFilters }).toString()

  useEffect(() => {
    const controller = new AbortController()
    // Synchronize the loading indicator with the requested list.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    setError('')
    recordsApi.list(resource, query, controller.signal)
      .then(result => {
        if (!controller.signal.aborted) setData(result)
      })
      .catch(err => {
        if (!controller.signal.aborted) setError(err.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [resource, query, revision])

  function applyFilters(nextFilters) {
    setPage(0)
    setFilters(nextFilters)
  }

  function refresh() {
    setRevision(value => value + 1)
  }

  function afterRemoval() {
    if (data.content.length === 1 && page > 0) setPage(value => value - 1)
    refresh()
  }

  return { page, setPage, filters, applyFilters, data, loading, error, refresh, afterRemoval }
}
