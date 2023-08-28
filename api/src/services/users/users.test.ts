import { users, user, updateProfile, User } from './users'

describe('users', () => {
  scenario('returns all users if current user is admin', async (scenario) => {
    mockCurrentUser(scenario.user.two)

    const result = await users()

    expect(result.data.length).toEqual(Object.keys(scenario.user).length)
  })
})

describe('user', () => {
  scenario('returns the user info when read self info', async (scenario) => {
    mockCurrentUser(scenario.user.one)

    const result = await user({ id: scenario.user.one.id })

    expect(result?.isAdmin).toEqual(false)
  })

  scenario(
    'returns a user info when current user is admin',
    async (scenario) => {
      mockCurrentUser(scenario.user.two)

      const result = await user({ id: scenario.user.one.id })

      expect(result?.isAdmin).toEqual(false)
    }
  )
})

describe('updateProfile', () => {
  scenario('returns updated user', async (scenario) => {
    mockCurrentUser(scenario.user.one)

    const updateName = 'update name'
    const input = {
      name: updateName,
      avatarUrl: 'https://a.com/1.jpg',
      store: { lastActivityStreamId: 2 },
    }
    const result = await updateProfile({
      input,
    })

    expect(result.name).toEqual(updateName)
    expect(result.avatarUrl).toEqual('https://a.com/1.jpg')
    expect(result.store?.lastActivityStreamId).toEqual(2)
  })
})

describe('User', () => {
  scenario(
    'isAdmin is masked when current is not an admin',
    async (scenario) => {
      mockCurrentUser(scenario.user.one)

      const result = await User.isAdmin({}, { root: scenario.user.two })

      expect(result).toEqual(false)
    }
  )

  scenario('isAdmin is returned when current is an admin', async (scenario) => {
    mockCurrentUser(scenario.user.two)

    const result = await User.isAdmin({}, { root: scenario.user.two })

    expect(result).toEqual(true)
  })
})
