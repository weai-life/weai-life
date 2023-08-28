import { UserInputError } from '@redwoodjs/graphql-server'
import axios from 'axios'
import { string } from 'fp-ts'
import { uniq } from 'fp-ts/lib/Array'
import { logger } from 'src/lib/logger'

const URL = 'https://api.weixin.qq.com/wxa/msg_sec_check'

export enum Scene {
  PROFILE = 1, // 资料
  COMMENT, // 评论
  FORUM, // 论坛
  SOCIALLOG, // 社交日志
}

export type MsgSecCheckResponse = {
  errcode: number //	错误码
  errmsg: string // 错误信息
  trace_id: string // 唯一请求标识，标记单次请求
  result: Result //	综合结果
  detail: Detail[] // 详细检测结果
}

type Result = {
  suggest: 'risky' | 'pass' | 'review' //	建议，有risky、pass、review三种值
  label: Label //	命中标签枚举值，100 正常；10001 广告；20001 时政；20002 色情；20003 辱骂；20006 违法犯罪；20008 欺诈；20012 低俗；20013 版权；21000 其他
}

type Detail = {
  strategy: string //策略类型
  errcode: number // 错误码，仅当该值为0时，该项结果有效
  suggest: 'risky' | 'pass' | 'review' //	建议，有risky、pass、review三种值
  label: Label // 命中标签枚举值，100 正常；10001 广告；20001 时政；20002 色情；20003 辱骂；20006 违法犯罪；20008 欺诈；20012 低俗；20013 版权；21000 其他
  prob?: number // 0-100，代表置信度，越高代表越有可能属于当前返回的标签（label）
  keyword?: string //	命中的自定义关键词
}

// 命中标签枚举值，100 正常；10001 广告；20001 时政；20002 色情；20003 辱骂；20006 违法犯罪；20008 欺诈；20012 低俗；20013 版权；21000 其他
type Label =
  | 100 // 正常
  | 10001 // 广告
  | 20001 // 时政
  | 20002 // 色情
  | 20003 // 辱骂
  | 20006 // 违法犯罪
  | 20008 // 欺诈
  | 20012 // 低俗
  | 20013 // 版权
  | 21000 // 其他

type Param = {
  accessToken: string
  openid: string
  scene: Scene
  content: string
}

export const msgSecCheck = async ({
  accessToken,
  openid,
  scene,
  content,
}: Param) => {
  if (content.length > 2500) throw new UserInputError('内容不能超过2500字')

  const url = `${URL}?access_token=${accessToken}`

  const res = await axios.post<MsgSecCheckResponse>(url, {
    version: 2,
    openid,
    scene,
    content,
  })

  logger.debug('res:: %o', res.data)
  return res.data
}

export const getSensitiveKeywords = (detail: Detail[]) => {
  const keywords = detail
    .filter((x) => x.errcode === 0 && x.suggest !== 'pass')
    .map((x) => x.keyword)
    .filter((x) => !!x) as string[] // filter null

  return uniq(string.Eq)(keywords)
}
