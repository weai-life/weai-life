import type {
  QueryResolvers,
  MutationResolvers,
  ToolUserTagRelationResolvers,
} from 'types/graphql'

import { getCurrentUser } from 'src/lib/context'
import { db } from 'src/lib/db'

export const toolUserTags: QueryResolvers['toolUserTags'] = async ({
  toolId,
}) => {
  const toolUser = await db.toolUser.findFirst({
    where: {
      userId: getCurrentUser().id,
      toolId: toolId,
    },
  })
  return db.toolUserTag.findMany({
    where: {
      toolUserId: toolUser.id,
    },
  })
}

export const toolUserTag: QueryResolvers['toolUserTag'] = ({ id }) => {
  return db.toolUserTag.findUnique({
    where: { id },
  })
}

export const createToolUserTag = async ({ name, toolId }) => {
  let existTag = await db.tag.findFirst({
    where: {
      name,
    },
  })
  if (!existTag) {
    existTag = await db.tag.create({
      data: {
        name,
      },
    })
  }
  const toolUser = await db.toolUser.findFirst({
    where: {
      userId: getCurrentUser().id,
      toolId,
    },
  })
  return db.toolUserTag.create({
    data: {
      tagId: existTag.id,
      toolUserId: toolUser.id,
    },
  })
}

export const updateToolUserTag: MutationResolvers['updateToolUserTag'] = ({
  id,
  input,
}) => {
  return db.toolUserTag.update({
    data: input,
    where: { id },
  })
}

export const deleteToolUserTag: MutationResolvers['deleteToolUserTag'] = ({
  id,
}) => {
  return db.toolUserTag.delete({
    where: { id },
  })
}

export const ToolUserTag: ToolUserTagRelationResolvers = {
  toolUser: (_obj, { root }) => {
    return db.toolUserTag.findUnique({ where: { id: root?.id } }).toolUser()
  },
  tag: (_obj, { root }) => {
    return db.toolUserTag.findUnique({ where: { id: root?.id } }).tag()
  },
}
