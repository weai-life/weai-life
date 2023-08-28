import { miniprogram as mp } from 'src/lib/externals'
import { checkError } from './checkError'

export const code2Session = async (
  appid: string,
  secret: string,
  code: string
) => {
  const { errcode, errmsg, ...data } = await mp.code2Session(
    appid,
    secret,
    code
  )

  return checkError(errcode, errmsg)(data)
}
