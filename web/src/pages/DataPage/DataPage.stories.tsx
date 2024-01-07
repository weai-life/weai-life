import type { Meta, StoryObj } from '@storybook/react'

import DataPage from './DataPage'

const meta: Meta<typeof DataPage> = {
  component: DataPage,
}

export default meta

type Story = StoryObj<typeof DataPage>

export const Primary: Story = {}
