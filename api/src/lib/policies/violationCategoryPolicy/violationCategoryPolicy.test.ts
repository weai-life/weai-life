import { read, create, update, destroy } from './violationCategoryPolicy'

const user = { isAdmin: false }
const admin = { isAdmin: true }

describe('violationCategoryPolicy', () => {
  describe('read', () => {
    it('throw error when not login', async () => {
      await expect(read(null)()).rejects.toThrowErrorMatchingInlineSnapshot(
        `"无权读取举报分类"`
      )
    })

    it('success for login user', async () => {
      await expect(read(user)()).resolves.toEqual(true)
    })
  })

  describe('create', () => {
    it('throw error when user is not admin', async () => {
      await expect(create(user)()).rejects.toThrowErrorMatchingInlineSnapshot(
        `"无权生成举报分类"`
      )
    })

    it('success when user is an admin', async () => {
      await expect(create(admin)()).resolves.toEqual(true)
    })
  })

  describe('update', () => {
    it('throw error when user is not admin', async () => {
      await expect(update(user)()).rejects.toThrowErrorMatchingInlineSnapshot(
        `"无权修改举报分类"`
      )
    })

    it('success when user is an admin', async () => {
      await expect(update(admin)()).resolves.toEqual(true)
    })
  })

  describe('destroy', () => {
    it('throw error when user is not admin', async () => {
      await expect(destroy(user)()).rejects.toThrowErrorMatchingInlineSnapshot(
        `"无权删除举报分类"`
      )
    })

    it('success when user is an admin', async () => {
      await expect(destroy(admin)()).resolves.toEqual(true)
    })
  })
})
