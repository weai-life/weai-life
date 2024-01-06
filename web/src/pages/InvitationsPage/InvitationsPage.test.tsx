import { render } from '@redwoodjs/testing/web'

import InvitationsPage from './InvitationsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('InvitationsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<InvitationsPage />)
    }).not.toThrow()
  })
})
