import type {
  QueryResolvers,
  MutationResolvers,
  ToolUserRelationResolvers,
} from 'types/graphql'

import { getCurrentUser } from 'src/lib/context'
import { db } from 'src/lib/db'
import { rejectNil } from 'src/lib/utils'

export const toolUsers: QueryResolvers['toolUsers'] = () => {
  return db.toolUser.findMany()
}

export const usedTools: QueryResolvers['toolUsers'] = () => {
  const currentUser = getCurrentUser()
  return db.toolUser.findMany({
    where: {
      userId: currentUser.id,
    },
  })
}

export const toolUser: QueryResolvers['toolUser'] = async ({ name }) => {
  const tool = await db.tool
    .findUnique({
      where: { name },
    })
    .then(rejectNil('Tool Not Found'))

  let currentUser
  try {
    currentUser = getCurrentUser()
  } catch (e) {
    currentUser = null
  }

  let toolUser
  if (currentUser && tool) {
    toolUser = await db.toolUser.findUnique({
      where: {
        tooluser: {
          toolId: tool.id,
          userId: currentUser.id,
        },
      },
    })
    if (!toolUser) {
      toolUser = await db.toolUser.create({
        data: {
          toolId: tool.id,
          userId: getCurrentUser().id,
        },
      })
    }
  }

  if (toolUser)
    return {
      ...toolUser,
      user: currentUser,
      tool: tool,
    }
  else {
    return {
      toolId: tool.id,
      tool: tool,
    }
  }
}

export const createToolUser: MutationResolvers['createToolUser'] = ({
  input,
}) => {
  return db.toolUser.create({
    data: input,
  })
}

export const updateToolUser: MutationResolvers['updateToolUser'] = ({
  id,
  input,
}) => {
  return db.toolUser.update({
    data: input,
    where: { id },
  })
}

export const deleteToolUser: MutationResolvers['deleteToolUser'] = ({ id }) => {
  return db.toolUser.delete({
    where: { id },
  })
}

export const ToolUser: ToolUserRelationResolvers = {
  tool: (_obj, { root }) => {
    return db.toolUser.findUnique({ where: { id: root?.id } }).tool()
  },
  user: (_obj, { root }) => {
    return db.toolUser.findUnique({ where: { id: root?.id } }).user()
  },
}
