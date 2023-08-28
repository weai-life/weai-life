import { User } from '@prisma/client'
import axios from 'axios'
import FormData from 'form-data'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import { oss, getHash } from 'src/lib/utils'

export const storeUserAvatar = (url: string) => async (user: User) => {
  const key = getKey(user)

  logger.debug('start to download avatarfile %s', url)
  logger.debug('upload to key: %s', key)
  // download image file
  const stream = await downloadFile(url)

  logger.debug('downloaded jpg file')

  // upload to cdn
  await uploadToCDN(key, stream)
    .then(function (response) {
      logger.debug(JSON.stringify(response.data))
      return updateAvatarUrl(user, `${oss.host}/${key}`)
    })
    .catch(logger.error) // slient error

  return user
}

const downloadFile = (url: string) =>
  axios
    .get<NodeJS.ReadStream>(url, { responseType: 'stream' })
    .then((r) => r.data)

const uploadToCDN = (path: string, stream: NodeJS.ReadStream) => {
  logger.debug('start to upload file to CDN %s', path)

  const form = new FormData()
  const params = oss.formParams(path)
  logger.debug('form params %o', params)
  for (const key in params) {
    form.append(key, params[key])
  }

  logger.debug('form Data headers: %o', form.getHeaders())
  logger.debug('form Data: %o', form)

  const name = path.split('/').pop()
  form.append('file', stream, name)

  return axios.post(oss.host, form, {
    headers: {
      ...form.getHeaders(),
    },
  })
}

const updateAvatarUrl = (user: User, avatarUrl: string) =>
  db.user.update({
    where: { id: user.id },
    data: {
      avatarUrl,
    },
  })

const getKey = (user: User) => {
  return `p/u/${user.id}/avatar/${getHash()}.jpg`
}
