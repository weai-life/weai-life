import { Button } from 'weai-ui'

import { MetaTags } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

const ProfilePage = () => {
  const { isAuthenticated, getToken } = useAuth()

  async function handleGotoEditProfile() {
    if (!isAuthenticated) {
      window.location.href = `https://auth.weai.life?redirectUrl=${location.href}`
    } else {
      window.location.href = `https://settings.weai.life/edit-profile?token=${await getToken()}`
    }
  }

  return (
    <div className="container">
      <MetaTags title="Profile" description="Profile Page" />

      <div className="mt-6 flex items-center justify-center">
        <div className="text-3xl tracking-wider subpixel-antialiased">
          Profile
        </div>
      </div>

      <Button onClick={handleGotoEditProfile} variant="link">
        Edit Profile
      </Button>
    </div>
  )
}

export default ProfilePage
