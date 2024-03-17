import { UserRound } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage, Button } from 'weai-ui'

import { useAuth } from 'src/auth'

const CurrentUser = () => {
  const { isAuthenticated, currentUser } = useAuth()

  function handleGotoLogin() {
    window.location.href = `https://auth.weai.life?redirectUrl=${location.href}`
  }

  if (!isAuthenticated) {
    return (
      <Button
        variant="link"
        size="lg"
        className="text-lg"
        onClick={handleGotoLogin}
      >
        Log in
      </Button>
    )
  }

  return (
    <div className="flex shrink-0 items-center">
      <Avatar>
        <AvatarImage src={currentUser?.avatarUrl + '!avatar'} />
        <AvatarFallback>
          <UserRound />
        </AvatarFallback>
      </Avatar>
      <div className="ml-2 ">{currentUser?.name}</div>
    </div>
  )
}

export default CurrentUser
