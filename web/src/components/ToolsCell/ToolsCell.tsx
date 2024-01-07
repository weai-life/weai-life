import type { ToolsQuery } from 'types/graphql'
import { Skeleton } from 'weai-ui'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

export const QUERY = gql`
  query ToolsQuery {
    tools {
      id
      title
      url
      description
      icon
    }
  }
`

export const Loading = () => (
  <div className="mt-4">
    {[1, 2, 3, 4, 5, 6].map((item) => {
      return (
        <div key={item} className="flex items-center flex-start w-full">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="ml-2 border-b py-3 w-full">
            <Skeleton className="h-8 w-[120px]" />
            <Skeleton className="h-6 w-[200px] mt-2" />
          </div>
        </div>
      )
    })}
  </div>
)

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => {
  return <div style={{ color: 'red' }}>Error: {error?.message}</div>
}

export const Success = ({ tools }: CellSuccessProps<ToolsQuery>) => {
  const { isAuthenticated, getToken } = useAuth()

  async function handleClickTool(toolItem) {
    if (!isAuthenticated) {
      window.location.href = `https://auth.weai.life?redirectUrl=${location.href}`
    } else {
      window.location.href = `${toolItem.url}?token=${await getToken()}`
    }
  }

  return (
    <div className="mt-4 text-left pb-10">
      {tools.map((item) => {
        return (
          <div
            key={item.id}
            className="flex items-center flex-start w-full"
            onClick={() => handleClickTool(item)}
          >
            <div className="border p-2 rounded-xl w-12 h-12 flex justify-center items-center">
              <img
                src={`data:image/svg+xml;utf8,${encodeURIComponent(item.icon)}`}
                alt=""
              />
            </div>
            <div className="ml-2 border-b py-3 w-full">
              <div className="text-lg font-semibold">{item.title}</div>
              <div>{item.description}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
