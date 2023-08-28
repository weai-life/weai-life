import { User, Todo } from '@prisma/client'
import { db } from 'src/lib/db'
import { throwForbiddenErrorUnless, isAdmin } from '../lib'

const isOwner = (user: User) => (target: Todo) => target.userId === user.id

const isAssignee = (user: User) => (target: Todo) =>
  db.todo
    .count({
      where: {
        id: target.id,
        assignees: {
          some: {
            id: user.id,
          },
        },
      },
    })
    .then((count) => count > 0)

export const list = (user: User) => async () =>
  throwForbiddenErrorUnless('您无权访问')(isAdmin(user))

export const update = (user: User) => async (target: Todo) => {
  throwForbiddenErrorUnless('任务创建者或者任务负责人才能修改任务')(
    isAdmin(user) || isOwner(user)(target) || (await isAssignee(user)(target))
  )

  return true
}

export const destroy = (user: User) => async (target: Todo) => {
  throwForbiddenErrorUnless('任务创建者才能删除')(
    isAdmin(user) || isOwner(user)(target)
  )

  return true
}
