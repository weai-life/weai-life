import { useState } from 'react'

import { UserRoundPlus } from 'lucide-react'
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'weai-ui'

import { MetaTags } from '@redwoodjs/web'

import ReceivedConnectionsCell from 'src/components/ReceivedConnectionsCell'
import SentConnectionsCell from 'src/components/SentConnectionsCell'

import ConnectionForm from './components/ConnectionForm'

const InvitationsPage = () => {
  const [openForm, setOpenForm] = useState(false)

  return (
    <div className="container">
      <MetaTags title="Invitations" description="Manage invitations" />

      <div className="flex items-center justify-between">
        <div className="text-2xl tracking-wider subpixel-antialiased">
          Manage invitations
        </div>
        <Sheet open={openForm} onOpenChange={setOpenForm}>
          <SheetTrigger asChild>
            <Button variant="link">
              <UserRoundPlus />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full overflow-y-scroll max-h-screen">
            <SheetHeader>
              <SheetTitle>Add Connection</SheetTitle>
            </SheetHeader>
            <ConnectionForm onSaved={() => setOpenForm(false)} />
          </SheetContent>
        </Sheet>
      </div>
      <Tabs defaultValue="received" className="mt-4 text-center">
        <TabsList>
          <TabsTrigger value="received">Received</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>
        <TabsContent value="received">
          <ReceivedConnectionsCell />
        </TabsContent>
        <TabsContent value="sent">
          <SentConnectionsCell />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default InvitationsPage
