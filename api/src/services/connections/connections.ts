import type {
  QueryResolvers,
  MutationResolvers,
  ConnectionRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const connections: QueryResolvers['connections'] = () => {
  return db.connection.findMany()
}

export const connection: QueryResolvers['connection'] = ({ id }) => {
  return db.connection.findUnique({
    where: { id },
  })
}

export const createConnection: MutationResolvers['createConnection'] = ({
  input,
}) => {
  return db.connection.create({
    data: input,
  })
}

export const updateConnection: MutationResolvers['updateConnection'] = ({
  id,
  input,
}) => {
  return db.connection.update({
    data: input,
    where: { id },
  })
}

export const deleteConnection: MutationResolvers['deleteConnection'] = ({
  id,
}) => {
  return db.connection.delete({
    where: { id },
  })
}

export const Connection: ConnectionRelationResolvers = {
  sender: (_obj, { root }) => {
    return db.connection.findUnique({ where: { id: root?.id } }).sender()
  },
  receiver: (_obj, { root }) => {
    return db.connection.findUnique({ where: { id: root?.id } }).receiver()
  },
}
