import { unfurl } from 'unfurl.js'
import { Metadata } from 'unfurl.js/dist/types'

const GOOGLE_BOT_UA =
  '(compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
const MOBILE_UA =
  'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36'

export const parseLink = async (url: string) => {
  let parsedUrl = decodeURIComponent(url)

  // 特殊处理某些平台的链接
  if (/music\.163\./.test(url)) {
    parsedUrl = url.replace(/#\//, '')
  }

  let userAgent = MOBILE_UA

  // 部分域名设置了屏蔽谷歌抓取逻辑
  if (!/weixin\.qq/.test(parsedUrl)) {
    userAgent += GOOGLE_BOT_UA
  }

  const result = await unfurl(parsedUrl, {
    oembed: true,
    userAgent,
  })
  const data = {} as any
  data.image = result?.open_graph?.images?.[0].url ?? result?.favicon
  data.title = result?.open_graph?.title ?? result?.title
  data.description = result?.open_graph?.description ?? result?.description
  data.url = result?.open_graph?.url ?? url
  data.oEmbed = (result.oEmbed || {}) as Metadata['oEmbed']

  // FIXME: 特殊处理某些平台的结果，会需要设置尺寸，这些要调试下
  if (/music\.163\./.test(data.url)) {
    const id = parsedUrl.match(/id=(\d+)$/)?.[1]
    data.oEmbed.type = 'rich'
    data.oEmbed.html = `<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=110 src="//music.163.com/outchain/player?type=0&id=${id}&auto=1&height=90"></iframe>`
  } else if (/bilibili\.com/.test(data.url)) {
    const avId = result.open_graph.url?.match(/([^/]*)\/$/)?.[1]
    data.oEmbed.type = 'video'
    data.oEmbed.html = `<iframe width="100%" height=400 src="//player.bilibili.com/player.html?bvid=${avId}" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>`
  }

  return data
}
