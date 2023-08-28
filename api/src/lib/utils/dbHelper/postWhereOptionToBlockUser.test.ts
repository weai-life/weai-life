import { db } from '../../db'
import { postWhereOptionToBlockUser } from './postWhereOptionToBlockUser'

describe('dbHelper', () => {
  describe('postWhereOptionToBlockUser', () => {
    scenario(
      'filter out posts which is created by blocked user',
      async (scenario) => {
        const result = await db.post.findMany({
          where: {
            ...postWhereOptionToBlockUser(scenario.user.one.id),
          },
        })

        expect(result.length).toEqual(1)
      }
    )

    scenario(
      'do not filter out posts when param is null',
      async (_scenario) => {
        const result = await db.post.findMany({
          where: {
            ...postWhereOptionToBlockUser(undefined),
          },
        })

        expect(result.length).toEqual(2)
      }
    )
  })
})
