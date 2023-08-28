import { updateBlockStat } from './lib'

describe('posts lib', () => {
  describe('updateBlockStat', () => {
    scenario('update existing record', async (scenario) => {
      const date = new Date('2021-10-27T16:00:01Z') // the date is 2021-10-28 in china

      const result = await updateBlockStat(scenario.user.one, date, 1)

      expect(result.count).toEqual(2)
    })

    scenario('create new record', async (scenario) => {
      const date = new Date('2021-10-28')

      const result = await updateBlockStat(scenario.user.two, date, 1)

      expect(result.count).toEqual(1)
    })
  })
})
