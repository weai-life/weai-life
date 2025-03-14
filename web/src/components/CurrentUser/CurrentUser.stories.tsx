// Pass props to your component by passing an `args` object to your story
//
// ```tsx
// export const Primary: Story = {
//  args: {
//    propName: propValue
//  }
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { Meta, StoryObj } from '@storybook/react'

import CurrentUser from './CurrentUser'

const meta: Meta<typeof CurrentUser> = {
  component: CurrentUser,
}

export default meta

type Story = StoryObj<typeof CurrentUser>

export const Primary: Story = {}
