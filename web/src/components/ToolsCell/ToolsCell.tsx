import type { ToolsQuery } from 'types/graphql'

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
    <div className="container">
      {tools.map((item) => {
        return (
          <div key={item.id} className="mb-4">
            <a href={item.url}>{item.title}</a>
            <div>{item.description}</div>
          </div>
        )
      })}
    </div>
  )
}
