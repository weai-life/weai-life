import type { Meta, StoryObj } from '@storybook/react'

import HomePage from './ToolsPage'

const meta: Meta<typeof HomePage> = {
  component: HomePage,
}

export default meta

type Story = StoryObj<typeof HomePage>

export const Primary: Story = {}
