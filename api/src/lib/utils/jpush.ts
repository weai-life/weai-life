import axios from 'axios'
import { chunksOf } from 'fp-ts/lib/Array'
// import { v4 as uuid } from 'uuid'
import { logger } from '../logger'
import { JPUSH_API_KEY, JPUSH_API_PASS, JPUSH_ENABLED } from './env'

export const JPUSH_MAX_NUMBER_DEVICE = 10 // 最多10个设备

const jpushEnabled = JPUSH_ENABLED === 'true'
const deviceURL = 'https://device.jpush.cn'
const pushURL = 'https://api.jpush.cn'

// TODO: Error message should remove auth info
const client = axios.create({
  auth: {
    username: JPUSH_API_KEY,
    password: JPUSH_API_PASS,
  },
})

// 为设备设置别名
export async function addDeviceAlias(registrationId: string, alias: string) {
  if (!jpushEnabled) return

  logger.debug('alias device %s as %s', registrationId, alias)

  return client.post(`${deviceURL}/v3/devices/${registrationId}`, {
    alias,
  })
}

// 为设备移除别名
export async function removeDeviceAlias(registrationId: string) {
  if (!jpushEnabled) return

  return client.post(`${deviceURL}/v3/devices/${registrationId}`, {
    alias: '',
  })
}

export async function pushMessage(
  alias: string[],
  message: string,
  title: string,
  extras: unknown
) {
  // jpush API 中 alias 最大支持 1000 个
  const groups = chunksOf(1000)(alias)

  const promises = groups.map((userAlias) =>
    pushSliceMessage(userAlias, message, title, extras)
  )
  return Promise.all(promises)
}

async function pushSliceMessage(
  alias: string[],
  message: string,
  title: string,
  extras: unknown
) {
  if (!jpushEnabled) return

  return client
    .post(`${pushURL}/v3/push`, {
      // cid: uuid(),
      platform: 'all',
      audience: {
        alias,
      },
      notification: {
        alert: message,
        android: {
          title,
          extras,
          sound: 'default',
        },
        ios: {
          sound: 'default',
          badge: '+1',
          extras,
        },
      },
    })
    .catch((err: Error) => {
      logger.error(err)
      return new Error(`发送 APP 通知时报错: ${err.message}`)
    })
}
