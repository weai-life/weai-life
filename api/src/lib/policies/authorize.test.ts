import { _authorize as authorize } from './authorize'

const fn = (user) => user

describe('authorize', () => {
  it('fn test', () => {
    const user = { id: 1 }
    mockCurrentUser(user)
    expect(authorize(fn)).toBe(user)
  })
})
