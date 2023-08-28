import { destroy, list, update } from './todoPolicy'

describe('todoPolicy', () => {
  describe('list', () => {
    scenario('success for admin user', async (scenario) => {
      const result = list(scenario.user.admin)()
      await expect(result).resolves.toBe(true)
    })

    scenario('failed for not admin user', async (scenario) => {
      const result = list(scenario.user.other)()
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"您无权访问"`
      )
    })
  })

  describe('update', () => {
    scenario('success for todo creator', async (scenario) => {
      const target = scenario.todo.one
      const result = update(scenario.user.owner)(target)
      await expect(result).resolves.toBe(true)
    })

    scenario('success for todo assignees', async (scenario) => {
      const target = scenario.todo.one
      const result = update(scenario.user.assignee)(target)
      await expect(result).resolves.toBe(true)
    })

    scenario('failed for other users', async (scenario) => {
      const target = scenario.todo.one
      const result = update(scenario.user.other)(target)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"任务创建者或者任务负责人才能修改任务"`
      )
    })
  })

  describe('destroy', () => {
    scenario('success for todo creator', async (scenario) => {
      const target = scenario.todo.one
      const result = destroy(scenario.user.owner)(target)
      await expect(result).resolves.toBe(true)
    })

    scenario('success for todo assignees', async (scenario) => {
      const target = scenario.todo.one
      const result = destroy(scenario.user.assignee)(target)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"任务创建者才能删除"`
      )
    })

    scenario('failed for other users', async (scenario) => {
      const target = scenario.todo.one
      const result = destroy(scenario.user.other)(target)
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `"任务创建者才能删除"`
      )
    })
  })
})
