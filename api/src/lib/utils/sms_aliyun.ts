import Core from '@alicloud/pop-core'
import { logger } from '../logger'
import {
  ALIYUN_KEY,
  ALIYUN_PASS,
  ALIYUN_SMS_ENDPOINT,
  ALIYUN_SMS_API_VERSION,
} from './env'

const client = new Core({
  accessKeyId: ALIYUN_KEY,
  accessKeySecret: ALIYUN_PASS,
  endpoint: ALIYUN_SMS_ENDPOINT,
  apiVersion: ALIYUN_SMS_API_VERSION,
})

const TEMPLATE_CODE = 'SMS_197135307'

type SMSResult = {
  Code: string
  Message: string
  RequestId: string
  BizId: string
}

export const sendSms = async (mobile: string, code: string) => {
  const params = {
    PhoneNumbers: mobile,
    SignName: '一颗果子',
    TemplateCode: TEMPLATE_CODE,
    TemplateParam: `{"code":"${code}"}`,
  }

  const requestOption = {
    method: 'POST',
  }

  try {
    const result = (await client.request(
      'SendSms',
      params,
      requestOption
    )) as SMSResult
    logger.trace({ label: 'SMS' }, JSON.stringify(result))

    if (result.Code !== 'OK') {
      logger.error({ label: 'SMS' }, result.Message)
      throw new Error(result.Message)
    }

    return result
  } catch (err) {
    logger.error({ label: 'SMS' }, err)
    throw new Error(err.message)
  }
}
