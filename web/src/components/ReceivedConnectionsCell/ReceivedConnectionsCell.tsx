import type { ReceivedConnectionsQuery } from 'types/graphql'
import { Button } from 'weai-ui'

import {
  type CellSuccessProps,
  type CellFailureProps,
  useMutation,
} from '@redwoodjs/web'

export const QUERY = gql`
  query ReceivedConnectionsQuery {
    receivedConnections {
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

const ACCEPT_CONNECTION = gql`
  mutation AccpetConnectionMutation($id: Int!) {
    acceptConnection(id: $id) {
      id
      status
    }
  }
`

export const Success = ({
  receivedConnections,
}: CellSuccessProps<ReceivedConnectionsQuery>) => {
  const [accept] = useMutation(ACCEPT_CONNECTION, {
    refetchQueries: [{ query: QUERY }],
  })

  const handleAccept = (id: number) => {
    accept({
      variables: {
        id,
      },
    })
  }

  return (
    <div>
      {receivedConnections.map((item) => {
        return (
          <div
            key={item.id}
            className="border-b py-2 text-left flex justify-between items-center"
          >
            <div>{item.sender.name}</div>
            <div className="flex">
              <Button size="sm" variant="ghost">
                Ignore
              </Button>
              <Button size="sm" onClick={() => handleAccept(item.id)}>
                Accpet
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
