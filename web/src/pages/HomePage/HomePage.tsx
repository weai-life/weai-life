import { Tabs, TabsList, TabsTrigger } from 'weai-ui'

import ToolsCell from 'src/components/ToolsCell'

const HomePage = () => {
  return (
    <div className="container">
      <div className="text-3xl tracking-wider subpixel-antialiased mt-6 text-center">
        Tools
      </div>
      <Tabs defaultValue="account" className="mt-4 text-center">
        <TabsList>
          <TabsTrigger value="account">Used</TabsTrigger>
          <TabsTrigger value="password">Marketplace</TabsTrigger>
        </TabsList>
      </Tabs>

      <ToolsCell />
    </div>
  )
}

export default HomePage
