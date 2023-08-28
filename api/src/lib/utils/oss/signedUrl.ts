import OSS from 'ali-oss'
import {
  ALIYUN_KEY,
  ALIYUN_PASS,
  ALIYUN_OSS_BUCKET,
  ALIYUN_OSS_REGION,
} from '../env'

const store = new OSS({
  accessKeyId: ALIYUN_KEY,
  accessKeySecret: ALIYUN_PASS,
  bucket: ALIYUN_OSS_BUCKET,
  region: ALIYUN_OSS_REGION,
  secure: true,
})

// url :: String => String => String
export const processUrl = (process) => (name) =>
  store.signatureUrl(name, {
    exipres: 1800, // 30分钟
    process,
  })

// signatureUrl :: String => String
export const signatureUrl = processUrl(undefined)
// previewdocUrl :: String => String
export const previewdocUrl = processUrl('imm/previewdoc')
