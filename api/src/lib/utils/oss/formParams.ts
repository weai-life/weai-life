import crypto from 'crypto'
import {
  ALIYUN_KEY,
  ALIYUN_PASS,
  ALIYUN_OSS_BUCKET,
  ALIYUN_OSS_REGION,
  ALIYUN_OSS_CDN_HOST,
} from '../env'
import axios from 'axios'
import { logger } from '../../logger'

export const host = ALIYUN_OSS_CDN_HOST
  ? ALIYUN_OSS_CDN_HOST
  : `https://${ALIYUN_OSS_BUCKET}.${ALIYUN_OSS_REGION}.aliyuncs.com`

export const formParams = (key: string, bucket: string = ALIYUN_OSS_BUCKET) => {
  const policy = getPolicy(key, bucket)
  const sign = signature(policy)

  return {
    OSSAccessKeyId: ALIYUN_KEY,
    key,
    policy: policy,
    Signature: sign,
  }
}

const MAX_SIZE = 100 * 1024 * 1024 // 100 MiB
const EXPIRES_IN = 15 // 15 分钟

export const getPolicy = (key: string, bucket: string) => {
  const data = {
    expiration: addMinutes(new Date(), EXPIRES_IN).toISOString(),
    conditions: [
      { bucket },
      ['content-length-range', 0, MAX_SIZE],
      ['eq', '$key', key],
    ],
  }

  const json = JSON.stringify(data)
  return Buffer.from(json).toString('base64')
}

function addMinutes(date: Date, minutes: number) {
  date.setMinutes(date.getMinutes() + minutes)
  return date
}

function signature(policy) {
  return crypto.createHmac('sha1', ALIYUN_PASS).update(policy).digest('base64')
}

function apiPolicy(
  path: string,
  verb: string,
  date,
  md5 = '',
  contentType = ''
) {
  return [
    verb.toUpperCase(),
    md5,
    contentType,
    date,
    `/${ALIYUN_OSS_BUCKET}/${path}`,
  ].join('\n')
}

export async function deleteCloudFile(path: string) {
  const date = new Date().toUTCString()
  const policy = apiPolicy(path, 'DELETE', date)
  logger.debug('policy: %o', policy)
  const sign = signature(policy)
  logger.debug('sign: %o', sign)
  const authorization = `OSS ${ALIYUN_KEY}:${sign}`

  const result = await axios.request({
    url: `/${path}`,
    method: 'DELETE',
    baseURL: host,
    headers: {
      date,
      authorization,
    },
  })

  logger.debug('cloud file deleted: %s', path)

  return result
}
