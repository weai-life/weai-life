import type {
  QueryResolvers,
  MutationResolvers,
  PageRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const pages: QueryResolvers['pages'] = () => {
  return db.page.findMany()
}

export const page: QueryResolvers['page'] = ({ id }) => {
  return db.page.findUnique({
    where: { id },
  })
}

export const createPage: MutationResolvers['createPage'] = ({ input }) => {
  return db.page.create({
    data: input,
  })
}

export const updatePage: MutationResolvers['updatePage'] = ({ id, input }) => {
  return db.page.update({
    data: input,
    where: { id },
  })
}

export const deletePage: MutationResolvers['deletePage'] = ({ id }) => {
  return db.page.delete({
    where: { id },
  })
}

export const Page: PageRelationResolvers = {
  owner: (_obj, { root }) => {
    return db.page.findUnique({ where: { id: root?.id } }).owner()
  },
  links: (_obj, { root }) => {
    return db.page.findUnique({ where: { id: root?.id } }).links()
  },
}
