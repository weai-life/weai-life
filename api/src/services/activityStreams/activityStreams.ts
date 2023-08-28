import { ResolverArgs } from '@redwoodjs/graphql-server'
import { getCurrentUser } from 'src/lib/context'
import type { Prisma } from '@prisma/client'

import { db } from 'src/lib/db'
import { paginate } from 'src/lib/utils'

export const myActivityStreams = ({
  where = {},
  ...input
}: ActivityStreamsInputArgs = {}) =>
  queryActivityStreams({
    ...input,
    where: { ...where, userId: getCurrentUser().id },
  })

async function queryActivityStreams({
  page,
  pageSize,
  where = {},
  orderBy = { id: 'desc' },
}: ActivityStreamsInputArgs = {}) {
  return paginate({
    page,
    pageSize,
    fun: ({ skip, take }) => {
      return db.activityStream.findMany({ skip, take, where, orderBy })
    },
  })
}

export const activityStreams = () => {
  return db.activityStream.findMany()
}

export const activityStream = ({
  id,
}: Prisma.ActivityStreamWhereUniqueInput) => {
  return db.activityStream.findUnique({
    where: { id },
  })
}

export interface ActivityStreamsInputArgs {
  page?: number
  pageSize?: number
  where?: Prisma.ActivityStreamWhereInput
  orderBy?: Prisma.ActivityStreamOrderByWithRelationInput
}

interface CreateActivityStreamArgs {
  input: Prisma.ActivityStreamUncheckedCreateInput
}

export const createActivityStream = ({ input }: CreateActivityStreamArgs) => {
  return db.activityStream.create({
    data: input,
  })
}

interface UpdateActivityStreamArgs
  extends Prisma.ActivityStreamWhereUniqueInput {
  input: Prisma.ActivityStreamUpdateInput
}

export const updateActivityStream = ({
  id,
  input,
}: UpdateActivityStreamArgs) => {
  return db.activityStream.update({
    data: input,
    where: { id },
  })
}

export const deleteActivityStream = ({
  id,
}: Prisma.ActivityStreamWhereUniqueInput) => {
  return db.activityStream.delete({
    where: { id },
  })
}

export const ActivityStream = {
  user: (_obj, { root }: ResolverArgs<ReturnType<typeof activityStream>>) =>
    db.activityStream.findUnique({ where: { id: root!.id } }).user(),
  channel: (_obj, { root }: ResolverArgs<ReturnType<typeof activityStream>>) =>
    db.activityStream.findUnique({ where: { id: root!.id } }).channel(),
}
