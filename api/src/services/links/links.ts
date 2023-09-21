import { Prisma } from '@prisma/client'
import type {
  QueryResolvers,
  MutationResolvers,
  LinkRelationResolvers,
} from 'types/graphql'

import { ResolverArgs } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'
import { paginate } from 'src/lib/utils'

export interface LinksInputArgs {
  page?: number
  pageSize?: number
  where?: Prisma.LinkWhereInput
  orderBy?: Prisma.LinkOrderByWithRelationInput
}

export async function links({
  page,
  pageSize,
  where = {},
  orderBy = { id: 'desc' },
}: LinksInputArgs = {}) {
  return paginate({
    page,
    pageSize,
    fun: ({ skip, take }) => {
      return db.link.findMany({ skip, take, where, orderBy })
    },
  })
}

export const link: QueryResolvers['link'] = ({ id }) => {
  return db.link.findUnique({
    where: { id },
  })
}

export const createLink: MutationResolvers['createLink'] = ({ input }) => {
  return db.link.create({
    data: input,
  })
}

export const updateLink: MutationResolvers['updateLink'] = ({ id, input }) => {
  return db.link.update({
    data: input,
    where: { id },
  })
}

export const deleteLink: MutationResolvers['deleteLink'] = ({ id }) => {
  return db.link.delete({
    where: { id },
  })
}

export const Link: LinkRelationResolvers = {
  // group: (_obj, { root }) => {
  //   return db.link.findUnique({ where: { id: root?.id } }).group()
  // },
  group: (_obj, { root }: ResolverArgs<Prisma.LinkWhereUniqueInput>) =>
    db.link.findUnique({ where: { id: root.id } }).group(),
}
