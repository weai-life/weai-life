import { render } from '@redwoodjs/testing/web'

import SubPageLayout from './SubPageLayout'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('SubPageLayout', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SubPageLayout />)
    }).not.toThrow()
  })
})
