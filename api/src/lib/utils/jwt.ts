import { User } from '@prisma/client'
import jwt from 'jsonwebtoken'

import { JWT_SECRET } from './env'

export type Token = {
  sub: number
  iat: number
  exp: number
  clientInfo?: ClientInfo
}

export type ClientInfo = {
  version: string
  os?: OS
  platform: Platform
  groupId?: number
  openid?: string
}

type OS = 'Android' | 'iOS'
type Platform = 'app' | 'web' | 'miniapp'

export function genToken(user: User, clientInfo?: ClientInfo): string {
  return jwt.sign({ sub: user.id, clientInfo }, JWT_SECRET, {
    expiresIn: '90d',
  })
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as unknown as Token
}
