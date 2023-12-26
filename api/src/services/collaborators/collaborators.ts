import type {
  QueryResolvers,
  MutationResolvers,
  CollaboratorRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const collaborators: QueryResolvers['collaborators'] = () => {
  return db.collaborator.findMany()
}

export const collaborator: QueryResolvers['collaborator'] = ({ id }) => {
  return db.collaborator.findUnique({
    where: { id },
  })
}

export const createCollaborator: MutationResolvers['createCollaborator'] = ({
  input,
}) => {
  return db.collaborator.create({
    data: input,
  })
}

export const updateCollaborator: MutationResolvers['updateCollaborator'] = ({
  id,
  input,
}) => {
  return db.collaborator.update({
    data: input,
    where: { id },
  })
}

export const deleteCollaborator: MutationResolvers['deleteCollaborator'] = ({
  id,
}) => {
  return db.collaborator.delete({
    where: { id },
  })
}

export const Collaborator: CollaboratorRelationResolvers = {
  post: (_obj, { root }) => {
    return db.collaborator.findUnique({ where: { id: root?.id } }).post()
  },
  user: (_obj, { root }) => {
    return db.collaborator.findUnique({ where: { id: root?.id } }).user()
  },
}
