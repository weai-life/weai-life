import type {
  QueryResolvers,
  MutationResolvers,
  // AppletRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const applets: QueryResolvers['applets'] = () => {
  return db.applet.findMany()
}

export const applet: QueryResolvers['applet'] = ({ id }) => {
  return db.applet.findUnique({
    where: { id },
  })
}

export const createApplet: MutationResolvers['createApplet'] = ({ input }) => {
  return db.applet.create({
    data: input,
  })
}

export const updateApplet: MutationResolvers['updateApplet'] = ({
  id,
  input,
}) => {
  return db.applet.update({
    data: input,
    where: { id },
  })
}

export const deleteApplet: MutationResolvers['deleteApplet'] = ({ id }) => {
  return db.applet.delete({
    where: { id },
  })
}

export const Applet = {
  posts: (_obj, { root }) => {
    return db.applet.findUnique({ where: { id: root?.id } }).posts()
  },
  channels: (_obj, { root }) => {
    return db.applet.findUnique({ where: { id: root?.id } }).channels()
  },
}
