import { db } from '../db'
import { logger } from 'api/src/lib/logger'
import { postMessageToUsers } from '../utils/notification'

const deadlineIsPast = (deadline: Date) => new Date(deadline) < new Date()

export const deadlineNotificationTask = async (todoId: number) => {
  const todo = await db.todo.findFirst({
    where: { id: todoId, completed: false },
  })

  if (!todo) {
    logger.warn(`任务未找到或者已经已经完成。 (todo: ${todoId})`)
    return
  }

  if (todo.deadline && deadlineIsPast(todo.deadline)) {
    logger.warn(`已经超过任务最后期限，不再发送通知。 (todo: ${todoId})`)
    return
  }

  const users = await db.todo
    .findFirst({
      where: { id: todoId, completed: false },
    })
    .assignees()

  const userIds = users.map((user) => user.id)

  const title = '任务截止日期通知'
  const message = '您有任务即将到期请注意按时完成。'
  const extras = {
    event: 'DEADLINE',
    id: todo.id.toString(),
    type: 'Todo',
    todoId: todo.id,
    postId: todo.postId,
  }

  const data = { title, message, extras, userIds }
  await postMessageToUsers(data)
}
