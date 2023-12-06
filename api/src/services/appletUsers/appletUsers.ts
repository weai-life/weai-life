import type {
  QueryResolvers,
  MutationResolvers,
  AppletUserRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const appletUsers: QueryResolvers['appletUsers'] = () => {
  return db.appletUser.findMany()
}

export const appletUser: QueryResolvers['appletUser'] = ({ id }) => {
  return db.appletUser.findUnique({
    where: { id },
  })
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
