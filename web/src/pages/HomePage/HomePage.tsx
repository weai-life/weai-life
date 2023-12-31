import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import ToolsCell from 'src/components/ToolsCell'

const HomePage = () => {
  return (
    <>
      <MetaTags title="Tools" description="Home page" />

      <h1>weai</h1>
      <p>
        Find me in <code>./web/src/pages/HomePage/HomePage.tsx</code>
      </p>
      <p>
        My default route is named <code>home</code>, link to me with `
        <Link to={routes.home()}>Home</Link>`
      </p>

      <ToolsCell />
    </>
  )
}

export default HomePage
