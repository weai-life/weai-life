const DEFAULT_PAGE_SIZE = 20
const MAX_PAGE_SIZE = 100

type QueryFunArgs = {
  skip: number
  take: number
}
type QueryFun = ({ skip, take }: QueryFunArgs) => Promise<unknown[]>

type PaginateArgs = {
  page?: number
  pageSize?: number
  fun: QueryFun
}

export async function paginate({ page, pageSize, fun }: PaginateArgs) {
  page = sanitizePage(page)
  pageSize = sanitizePageSize(pageSize)

  const skip = (page - 1) * pageSize
  const data = await fun({
    skip,
    take: pageSize + 1,
  })

  const hasNext = data.length === pageSize + 1

  return {
    data: data.slice(0, pageSize),
    hasNext,
  }
}

function sanitizePage(page = 1) {
  return page < 1 ? 1 : page
}

// paseSize 范围 1 ~ MAX_PAGE_SIZE
function sanitizePageSize(pageSize = DEFAULT_PAGE_SIZE) {
  return Math.max(1, Math.min(pageSize, MAX_PAGE_SIZE))
}
