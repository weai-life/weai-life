import { User, Comment } from '@prisma/client'
import * as PostPolicy from '../postPolicy/postPolicy'
import { db } from 'src/lib/db'
import { throwForbiddenErrorUnless, isAdmin } from '../lib'
import { rejectNil } from 'src/lib/utils'

const getComment = (id: number) =>
  db.comment.findUnique({ where: { id } }).then(rejectNil('未找到该评论'))

const getPost = (id: number) =>
  db.post.findUnique({ where: { id } }).then(rejectNil('未找到该评论的帖子'))

const isOwner = (user: User, target: Comment) => user.id === target.authorId

interface CommentsWhereInput {
  postId?: number
  commentId?: number
}

export const list =
  (user: User | null) =>
  async ({ postId, commentId }: CommentsWhereInput) => {
    if (postId) {
      const post = await getPost(postId)
      return PostPolicy.read(user)(post)
    } else if (commentId) {
      const comment = await getComment(commentId)
      const post = await getPost(comment.postId)
      return PostPolicy.read(user)(post)
    } else {
      return throwForbiddenErrorUnless('您无权访问')(isAdmin(user))
    }
  }

export const read = (user: User | null) => async (target: Comment) => {
  const post = await getPost(target.postId)

  return PostPolicy.read(user)(post)
}

export const create = (user: User) => async (postId: number) => {
  const post = await getPost(postId)

  return PostPolicy.create(user)(post.channelId)
}

export const update = (user: User) => async (target: Comment) =>
  throwForbiddenErrorUnless('创建者才能修改')(
    isAdmin(user) || isOwner(user, target)
  )

export const destroy = (user: User) => async (target: Comment) =>
  throwForbiddenErrorUnless('创建者才能删除')(
    isAdmin(user) || isOwner(user, target)
  )

// type Option = {
//   postId?: number
// }

// export class CommentPolicy {
//   constructor(
//     public user: User,
//     public target: Comment | null,
//     public option: Option
//   ) {}
//   async create() {
//     const postId = this.option.postId

//     const post = await db.post.findUnique({
//       where: { id: postId },
//     })

//     return PostPolicy.create({ channelId: post?.channelId })
//   }

//   update() {
//     if (!this.isOwner()) throw new ForbiddenError('创建者才能修改')
//   }

//   delete() {
//     if (!this.isOwner()) throw new ForbiddenError('创建者才能删除')
//   }

//   private isOwner() {
//     return this.user.id === this.target?.authorId
//   }
// }

// export function authorizeComment(
//   action: Exclude<keyof CommentPolicy, 'user' | 'target'>,
//   target: Comment | null = null,
//   option: Option = {}
// ): void | Promise<void> {
//   const user = context.currentUser
//   if (!user) throw new ForbiddenError('继续处理前请先登录')

//   const policy = new CommentPolicy(user, target, option)
//   return policy[action].call(policy)
// }
