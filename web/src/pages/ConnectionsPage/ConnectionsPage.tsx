import { MetaTags } from '@redwoodjs/web'

import ConnectionsCell from 'src/components/ConnectionsCell'

const ConnectionsPage = () => {
  return (
    <>
      <MetaTags title="Connections" description="Connections page" />

      <h1>ConnectionsPage</h1>
      <ConnectionsCell />
    </>
  )
}

export default ConnectionsPage
