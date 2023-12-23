import type {
  QueryResolvers,
  MutationResolvers,
  PostTagRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const postTags: QueryResolvers['postTags'] = () => {
  return db.postTag.findMany()
}

export const postTag: QueryResolvers['postTag'] = ({ id }) => {
  return db.postTag.findUnique({
    where: { id },
  })
}

export const createPostTag: MutationResolvers['createPostTag'] = ({
  input,
}) => {
  return db.postTag.create({
    data: input,
  })
}

export const updatePostTag: MutationResolvers['updatePostTag'] = ({
  id,
  input,
}) => {
  return db.postTag.update({
    data: input,
    where: { id },
  })
}

export const deletePostTag: MutationResolvers['deletePostTag'] = ({ id }) => {
  return db.postTag.delete({
    where: { id },
  })
}

export const PostTag: PostTagRelationResolvers = {
  post: (_obj, { root }) => {
    return db.postTag.findUnique({ where: { id: root?.id } }).post()
  },
  tag: (_obj, { root }) => {
    return db.postTag.findUnique({ where: { id: root?.id } }).tag()
  },
}
