import { useState } from 'react'

import { MenuIcon, UserRound } from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from 'weai-ui'

import { Link, routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'

import CurrentUser from '../CurrentUser/CurrentUser'

const Header = () => {
  const { isAuthenticated, currentUser } = useAuth()
  const [openSheet, setOpenSheet] = useState(false)

  function handleGotoLogin() {
    window.location.href = `https://auth.weai.life?redirectUrl=${location.href}`
  }

  function handleLogout() {
    localStorage.removeItem('TOKEN')
    setOpenSheet(false)
    window.location.reload()
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 w-full items-center justify-between">
        {/* left */}
        <div className="flex w-full items-center justify-between">
          <div className="flex items-end">
            <Link
              to="/"
              className="text-2xl font-bold tracking-wider subpixel-antialiased"
            >
              WeAI
            </Link>
            <div className="ml-12 hidden items-center md:flex">
              <Link to={routes.tools()} className="text-lg">
                Tools
              </Link>
              <Link to={routes.connections()} className="ml-6 text-lg">
                Connections
              </Link>
              <Link to={routes.data()} className="ml-6 text-lg">
                Data
              </Link>
              <Link to={routes.profile()} className="ml-6 text-lg">
                Profile
              </Link>
            </div>
          </div>
          <div className="flex items-center md:hidden">
            <Sheet open={openSheet} onOpenChange={setOpenSheet}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <MenuIcon className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="flex-col">
                {isAuthenticated && currentUser?.name ? (
                  <div className="flex flex-col">
                    <Avatar>
                      <AvatarImage src={currentUser?.avatarUrl + '!avatar'} />
                      <AvatarFallback>
                        <UserRound />
                      </AvatarFallback>
                    </Avatar>
                    <div>{currentUser?.name}</div>
                  </div>
                ) : (
                  <>
                    <SheetTitle>WeAI</SheetTitle>
                    <SheetDescription>Use tools to love life.</SheetDescription>
                  </>
                )}

                <Link
                  to={routes.tools()}
                  onClick={() => setOpenSheet(false)}
                  className="mt-4 block w-full border-b py-3 text-left"
                >
                  Tools
                </Link>
                <Link
                  to={routes.connections()}
                  onClick={() => setOpenSheet(false)}
                  className="block w-full border-b py-3 text-left"
                >
                  Connections
                </Link>
                <Link
                  to={routes.data()}
                  onClick={() => setOpenSheet(false)}
                  className="block w-full border-b py-3 text-left"
                >
                  Data
                </Link>
                <Link
                  to={routes.profile()}
                  onClick={() => setOpenSheet(false)}
                  className="block w-full border-b py-3 text-left"
                >
                  Profile
                </Link>
                <div className="mt-6 text-center">
                  {!isAuthenticated ? (
                    <Button className="rounded-lg" onClick={handleGotoLogin}>
                      Log in
                    </Button>
                  ) : (
                    <Button variant="destructive" onClick={handleLogout}>
                      Log out
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        {/* right */}
        <div className="hidden items-center md:flex">
          <CurrentUser />
        </div>
      </div>
    </header>
  )
}

export default Header
