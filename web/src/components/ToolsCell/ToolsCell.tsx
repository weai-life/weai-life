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
    }
  }
`

export const Loading = () => (
  <div>
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="mb-2">
          <Skeleton className="h-8 w-[120px]" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-6 w-[200px]" />
        </CardDescription>
      </CardHeader>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle className="mb-2">
          <Skeleton className="h-8 w-[120px]" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-6 w-[200px]" />
        </CardDescription>
      </CardHeader>
    </Card>
  </div>
)

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ tools }: CellSuccessProps<ToolsQuery>) => {
  const { isAuthenticated, getToken } = useAuth()

  async function handleClickTool(toolItem) {
    if (!isAuthenticated) {
      window.location.href = `https://auth.weai.life?redirectUrl=${location.href}`
    } else {
      window.open(`${toolItem.url}?token=${await getToken()}`)
    }
  }

  return (
    <div className="mt-4">
      {tools.map((item) => {
        return (
          <Card
            key={item.id}
            className="mb-4"
            onClick={() => handleClickTool(item)}
          >
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        )
      })}
    </div>
  )
}
