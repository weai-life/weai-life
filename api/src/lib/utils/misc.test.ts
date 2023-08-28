import { uniqBy } from './misc'

describe('misc', () => {
  it('uniqBy', () => {
    const list = [
      { userId: 1, id: 1 },
      { userId: 2, id: 2 },
      { userId: 1, id: 3 },
    ]

    const result = uniqBy((x) => x.userId, list)

    expect(result.length).toEqual(2)
    expect(result[0].id).toEqual(1)
    expect(result[1].id).toEqual(2)
  })
})
