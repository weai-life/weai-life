/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Prisma } from '@prisma/client'
import { ResolverArgs } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'
import { dateInChina } from '../posts/lib'

const defaultSize = 365
const maxSize = 365

type ActivityStatsInput = {
  userId: number
  take?: number
}

export const activityStats = ({
  userId,
  take = defaultSize,
}: ActivityStatsInput) => {
  if (take > maxSize) take = maxSize
  const firstDate = dayAgo(new Date(), take)

  return db.activityStat
    .findMany({
      where: { userId },
      take,
      orderBy: { id: 'desc' },
    })
    .then((x) => x.filter((d) => d.date > firstDate))
    .then((x) => x.reverse())
}

export function dayAgo(date, n: number) {
  date.setDate(date.getDate() - n)
  return dateInChina(date)
}

const activityStat = ({ id }: Prisma.ActivityStatWhereUniqueInput) => {
  return db.activityStat.findUnique({
    where: { id },
  })
}

export const ActivityStat = {
  user: (_obj, { root }: ResolverArgs<ReturnType<typeof activityStat>>) =>
    db.activityStat.findUnique({ where: { id: root.id } }).user(),
}
