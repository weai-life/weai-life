import { UserRound } from 'lucide-react'
import type { ConnectionsQuery } from 'types/graphql'
import { Avatar, AvatarFallback, AvatarImage, Button } from 'weai-ui'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
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

const Introduction = () => {
  return (
    <div className="tracking-wide leading-loose my-4 opacity-90 italic">
      <div>
        Create your connection with friends, family, partner. Share and use good
        tools together.
      </div>
    </div>
  )
}

export const Empty = () => (
  <div className="mt-6 text-center">
    <Introduction />
    <Link to={routes.invitations()} className="text-primary underline">
      Create a connection
    </Link>
  </div>
)

export const Failure = ({ error }: CellFailureProps) => {
  const { isAuthenticated } = useAuth()

  function handleGotoLogin() {
    window.location.href = `https://auth.weai.life?redirectUrl=${location.href}`
  }

  if (!isAuthenticated) {
    return (
      <div className="mt-6 text-center">
        <Introduction />
        <div className="opacity-50 mt-6 mb-2">
          View self connections need log in
        </div>
        <Button onClick={handleGotoLogin}>Log in</Button>
      </div>
    )
  } else {
    return <div style={{ color: 'red' }}>Error: {error?.message}</div>
  }
}

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
