import { render } from '@redwoodjs/testing/web'

import PeoplePage from './PeoplePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('PeoplePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PeoplePage />)
    }).not.toThrow()
  })
})
