import { todos, todo, createTodo, updateTodo, deleteTodo } from './todos'
import type { StandardScenario } from './todos.scenarios'
import * as job from 'src/lib/utils/job'
jest.mock('src/lib/utils/job')

describe('todos', () => {
  scenario('returns all todos', async (scenario: StandardScenario) => {
    const result = await todos()

    expect(result.data.length).toEqual(Object.keys(scenario.todo).length)
  })

  scenario('returns a single todo', async (scenario: StandardScenario) => {
    const result = await todo({ id: scenario.todo.one.id })

    expect(result).toEqual(scenario.todo.one)
  })

  scenario('creates a todo', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.one)

    const result = await createTodo({
      input: {
        postId: scenario.post.one.id,
        completed: false,
        deadline: '2021-12-23T07:28:37Z',
      },
    })

    expect(result.postId).toEqual(scenario.post.one.id)
    expect(result.completed).toEqual(false)
    expect(result.deadline).toEqual(new Date('2021-12-23T07:28:37Z'))
  })

  scenario('creates a todo with timer', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.one)
    jest.spyOn(job, 'createJob').mockResolvedValueOnce('1234')

    const result = await createTodo({
      input: {
        postId: scenario.post.one.id,
        completed: false,
        deadline: '2099-12-23T07:28:37Z',
        timerAt: '2099-12-22T07:28:37Z',
      },
    })

    expect(result.timerAt).toEqual(new Date('2099-12-22T07:28:37Z'))
    expect(result.jid).toEqual('1234')
  })

  scenario('updates a todo', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.one)

    const original = await todo({ id: scenario.todo.one.id })
    const result = await updateTodo({
      id: original.id,
      input: { completed: true },
    })

    expect(result.completed).toEqual(true)
  })

  scenario(
    'cancel job when updates a todo',
    async (scenario: StandardScenario) => {
      mockCurrentUser(scenario.user.one)
      const spy = jest.spyOn(job, 'cancelJob')

      const original = await todo({ id: scenario.todo.two.id })
      const result = await updateTodo({
        id: original.id,
        input: { completed: true, timerAt: null },
      })

      expect(spy).toHaveBeenCalled()
    }
  )

  scenario(
    'create new job when updates a todo',
    async (scenario: StandardScenario) => {
      mockCurrentUser(scenario.user.one)
      const spy = jest.spyOn(job, 'createJob')

      const original = await todo({ id: scenario.todo.two.id })
      const result = await updateTodo({
        id: original.id,
        input: { timerAt: '2022-12-21T07:28:38Z' },
      })

      expect(spy).toHaveBeenCalled()
    }
  )

  scenario('deletes a todo', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.one)

    const original = await deleteTodo({ id: scenario.todo.one.id })
    const result = await todo({ id: original.id })

    expect(result).toEqual(null)
  })
})
