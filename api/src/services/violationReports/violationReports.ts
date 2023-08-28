import { getCurrentUser } from 'src/lib/context'
import type { Prisma } from '@prisma/client'
import type { ResolverArgs } from '@redwoodjs/graphql-server'
import { db } from 'src/lib/db'
import { authorize, ViolationReportPolicy as policy } from 'src/lib/policies'
import { paginate } from 'src/lib/utils'

export interface ViolationReportsInputArgs {
  page?: number
  pageSize?: number
  where?: Prisma.ViolationReportWhereInput
  orderBy?: Prisma.ViolationReportOrderByWithRelationInput
}

async function queryViolationReports({
  page,
  pageSize,
  where = {},
  orderBy = { id: 'desc' },
}: ViolationReportsInputArgs = {}) {
  return paginate({
    page,
    pageSize,
    fun: ({ skip, take }) => {
      return db.violationReport.findMany({ skip, take, where, orderBy })
    },
  })
}

export const violationReports = async ({
  ...input
}: ViolationReportsInputArgs = {}) => {
  await authorize(policy.read)()

  return queryViolationReports({
    ...input,
  })
}

export const violationReport = async ({
  id,
}: Prisma.ViolationReportWhereUniqueInput) => {
  await authorize(policy.read)()

  return db.violationReport.findUnique({
    where: { id },
  })
}

interface CreateViolationReportArgs {
  input: Prisma.ViolationReportUncheckedCreateInput
}

export const createViolationReport = async ({
  input,
}: CreateViolationReportArgs) => {
  await authorize(policy.create)()

  return db.violationReport.create({
    data: {
      ...input,
      reporterId: getCurrentUser().id,
    },
  })
}

interface UpdateViolationReportArgs
  extends Prisma.ViolationReportWhereUniqueInput {
  input: Prisma.ViolationReportUpdateInput
}

export const updateViolationReport = async ({
  id,
  input,
}: UpdateViolationReportArgs) => {
  await authorize(policy.update)()

  return db.violationReport.update({
    data: input,
    where: { id },
  })
}

export const deleteViolationReport = async ({
  id,
}: Prisma.ViolationReportWhereUniqueInput) => {
  await authorize(policy.destroy)()

  return db.violationReport.delete({
    where: { id },
  })
}

export const ViolationReport = {
  violationCategory: (
    _obj,
    { root }: ResolverArgs<ReturnType<typeof violationReport>>
  ) =>
    db.violationReport
      .findUnique({ where: { id: root.id } })
      .violationCategory(),
  reporter: (
    _obj,
    { root }: ResolverArgs<ReturnType<typeof violationReport>>
  ) => db.violationReport.findUnique({ where: { id: root.id } }).reporter(),
  post: (_obj, { root }: ResolverArgs<ReturnType<typeof violationReport>>) =>
    db.violationReport.findUnique({ where: { id: root.id } }).post(),
}
