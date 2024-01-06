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
  <div className="grid grid-cols-4 gap-4 mt-4">
    <div className="rounded-xl flex-col justify-center items-center">
      <Skeleton className="h-[50px] w-[50px] mx-auto" />
      <div className="mt-2 w-full flex-col justify-center items-center">
        <Skeleton className="h-6 w-[40px] mx-auto" />
      </div>
    </div>
    <div className="rounded-xl flex-col justify-center items-center">
      <Skeleton className="h-[50px] w-[50px] mx-auto" />
      <div className="mt-2 w-full flex-col justify-center items-center">
        <Skeleton className="h-6 w-[40px] mx-auto" />
      </div>
    </div>
    <div className="rounded-xl flex-col justify-center items-center">
      <Skeleton className="h-[50px] w-[50px] mx-auto" />
      <div className="mt-2 w-full flex-col justify-center items-center">
        <Skeleton className="h-6 w-[40px] mx-auto" />
      </div>
    </div>
    <div className="rounded-xl flex-col justify-center items-center">
      <Skeleton className="h-[50px] w-[50px] mx-auto" />
      <div className="mt-2 w-full flex-col justify-center items-center">
        <Skeleton className="h-6 w-[40px] mx-auto" />
      </div>
    </div>
    <div className="rounded-xl flex-col justify-center items-center">
      <Skeleton className="h-[50px] w-[50px] mx-auto" />
      <div className="mt-2 w-full flex-col justify-center items-center">
        <Skeleton className="h-6 w-[40px] mx-auto" />
      </div>
    </div>
    <div className="rounded-xl flex-col justify-center items-center">
      <Skeleton className="h-[50px] w-[50px] mx-auto" />
      <div className="mt-2 w-full flex-col justify-center items-center">
        <Skeleton className="h-6 w-[40px] mx-auto" />
      </div>
    </div>
    <div className="rounded-xl flex-col justify-center items-center">
      <Skeleton className="h-[50px] w-[50px] mx-auto" />
      <div className="mt-2 w-full flex-col justify-center items-center">
        <Skeleton className="h-6 w-[40px] mx-auto" />
      </div>
    </div>
    <div className="rounded-xl flex-col justify-center items-center">
      <Skeleton className="h-[50px] w-[50px] mx-auto" />
      <div className="mt-2 w-full flex-col justify-center items-center">
        <Skeleton className="h-6 w-[40px] mx-auto" />
      </div>
    </div>
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
    <div className="grid grid-cols-4 gap-x-2 mt-10 gap-y-16">
      {usedTools.map((item) => {
        return (
          <Button
            key={item.id}
            variant="ghost"
            onClick={() => handleClickTool(item)}
            className="p-0 rounded-xl flex-col"
          >
            <div className="border p-2 mb-2 rounded-xl">
              <img
                src={`data:image/svg+xml;utf8,${encodeURIComponent(
                  item.tool.icon
                )}`}
                alt=""
              />
            </div>
            <div>{item.tool.title}</div>
          </Button>
        )
      })}
    </div>
  )
}
