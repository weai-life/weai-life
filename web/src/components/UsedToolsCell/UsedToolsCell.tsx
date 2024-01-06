import type { UsedToolsQuery } from 'types/graphql'
import { Button, Card, CardTitle, Skeleton } from 'weai-ui'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

export const QUERY = gql`
  query UsedToolsQuery {
    usedTools {
      id
      toolId
      tool {
        id
        title
        url
        icon
      }
    }
  }
`

export const Loading = () => (
  <div className="grid grid-cols-3 gap-4 mt-4">
    <Card className="p-4 rounded-xl">
      <CardTitle>
        <Skeleton className="h-8 w-[80px]" />
      </CardTitle>
    </Card>
    <Card className="p-4 rounded-xl">
      <CardTitle>
        <Skeleton className="h-8 w-[80px]" />
      </CardTitle>
    </Card>
    <Card className="p-4 rounded-xl">
      <CardTitle>
        <Skeleton className="h-8 w-[80px]" />
      </CardTitle>
    </Card>
    <Card className="p-4 rounded-xl">
      <CardTitle>
        <Skeleton className="h-8 w-[80px]" />
      </CardTitle>
    </Card>
    <Card className="p-4 rounded-xl">
      <CardTitle>
        <Skeleton className="h-8 w-[80px]" />
      </CardTitle>
    </Card>
    <Card className="p-4 rounded-xl">
      <CardTitle>
        <Skeleton className="h-8 w-[80px]" />
      </CardTitle>
    </Card>
  </div>
)

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => {
  const { isAuthenticated } = useAuth()

  function handleGotoLogin() {
    window.location.href = `https://auth.weai.life?redirectUrl=${location.href}`
  }

  if (!isAuthenticated) {
    return (
      <div className="mt-6">
        <div className="opacity-50 mb-2">View used tools need log in</div>
        <Button onClick={handleGotoLogin}>Log in</Button>
      </div>
    )
  } else {
    return <div style={{ color: 'red' }}>Error: {error?.message}</div>
  }
}

export const Success = ({ usedTools }: CellSuccessProps<UsedToolsQuery>) => {
  const { getToken } = useAuth()

  async function handleClickTool(toolItem) {
    window.location.href = `${toolItem.tool.url}?token=${await getToken()}`
  }

  return (
    <div className="grid grid-cols-3 gap-4 mt-4">
      {usedTools.map((item) => {
        return (
          <Card
            key={item.id}
            onClick={() => handleClickTool(item)}
            className="p-4 rounded-xl"
          >
            {item.tool.title}
          </Card>
        )
      })}
    </div>
  )
}
