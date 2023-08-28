import axios from 'axios'
import { logger } from 'src/lib/logger'

const URL = 'https://api.weixin.qq.com/sns/jscode2session'

export type Code2SessionResponse = {
  openid: string //	用户唯一标识
  session_key: string //	会话密钥
  unionid: string //	用户在开放平台的唯一标识符，若当前小程序已绑定到微信开放平台帐号下会返回，详见 UnionID 机制说明。
  errcode: number //	错误码
  errmsg: string //	错误信息
}

export const code2Session: (
  appid: string,
  secret: string,
  code: string
) => Promise<Code2SessionResponse> = async (appid, secret, code) => {
  logger.debug('code2Session appid: %s, secret: %s, code: %s', appid, secret)

  const res = await axios
    .get<Code2SessionResponse>(URL, {
      params: {
        appid,
        secret,
        js_code: code,
        grant_type: 'authorization_code',
      },
    })
    .then((x) => x.data)

  logger.debug('res:: %o', res)
  return res
}
