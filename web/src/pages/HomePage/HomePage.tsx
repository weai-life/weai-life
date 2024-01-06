import { useState } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from 'weai-ui'

import { MetaTags } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import ToolsCell from 'src/components/ToolsCell'
import UsedToolsCell from 'src/components/UsedToolsCell'

const HomePage = () => {
  const { isAuthenticated } = useAuth()
  const [tabName, setTabName] = useState(
    isAuthenticated ? 'used' : 'marketplace'
  )

  return (
    <div className="container">
      <MetaTags title="Tools" description="Use tools to love life." />

      <div className="text-3xl tracking-wider subpixel-antialiased mt-6 text-center">
        Tools
      </div>
      <Tabs defaultValue={tabName} className="mt-4 text-center">
        <TabsList>
          <TabsTrigger value="used">Used</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>
        <TabsContent value="used">
          <UsedToolsCell />
        </TabsContent>
        <TabsContent value="marketplace">
          <ToolsCell />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default HomePage
