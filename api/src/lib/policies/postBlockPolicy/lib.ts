import { rejectNil } from 'src/lib/utils/misc'
import { User } from '@prisma/client'
import { db } from 'src/lib/db'
import * as PostPolicy from '../postPolicy/postPolicy'

export const getPost = (id: number) => db.post.findUnique({ where: { id } })

export const authorizePostUpdate = (user: User) => async (postId: number) => {
  const post = await getPost(postId).then(rejectNil('未找到 Post'))

  return PostPolicy.update(user)(post)
}

export const authorizePostRead = (user: User) => async (postId: number) => {
  const post = await getPost(postId).then(rejectNil('未找到 Post'))

  return PostPolicy.read(user)(post)
}
