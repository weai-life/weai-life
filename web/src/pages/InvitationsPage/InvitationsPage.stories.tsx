import type { Meta, StoryObj } from '@storybook/react'

import InvitationsPage from './InvitationsPage'

const meta: Meta<typeof InvitationsPage> = {
  component: InvitationsPage,
}

export default meta

type Story = StoryObj<typeof InvitationsPage>

export const Primary: Story = {}
