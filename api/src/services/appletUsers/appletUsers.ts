import type {
  QueryResolvers,
  MutationResolvers,
  AppletUserRelationResolvers,
} from 'types/graphql'

import { getCurrentUser } from 'src/lib/context'
import { db } from 'src/lib/db'

export const appletUsers: QueryResolvers['appletUsers'] = () => {
  return db.appletUser.findMany()
}

export const appletUser: QueryResolvers['appletUser'] = async ({ name }) => {
  const applet = await db.applet.findUnique({
    where: { name },
  })

  let currentUser
  try {
    currentUser = getCurrentUser()
  } catch (e) {
    currentUser = null
  }

  let appletUser
  if (currentUser && applet) {
    appletUser = await db.appletUser.findUnique({
      where: {
        appletuser: {
          appletId: applet.id,
          userId: currentUser.id,
        },
      },
    })
    if (!appletUser) {
      appletUser = await db.appletUser.create({
        data: {
          appletId: applet.id,
          userId: getCurrentUser().id,
        },
      })
    }
  }

  if (appletUser)
    return {
      ...appletUser,
      user: currentUser,
      applet: applet,
    }
  else {
    return {
      appletId: applet.id,
      applet: applet,
    }
  }
}

export const createAppletUser: MutationResolvers['createAppletUser'] = ({
  input,
}) => {
  return db.appletUser.create({
    data: input,
  })
}

export const updateAppletUser: MutationResolvers['updateAppletUser'] = ({
  id,
  input,
}) => {
  return db.appletUser.update({
    data: input,
    where: { id },
  })
}

export const deleteAppletUser: MutationResolvers['deleteAppletUser'] = ({
  id,
}) => {
  return db.appletUser.delete({
    where: { id },
  })
}

export const AppletUser: AppletUserRelationResolvers = {
  applet: (_obj, { root }) => {
    return db.appletUser.findUnique({ where: { id: root?.id } }).applet()
  },
  user: (_obj, { root }) => {
    return db.appletUser.findUnique({ where: { id: root?.id } }).user()
  },
}
