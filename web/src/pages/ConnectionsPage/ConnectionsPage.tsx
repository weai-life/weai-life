import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import ConnectionsCell from 'src/components/ConnectionsCell'

const ConnectionsPage = () => {
  return (
    <div className="container">
      <MetaTags title="Connections" description="Use tools to love life." />

      <div className="flex items-center justify-between mt-6">
        <div className="text-3xl tracking-wider subpixel-antialiased">
          Connections
        </div>
        <Link to={routes.invitations()}>Invitations</Link>
      </div>

      <ConnectionsCell />
    </div>
  )
}

export default ConnectionsPage
