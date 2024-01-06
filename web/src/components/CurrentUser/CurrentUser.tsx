import { UserRound } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage, Button } from 'weai-ui'

import { useAuth } from 'src/auth'

const CurrentUser = () => {
  const { isAuthenticated, currentUser } = useAuth()

  if (!isAuthenticated) {
    return <Button variant="link">Log in</Button>
  }

  return (
    <div>
      <div className="flex items-center">
        <Avatar>
          <AvatarImage src={currentUser?.avatarUrl + '!avatar'} />
          <AvatarFallback>
            <UserRound />
          </AvatarFallback>
        </Avatar>
        <div className="ml-2">{currentUser?.name}</div>
      </div>
    </div>
  )
}

export default CurrentUser
