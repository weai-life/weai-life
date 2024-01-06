import { useEffect, useState } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from 'weai-ui'

import { MetaTags } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import ToolsCell from 'src/components/ToolsCell'
import UsedToolsCell from 'src/components/UsedToolsCell'

const HomePage = () => {
  const { isAuthenticated, getToken } = useAuth()
  const [tabName, setTabName] = useState('used')

  useEffect(() => {
    const initTab = async () => {
      const token = await getToken()
      if (token === 'UNDEFINED' && isAuthenticated === false) {
        setTabName('marketplace')
      } else if (isAuthenticated === true) {
        setTabName('used')
      } else {
        setTimeout(() => {
          setTabName('marketplace')
        }, 1000)
      }
    }
    void initTab()
  }, [isAuthenticated, getToken])

  return (
    <div className="container">
      <MetaTags title="Tools" description="Use tools to love life." />

      <div className="text-3xl tracking-wider subpixel-antialiased mt-6 text-center">
        Tools
      </div>
      <Tabs
        value={tabName}
        onValueChange={(name) => setTabName(name)}
        className="mt-4 text-center"
      >
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
