import type { Meta, StoryObj } from '@storybook/react'

import ConnectionsPage from './ConnectionsPage'

const meta: Meta<typeof ConnectionsPage> = {
  component: ConnectionsPage,
}

export default meta

type Story = StoryObj<typeof ConnectionsPage>

export const Primary: Story = {}
