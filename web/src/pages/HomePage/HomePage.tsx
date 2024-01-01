import { MetaTags } from '@redwoodjs/web'

import ToolsCell from 'src/components/ToolsCell'

const HomePage = () => {
  return (
    <div className="container">
      <MetaTags title="Home" description="Home page" />

      <ToolsCell />
    </div>
  )
}

export default HomePage
