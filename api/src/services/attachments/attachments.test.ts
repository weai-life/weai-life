import {
  attachments,
  attachment,
  createAttachment,
  updateAttachment,
  deleteAttachment,
} from './attachments'
import type { StandardScenario } from './attachments.scenarios'
import { db } from 'src/lib/db'

// TODO use better import: import { oss } from 'src/lib/utils'
import * as oss from 'src/lib/utils/oss'
jest.mock('src/lib/utils/oss')

describe('attachments', () => {
  scenario('returns all attachments', async (scenario: StandardScenario) => {
    const result = await attachments()

    expect(result.data.length).toEqual(Object.keys(scenario.attachment).length)
  })

  scenario(
    'returns a single attachment',
    async (scenario: StandardScenario) => {
      const result = await attachment({ id: scenario.attachment.one.id })

      expect(result).toEqual(scenario.attachment.one)
    }
  )

  scenario('creates a attachment', async (scenario: StandardScenario) => {
    const u = await user({ id: scenario.attachment.two.userId })
    mockCurrentUser(u)

    const result = await createAttachment({
      input: {
        filename: 'a.jpg',
        meta: { w: 1080 },
      },
    })

    expect(result.status).toEqual('PENDING')
    expect(result.filename).toEqual('a.jpg')
    expect(result.userId).toEqual(scenario.attachment.two.userId)
    expect(result.hash?.length).toEqual(6)
    expect(result.meta?.w).toEqual(1080)
    expect(result.public).toEqual(true)
  })

  describe('updates a attachment', () => {
    scenario('by owner', async (scenario: StandardScenario) => {
      const u = await user({ id: scenario.attachment.one.userId })
      mockCurrentUser(u)

      const result = await updateAttachment({
        id: scenario.attachment.one.id,
        input: { status: 'UPLOADED' },
      })

      expect(result.status).toEqual('UPLOADED')
    })
  })

  describe('deletes a attachment', () => {
    scenario('by owner', async (scenario: StandardScenario) => {
      const u = await user({ id: scenario.attachment.one.userId })
      mockCurrentUser(u)

      const original = await deleteAttachment({
        id: scenario.attachment.one.id,
      })
      const result = await attachment({ id: original.id })

      expect(result).toEqual(null)
    })

    describe('deletes a attachment', () => {
      scenario('delete successfully', async (scenario: StandardScenario) => {
        const spy = jest.spyOn(oss, 'deleteCloudFile')

        const u = await user({ id: scenario.attachment.two.userId })
        mockCurrentUser(u)

        const original = await deleteAttachment({
          id: scenario.attachment.two.id,
        })

        expect(spy).toBeCalledTimes(1)

        const result = await db.attachment.findUnique({
          where: { id: original?.id },
        })

        expect(result).toEqual(null)
      })
    })
  })
})

function user({ id }) {
  return db.user.findUnique({
    where: { id },
  })
}
