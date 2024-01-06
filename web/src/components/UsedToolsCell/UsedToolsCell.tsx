import type { UsedToolsQuery } from 'types/graphql'
import { Card } from 'weai-ui'

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
        icon
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

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
            onClick={handleClickTool}
            className="p-4 rounded-xl"
          >
            {item.tool.title}
          </Card>
        )
      })}
    </div>
  )
}
