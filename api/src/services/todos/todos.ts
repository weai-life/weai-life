import { getCurrentUser } from 'src/lib/context'
import DB, { Prisma } from '@prisma/client'
import type { ResolverArgs } from '@redwoodjs/graphql-server'
import { paginate, rejectNil } from 'src/lib/utils'
import * as job from 'src/lib/utils/job'

import { db } from 'src/lib/db'
import { authorize, TodoPolicy as policy } from 'src/lib/policies'

export interface TodosInputArgs {
  page?: number
  pageSize?: number
  where?: Prisma.TodoWhereInput
  orderBy?: Prisma.TodoOrderByWithRelationInput
}

export const todos = async (input: TodosInputArgs = {}) => {
  authorize(policy.list)()

  return queryTodos(input)
}

async function queryTodos({
  page,
  pageSize,
  where = {},
  orderBy = { id: 'asc' },
}: TodosInputArgs = {}) {
  return paginate({
    page,
    pageSize,
    fun: ({ skip, take }) => {
      return db.todo.findMany({ skip, take, where, orderBy })
    },
  })
}

export const myCreatedTodos = async ({
  where,
  ...input
}: TodosInputArgs = {}) => {
  return queryTodos({
    ...input,
    where: {
      ...where,
      userId: getCurrentUser().id,
    },
  })
}

export const myTodos = async ({ where, ...input }: TodosInputArgs = {}) => {
  return queryTodos({
    ...input,
    where: {
      ...where,
      assignees: {
        some: {
          id: getCurrentUser().id,
        },
      },
    },
  })
}

export const todo = ({ id }: Prisma.TodoWhereUniqueInput) => {
  return db.todo.findUnique({
    where: { id },
  })
}

export interface TodoCreateInput {
  postId: number
  completed: boolean
  deadline?: string
  assignees?: number[]
  timerAt?: string
}

interface CreateTodoArgs {
  input: TodoCreateInput
}

export const createTodo = ({ input }: CreateTodoArgs) => {
  const { postId, assignees, ...rest } = input
  const data = {
    ...rest,
    user: { connect: { id: getCurrentUser().id } },
    post: { connect: { id: postId } },
    // deadline: deadline && new Date(deadline),
    assignees: assignees && { connect: assignees.map((id) => ({ id })) },
  }

  return db.todo.create({ data }).then(addTimerJob)
}

const addTimerJob = async (todo: DB.Todo) => {
  if (!todo.timerAt || !todo.deadline || todo.completed) return todo

  const jid = await job.createJob({
    jobtype: 'deadlineNotificationTask',
    args: [todo.id],
    at: todo.timerAt,
    retry: 3,
  })

  return db.todo.update({
    data: { jid },
    where: { id: todo.id },
  })
}

type TodoUpdateInput = Omit<TodoCreateInput, 'postId'>

interface UpdateTodoArgs extends Prisma.TodoWhereUniqueInput {
  input: TodoUpdateInput
}

export const updateTodo = async ({ id, input }: UpdateTodoArgs) => {
  const { assignees, ...rest } = input
  const data = {
    ...rest,
    assignees: assignees && { connect: assignees.map((id) => ({ id })) },
  }

  const oldTodo = await db.todo
    .findUnique({
      where: { id },
    })
    .then(rejectNil('为找到任务'))

  await authorize(policy.update)(oldTodo)

  const newTodo = await db.todo.update({
    data,
    where: { id },
  })

  if (oldTodo.jid && !oldTodo.completed) {
    await job.cancelJob(oldTodo.jid)

    if (input.timerAt === null) {
      db.todo.update({
        data: { jid: null },
        where: { id },
      })
    }
  }

  if (input.timerAt && !newTodo.completed) await addTimerJob(newTodo)

  return newTodo
}

export const deleteTodo = ({ id }: Prisma.TodoWhereUniqueInput) => {
  const target = db.todo.findUnique({
    where: { id },
  })

  authorize(policy.destroy)(target)

  return db.todo.delete({
    where: { id },
  })
}

export const Todo = {
  post: (_obj, { root }: ResolverArgs<ReturnType<typeof todo>>) =>
    db.todo.findUnique({ where: { id: root.id } }).post(),
  assignees: (_obj, { root }: ResolverArgs<ReturnType<typeof todo>>) =>
    db.todo.findUnique({ where: { id: root.id } }).assignees(),
}
