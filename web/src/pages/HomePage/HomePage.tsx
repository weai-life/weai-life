import { Tabs, TabsList, TabsTrigger } from 'weai-ui'

import { MetaTags } from '@redwoodjs/web'

import ToolsCell from 'src/components/ToolsCell'

const HomePage = () => {
  return (
    <div className="container">
      <MetaTags title="Tools" description="Use tools to love life." />

      <div className="text-3xl tracking-wider subpixel-antialiased mt-6 text-center">
        Tools
      </div>
      <Tabs defaultValue="marketplace" className="mt-4 text-center">
        <TabsList>
          <TabsTrigger value="used">Used</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>
      </Tabs>

      <ToolsCell />
    </div>
  )
}

export default HomePage
