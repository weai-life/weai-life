import { render } from '@redwoodjs/testing/web'

import ConnectionsPage from './ConnectionsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ConnectionsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ConnectionsPage />)
    }).not.toThrow()
  })
})
