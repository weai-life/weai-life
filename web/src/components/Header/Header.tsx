import { MenuIcon } from 'lucide-react'

import { Link } from '@redwoodjs/router'

import CurrentUser from '../CurrentUser/CurrentUser'

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container h-14 flex items-center justify-between">
        {/* left */}
        <div className="flex items-center justify-between">
          <div className="md:hidden flex items-center h-6 w-6 mr-2">
            <button aria-label="Toggle menu">
              <MenuIcon />
            </button>
          </div>
          <Link
            to="/"
            className="w-52 md:w-fit text-xl font-bold tracking-wider whitespace-nowrap overflow-hidden text-clip subpixel-antialiased tracking-wider"
          >
            WeAI
          </Link>
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
