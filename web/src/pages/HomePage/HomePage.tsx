import { MetaTags } from '@redwoodjs/web'

import ToolsCell from 'src/components/ToolsCell'

const HomePage = () => {
  return (
    <div className="container">
      <MetaTags title="Tools" description="Home page" />

      <h1 className="text-3xl text-center py-4">Tools</h1>

      <ToolsCell />
    </div>
  )
}

export default HomePage
