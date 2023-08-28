import { getMiniProgramInfo } from './getMiniProgramInfo'
import { logger } from 'src/lib/logger'
import { miniprogram as mp } from 'src/lib/externals'
import { checkError } from './checkError'
import { UserInputError } from '@redwoodjs/graphql-server'
import { getClientInfo } from 'src/lib/context'

export const checkPostContent = async (content: string) => {
  const { groupId, openid } = getClientInfo() || {}
  if (!groupId || !openid) return

  const { appid, secret } = await getMiniProgramInfo(groupId)
  const { access_token } = await mp.getAccessToken(appid, secret)
  await msgSecCheck(access_token, openid, content, 'post')
}

export const checkCommentContent = async (content: string) => {
  const { groupId, openid } = getClientInfo() || {}
  if (!groupId || !openid) return

  const { appid, secret } = await getMiniProgramInfo(groupId)
  const { access_token } = await mp.getAccessToken(appid, secret)
  await msgSecCheck(access_token, openid, content, 'comment')
}

export const msgSecCheck = async (
  accessToken: string,
  openid: string,
  content: string,
  type: 'post' | 'comment'
) => {
  const scene = type == 'post' ? mp.Scene.FORUM : mp.Scene.COMMENT
  const res = await mp.msgSecCheck({
    accessToken,
    openid,
    content,
    scene,
  })

  const { errcode, errmsg, result, detail } = res

  logger.debug('msgSecCheck res: %o', res)

  // check errcode
  checkError(errcode, errmsg)(result)

  if (result.suggest !== 'pass') {
    const keywords = mp.getSensitiveKeywords(detail)
    const count = keywords.length
    if (count == 0) {
      throw new UserInputError('有敏感词，请检查后重新提交')
    } else if (count > 5) {
      throw new UserInputError(
        `敏感词: ${keywords.slice(1, 6).join(', ')} 等共 ${count} 个`
      )
    } else {
      throw new UserInputError(`敏感词: ${keywords.join(', ')}`)
    }
  }
}
