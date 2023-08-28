import { read, create, update, destroy } from './violationReportPolicy'

const user = { isAdmin: false }
const admin = { isAdmin: true }

describe('violationReportPolicy', () => {
  describe('read', () => {
    it('throw error when not login', async () => {
      await expect(read(user)()).rejects.toThrowErrorMatchingInlineSnapshot(
        `"无权读取举报"`
      )
    })

    it('success for login user', async () => {
      await expect(read(admin)()).resolves.toEqual(true)
    })
  })

  describe('create', () => {
    it('throw error when user is not admin', async () => {
      await expect(create(null)()).rejects.toThrowErrorMatchingInlineSnapshot(
        `"无权生成举报"`
      )
    })

    it('success when user is an admin', async () => {
      await expect(create(user)()).resolves.toEqual(true)
    })
  })

  describe('update', () => {
    it('throw error when user is not admin', async () => {
      await expect(update(user)()).rejects.toThrowErrorMatchingInlineSnapshot(
        `"无权修改举报"`
      )
    })

    it('success when user is an admin', async () => {
      await expect(update(admin)()).resolves.toEqual(true)
    })
  })

  describe('destroy', () => {
    it('throw error when user is not admin', async () => {
      await expect(destroy(user)()).rejects.toThrowErrorMatchingInlineSnapshot(
        `"无权删除举报"`
      )
    })

    it('success when user is an admin', async () => {
      await expect(destroy(admin)()).resolves.toEqual(true)
    })
  })
})
