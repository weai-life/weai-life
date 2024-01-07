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
  <div className="grid grid-cols-4 gap-x-2 mt-10 gap-y-10">
    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => {
      return (
        <div
          key={item}
          className="p-0 rounded-xl flex-col items-center justify-center"
        >
          <Skeleton className="h-12 w-12 mx-auto mb-2 rounded-xl" />
          <Skeleton className="h-6 w-[40px] mx-auto" />
        </div>
      )
    })}
  </div>
)

export const Empty = () => (
  <div className="tracking-wide leading-loose my-8 opacity-90 italic">
    <div>Not yet used any tools.</div>
    <div>The tools you used in marketplace will be here.</div>
  </div>
)

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
    <div className="grid grid-cols-4 gap-x-2 mt-10 gap-y-10">
      {usedTools.map((item) => {
        return (
          <div
            key={item.id}
            onClick={() => handleClickTool(item)}
            className="p-0 rounded-xl flex-col items-center justify-center"
          >
            <div className="border p-2 mb-2 rounded-xl w-12 h-12 mx-auto flex justify-center items-center">
              <img
                src={`data:image/svg+xml;utf8,${encodeURIComponent(
                  item.tool.icon
                )}`}
                alt=""
              />
            </div>
            <div className="mx-auto">{item.tool.title}</div>
          </div>
        )
      })}
    </div>
  )
}
