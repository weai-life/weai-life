import OSS from 'ali-oss'
import {
  ALIYUN_KEY,
  ALIYUN_PASS,
  ALIYUN_OSS_PAGE_BUCKET,
  ALIYUN_OSS_PAGE_REGION,
  ALIYUN_OSS_TEMPLATE_BUCKET,
  ALIYUN_OSS_TEMPLATE_REGION,
} from '../env'
import { logger } from '../../logger'

export const hostForTemplate = `https://${ALIYUN_OSS_TEMPLATE_BUCKET}.${ALIYUN_OSS_TEMPLATE_REGION}.aliyuncs.com`

const pageStore = new OSS({
  accessKeyId: ALIYUN_KEY,
  accessKeySecret: ALIYUN_PASS,
  bucket: ALIYUN_OSS_PAGE_BUCKET,
  region: ALIYUN_OSS_PAGE_REGION,
})

const tmplStore = new OSS({
  accessKeyId: ALIYUN_KEY,
  accessKeySecret: ALIYUN_PASS,
  bucket: ALIYUN_OSS_TEMPLATE_BUCKET,
  region: ALIYUN_OSS_TEMPLATE_REGION,
})

export async function listDir(dirKey: string) {
  for await (const object of objects(dirKey)) {
    logger.debug(`object %s`, object.url)
  }
}

export async function copyDir(dirKey: string) {
  for await (const object of objects(dirKey)) {
    logger.debug(`copy object %s`, object.url)
    await pageStore.copy(object.name, object.name, ALIYUN_OSS_PAGE_BUCKET)
  }
}

export async function copyDir2(sourcePrefix: string, targetPrefix: string) {
  for await (const batch of batchObjects(sourcePrefix)) {
    if (!batch) {
      logger.error('[%s] 下没有发现模板文件', sourcePrefix)
      throw new Error('模板文件不存在')
    }

    const promise = batch
      .filter((object) => !object.name.endsWith('/')) // skip dir
      .map((object) => {
        logger.debug(`copy object %o`, object)

        const name = object.name.replace(sourcePrefix, targetPrefix)

        logger.debug(`copy to %s`, name)

        return pageStore.copy(name, object.name, ALIYUN_OSS_TEMPLATE_BUCKET)
      })

    if (promise) await Promise.all(promise)
  }
}

async function* objects(prefix: string) {
  for await (const batch of batchObjects(prefix)) {
    for (const object of batch) {
      if (!object.name.endsWith('/')) yield object
    }
  }
}

async function* batchObjects(prefix: string, batchSize = 100) {
  let continuationToken = null
  let res

  do {
    res = await tmplStore.listV2({
      prefix,
      continuationToken,
      'max-keys': batchSize,
    })

    continuationToken = res.nextContinuationToken

    logger.debug('nextContinuationToken %s', continuationToken)

    yield res.objects
  } while (continuationToken)
}
