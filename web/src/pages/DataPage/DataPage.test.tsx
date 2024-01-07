import { render } from '@redwoodjs/testing/web'

import DataPage from './DataPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('DataPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<DataPage />)
    }).not.toThrow()
  })
})
