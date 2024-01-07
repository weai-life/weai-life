import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import ConnectionsCell from 'src/components/ConnectionsCell'

const ConnectionsPage = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="container">
      <MetaTags title="Connections" description="Use tools to love life." />

      <div className="flex-col items-center justify-center mt-6 text-center">
        <div className="text-3xl tracking-wider subpixel-antialiased">
          Connections
        </div>
        {isAuthenticated && (
          <Link to={routes.invitations()} className="text-primary">
            Manage Invitations
          </Link>
        )}
      </div>

      <ConnectionsCell />
    </div>
  )
}

export default ConnectionsPage
