import { MenuIcon } from 'lucide-react'
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from 'weai-ui'

import { Link, routes } from '@redwoodjs/router'

import CurrentUser from '../CurrentUser/CurrentUser'

const Header = () => {
  function handleGotoLogin() {
    window.location.href = `https://auth.weai.life?redirectUrl=${location.href}`
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container w-full h-14 flex items-center justify-between">
        {/* left */}
        <div className="flex items-center justify-between w-full">
          <Link
            to="/"
            className="text-2xl font-bold tracking-wider subpixel-antialiased"
          >
            WeAI
          </Link>
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <MenuIcon className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="flex-col">
                <SheetTitle>WeAI</SheetTitle>
                <SheetDescription>Use tools to love life.</SheetDescription>
                <Link
                  to={routes.tools()}
                  className="w-full block py-2 mt-4 border-b"
                >
                  Tools
                </Link>
                <Link
                  to={routes.pages()}
                  className="w-full block py-2 border-b"
                >
                  Pages
                </Link>
                <Link to={routes.me()} className="w-full block py-2 border-b">
                  Me
                </Link>
                <div className="text-center mt-6">
                  <Button className="rounded-lg" onClick={handleGotoLogin}>
                    Log in
                  </Button>
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
