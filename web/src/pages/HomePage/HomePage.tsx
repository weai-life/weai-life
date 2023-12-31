import { MetaTags } from '@redwoodjs/web'

import ToolsCell from 'src/components/ToolsCell'

const HomePage = () => {
  return (
    <>
      <MetaTags title="Tools" description="Home page" />

      <h1>Tools</h1>

      <ToolsCell />
    </>
  )
}

export default HomePage
