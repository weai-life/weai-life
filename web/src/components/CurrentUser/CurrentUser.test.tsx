import { render } from '@redwoodjs/testing/web'

import CurrentUser from './CurrentUser'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('CurrentUser', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<CurrentUser />)
    }).not.toThrow()
  })
})
