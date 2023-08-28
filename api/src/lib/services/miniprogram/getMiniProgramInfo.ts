import { ForbiddenError } from '@redwoodjs/graphql-server'
import { env } from 'src/lib/utils'

type MiniProgramInfo = {
  appid: string
  secret: string
}

const mapping: Record<number, MiniProgramInfo | null> = {
  121: {
    appid: env.MP_APPID_121,
    secret: env.MP_SECRET_121,
  },
  158: {
    appid: env.MP_APPID_158,
    secret: env.MP_SECRET_158,
  },
  172: {
    appid: env.MP_APPID_172,
    secret: env.MP_SECRET_172,
  },
}

export const getMiniProgramInfo = async (groupId: number) => {
  const info = mapping[groupId]

  if (!info) throw new ForbiddenError('未知小程序')

  return info
}
