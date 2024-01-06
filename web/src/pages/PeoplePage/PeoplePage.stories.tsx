import type { Meta, StoryObj } from '@storybook/react'

import PeoplePage from './PeoplePage'

const meta: Meta<typeof PeoplePage> = {
  component: PeoplePage,
}

export default meta

type Story = StoryObj<typeof PeoplePage>

export const Primary: Story = {}
