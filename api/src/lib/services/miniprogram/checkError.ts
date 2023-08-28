import { ForbiddenError } from '@redwoodjs/graphql-server'
export const checkError: (
  errCode: number,
  errMsg: string
) => <T>(data: T) => T = (errCode, errMsg) => (data) => {
  if (errCode != null && errCode != 0) {
    throw new ForbiddenError(errMsg)
  } else {
    return data
  }
}
