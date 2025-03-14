import jwt, { TokenExpiredError } from 'jsonwebtoken'

import { JWT_SECRET } from './env'

type TokenType = 'Post'

type AccessToken = {
  id: number
  type: TokenType
  iat: number
  exp: number
}

type EncodeInput = {
  id: number
  type?: TokenType
}

export function encode({ id, type = 'Post' }: EncodeInput): string {
  return jwt.sign({ id, type }, JWT_SECRET, {
    expiresIn: '3d',
  })
}

export function decode(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as AccessToken
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new TokenExpiredError('Access token has expired', err.expiredAt)
    }
    throw err
  }
}
