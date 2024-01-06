import type { SentConnectionsQuery } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

export const QUERY = gql`
  query SentConnectionsQuery {
    sentConnections {
      id
      senderId
      receiverId
      status
      createdAt
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
  sentConnections,
}: CellSuccessProps<SentConnectionsQuery>) => {
  return (
    <div>
      {sentConnections.map((item) => {
        return (
          <div key={item.id} className="border-b py-2 text-left">
            <div>{item.receiver.name}</div>
          </div>
        )
      })}
    </div>
  )
}
