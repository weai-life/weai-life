import type { UsedToolsQuery } from 'types/graphql'
import { Button, Skeleton } from 'weai-ui'

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
  <div className="mt-10 grid grid-cols-4 gap-x-2 gap-y-10">
    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => {
      return (
        <div
          key={item}
          className="flex-col items-center justify-center rounded-xl p-0"
        >
          <Skeleton className="mx-auto mb-2 h-12 w-12 rounded-xl" />
          <Skeleton className="mx-auto h-6 w-[40px]" />
        </div>
      )
    })}
  </div>
)

export const Empty = () => (
  <div className="my-8 italic leading-loose tracking-wide opacity-90">
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
        <div className="mb-2 opacity-50">View used tools need log in</div>
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
    <div className="mt-10 grid grid-cols-4 gap-x-2 gap-y-10">
      {usedTools.map((item) => {
        return (
          <div
            key={item.id}
            onClick={() => handleClickTool(item)}
            className="flex-col items-center justify-center rounded-xl p-0"
          >
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl border p-2">
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
