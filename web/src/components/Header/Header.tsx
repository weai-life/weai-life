import { MenuIcon } from 'lucide-react'
import { Button } from 'weai-ui'

import { Link } from '@redwoodjs/router'

import CurrentUser from '../CurrentUser/CurrentUser'

const Header = () => {
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
            <Button variant="outline" size="sm">
              <MenuIcon className="h-6 w-6" />
            </Button>
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
