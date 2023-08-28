import { fetchRedisCache } from './cache'

describe('cache', () => {
  const key = 'key'
  const expiresIn = 5000

  it('it will call original function when not cached', async () => {
    const fn = jest.fn()
    fn.mockResolvedValue({ foo: 'bar' })
    const cache = await fetchRedisCache({
      key,
      expiresIn,
      fn,
    })

    expect(cache).toEqual({ foo: 'bar' })
    expect(fn).toHaveBeenCalled()
  })

  it('it will return cached value when cached', async () => {
    const fn = jest.fn()
    fn.mockResolvedValue({ foo: 'bar' })
    const cache = await fetchRedisCache({
      key,
      expiresIn,
      fn,
    })

    expect(cache).toEqual({ foo: 'bar' })
    expect(fn).not.toHaveBeenCalled()
  })
})
