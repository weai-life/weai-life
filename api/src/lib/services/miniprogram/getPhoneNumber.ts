import { miniprogram as mp } from 'src/lib/externals'
import { checkError } from './checkError'

export const getPhoneNumber = async (accessToken: string, code: string) => {
  const { errcode, errmsg, phone_info } = await mp.getPhoneNumber(
    accessToken,
    code
  )

  return checkError(errcode, errmsg)(phone_info)
}

export const getPurePhoneNumber = (accessToken: string, code: string) =>
  getPhoneNumber(accessToken, code).then((pi) => pi.purePhoneNumber)
