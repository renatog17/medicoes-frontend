export function pageData(data) {
  if (Array.isArray(data)) {
    return { content: data, totalElements: data.length, totalPages: 1 }
  }
  if (!Array.isArray(data?.content)) throw Error('A listagem da API não contém content.')
  return {
    content: data.content,
    totalElements: data.totalElements ?? data.page?.totalElements ?? data.content.length,
    totalPages: data.totalPages ?? data.page?.totalPages ?? 1,
  }
}
