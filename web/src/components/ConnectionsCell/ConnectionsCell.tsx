import { UserRound } from 'lucide-react'
import type { ConnectionsQuery } from 'types/graphql'
import { Avatar, AvatarFallback, AvatarImage } from 'weai-ui'

import { Link, routes } from '@redwoodjs/router'
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
        avatarUrl
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
    <div className="mt-4">
      {connections.map((item) => {
        return (
          <Link
            to={routes.people({ id: item.senderId })}
            key={item.id}
            className="border-b py-3 text-left flex items-center"
          >
            <Avatar>
              <AvatarImage src={item.sender.avatarUrl + '!avatar'} />
              <AvatarFallback>
                <UserRound />
              </AvatarFallback>
            </Avatar>
            <div className="ml-2">{item.sender.name}</div>
          </Link>
        )
      })}
    </div>
  )
}
