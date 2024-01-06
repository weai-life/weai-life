import type {
  QueryResolvers,
  MutationResolvers,
  ConnectionRelationResolvers,
} from 'types/graphql'

import { getCurrentUser } from 'src/lib/context'
import { db } from 'src/lib/db'

export const connections: QueryResolvers['connections'] = () => {
  const currentUser = getCurrentUser()

  return db.connection.findMany({
    where: {
      status: 'ACCEPTED',
      receiverId: currentUser.id,
    },
  })
}

export const sentConnections: QueryResolvers['connections'] = () => {
  const currentUser = getCurrentUser()

  return db.connection.findMany({
    where: {
      status: 'PENDING',
      senderId: currentUser.id,
    },
  })
}

export const receivedConnections: QueryResolvers['connections'] = () => {
  const currentUser = getCurrentUser()

  return db.connection.findMany({
    where: {
      status: 'PENDING',
      receiverId: currentUser.id,
    },
  })
}

export const connection: QueryResolvers['connection'] = ({ id }) => {
  return db.connection.findUnique({
    where: { id },
  })
}

export const createConnectionByEmail: MutationResolvers['createConnectionByEmail'] =
  async ({ email }) => {
    const currentUser = getCurrentUser()
    const currentUserId = currentUser.id
    let receiver = await db.user.findUnique({ where: { email } })
    if (!receiver) {
      receiver = await db.user.create({
        data: {
          name: email,
          email: email,
          invitedById: currentUserId,
        },
      })
    }
    let connection = await db.connection.findFirst({
      where: { senderId: currentUserId, receiverId: receiver.id },
    })
    if (!connection) {
      connection = await db.connection.create({
        data: {
          senderId: currentUserId,
          receiverId: receiver.id,
        },
      })
    }
    return connection
  }

export const acceptConnection: MutationResolvers['acceptConnection'] = async ({
  id,
}) => {
  const currentUser = getCurrentUser()
  const currentUserId = currentUser.id

  const receivedConnection = await db.connection.findUnique({
    where: { id, receiverId: currentUserId },
  })

  await db.connection.create({
    data: {
      senderId: currentUserId,
      receiverId: receivedConnection.senderId,
      status: 'ACCEPTED',
    },
  })

  return db.connection.update({
    data: {
      status: 'ACCEPTED',
    },
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
