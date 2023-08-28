import { miniprogram as mp } from 'src/lib/externals'
import { checkError } from './checkError'
import { cache } from 'src/lib/utils'

const EXPIRES_IN = 3600 // cache 1 个小时

export const getAccessToken = async (appid: string, secret: string) => {
  const key = `mpat:${appid}`
  return cache.fetchRedisCache({
    key,
    expiresIn: EXPIRES_IN,
    fn: getFromSource,
  })

  async function getFromSource() {
    const { errcode, errmsg, access_token, expires_in } =
      await mp.getAccessToken(appid, secret)

    return checkError(
      errcode,
      errmsg
    )({
      accessToken: access_token,
      expiresIn: expires_in,
    })
  }
}
