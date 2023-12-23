import type {
  QueryResolvers,
  MutationResolvers,
  AppletUserTagRelationResolvers,
} from 'types/graphql'

import { getCurrentUser } from 'src/lib/context'
import { db } from 'src/lib/db'

export const appletUserTags: QueryResolvers['appletUserTags'] = async () => {
  const appletUser = await db.appletUser.findFirst({
    where: {
      userId: getCurrentUser().id,
    },
  })
  return db.appletUserTag.findMany({
    where: {
      appletUserId: appletUser.id,
    },
  })
}

export const appletUserTag: QueryResolvers['appletUserTag'] = ({ id }) => {
  return db.appletUserTag.findUnique({
    where: { id },
  })
}

export const createAppletUserTag = async ({ name }) => {
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
  const appletUser = await db.appletUser.findFirst({
    where: {
      userId: getCurrentUser().id,
    },
  })
  return db.appletUserTag.create({
    data: {
      tagId: existTag.id,
      appletUserId: appletUser.id,
    },
  })
}

export const updateAppletUserTag: MutationResolvers['updateAppletUserTag'] = ({
  id,
  input,
}) => {
  return db.appletUserTag.update({
    data: input,
    where: { id },
  })
}

export const deleteAppletUserTag: MutationResolvers['deleteAppletUserTag'] = ({
  id,
}) => {
  return db.appletUserTag.delete({
    where: { id },
  })
}

export const AppletUserTag: AppletUserTagRelationResolvers = {
  appletUser: (_obj, { root }) => {
    return db.appletUserTag.findUnique({ where: { id: root?.id } }).appletUser()
  },
  tag: (_obj, { root }) => {
    return db.appletUserTag.findUnique({ where: { id: root?.id } }).tag()
  },
}
