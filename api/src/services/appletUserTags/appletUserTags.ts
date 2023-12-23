import type {
  QueryResolvers,
  MutationResolvers,
  AppletUserTagRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const appletUserTags: QueryResolvers['appletUserTags'] = () => {
  return db.appletUserTag.findMany()
}

export const appletUserTag: QueryResolvers['appletUserTag'] = ({ id }) => {
  return db.appletUserTag.findUnique({
    where: { id },
  })
}

export const createAppletUserTag: MutationResolvers['createAppletUserTag'] = ({
  input,
}) => {
  return db.appletUserTag.create({
    data: input,
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
