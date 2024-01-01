import type { ToolsQuery } from 'types/graphql'
import { Card, CardDescription, CardHeader, CardTitle } from 'weai-ui'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

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

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ tools }: CellSuccessProps<ToolsQuery>) => {
  return (
    <div className="mt-4">
      {tools.map((item) => {
        return (
          <Card key={item.id} className="mb-4">
            <CardHeader>
              <CardTitle>
                <a href={item.url}>{item.title}</a>
              </CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        )
      })}
    </div>
  )
}
