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
      <div className="container w-full h-14 flex items-center justify-between">
        {/* left */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-end">
            <Link
              to="/"
              className="text-2xl font-bold tracking-wider subpixel-antialiased"
            >
              WeAI
            </Link>
            <div className="hidden md:flex items-center">
              <Link to={routes.tools()} className="ml-6 text-lg">
                Tools
              </Link>
              <Link to={routes.connections()} className="ml-3 text-lg">
                Connections
              </Link>
              <Link to={routes.connections()} className="ml-3 text-lg">
                Data
              </Link>
              <Link to={routes.connections()} className="ml-3 text-lg">
                Settings
              </Link>
            </div>
          </div>
          <div className="md:hidden flex items-center">
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
                  className="w-full block mt-4 border-b text-left py-3"
                >
                  Tools
                </Link>
                <Link
                  to={routes.connections()}
                  onClick={() => setOpenSheet(false)}
                  className="w-full block border-b text-left py-3"
                >
                  Connections
                </Link>
                <Link
                  to={routes.connections()}
                  onClick={() => setOpenSheet(false)}
                  className="w-full block border-b text-left py-3"
                >
                  Data
                </Link>
                <Link
                  to={routes.connections()}
                  onClick={() => setOpenSheet(false)}
                  className="w-full block border-b text-left py-3"
                >
                  Settings
                </Link>
                <div className="text-center mt-6">
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
        <div className="hidden md:flex items-center">
          <CurrentUser />
        </div>
      </div>
    </header>
  )
}

export default Header
