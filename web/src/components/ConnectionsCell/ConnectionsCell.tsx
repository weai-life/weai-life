import type { ConnectionsQuery } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

export const QUERY = gql`
  query ConnectionsQuery {
    connections {
      id
      senderId
      receiverId
      status
      sender {
        id
        name
        email
      }
      receiver {
        id
        name
        email
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  connections,
}: CellSuccessProps<ConnectionsQuery>) => {
  return (
    <ul>
      {connections.map((item) => {
        return <li key={item.id}>{JSON.stringify(item)}</li>
      })}
    </ul>
  )
}
