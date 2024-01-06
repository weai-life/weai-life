import { UserRound } from 'lucide-react'
import type { PeopleQuery } from 'types/graphql'
import { Avatar, AvatarFallback, AvatarImage, Button, Card } from 'weai-ui'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

export const QUERY = gql`
  query PeopleQuery($id: Int!) {
    people(id: $id) {
      name
      avatarUrl
      isConnected
      tools {
        id
        title
        icon
        url
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ people }: CellSuccessProps<PeopleQuery>) => {
  const { isAuthenticated, getToken } = useAuth()

  async function handleClickTool(toolItem) {
    if (!isAuthenticated) {
      window.location.href = `https://auth.weai.life?redirectUrl=${location.href}`
    } else {
      window.location.href = `${toolItem.url}?token=${await getToken()}`
    }
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center mt-6">
        <Avatar>
          <AvatarImage src={people.avatarUrl + '!avatar'} />
          <AvatarFallback>
            <UserRound />
          </AvatarFallback>
        </Avatar>
        <div className="text-2xl tracking-wider subpixel-antialiased">
          {people.name}
        </div>
        {people.isConnected ? (
          <Button
            disabled
            variant="outline"
            size="sm"
            className="mt-3 rounded-full"
          >
            Connected
          </Button>
        ) : (
          <Button variant="outline" size="lg" className="mt-3 rounded-full">
            Connect
          </Button>
        )}
      </div>
      <div className="text-2xl mt-10">Used tools</div>
      <div className="grid grid-cols-3 gap-4 mt-2">
        {people.tools.map((item) => {
          return (
            <Card
              key={item.id}
              className="p-4 rounded-xl"
              onClick={() => handleClickTool(item)}
            >
              {item.title}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
