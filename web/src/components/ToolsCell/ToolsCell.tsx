import type { ToolsQuery } from 'types/graphql'
import { Card, CardDescription, CardHeader, CardTitle, Skeleton } from 'weai-ui'

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
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="mb-2">
          <Skeleton className="h-8 w-[120px]" />
        </CardTitle>
        <Skeleton className="h-6 w-[200px]" />
      </CardHeader>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle className="mb-2">
          <Skeleton className="h-8 w-[120px]" />
        </CardTitle>
        <Skeleton className="h-6 w-[200px]" />
      </CardHeader>
    </Card>
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
            <div className="border p-2 rounded-xl w-12 h-12">
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
