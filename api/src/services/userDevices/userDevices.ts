import { context } from '@redwoodjs/graphql-server'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import DB from '@prisma/client'
import { jpush } from 'src/lib/utils'

export async function updateUserDevice(userId: number) {
  const registrationId = context.clientInfo?.jpush?.registrationId

  logger.debug('registrationid: %s', registrationId)

  if (!registrationId) return

  const userDevice = await getUserDevice(userId)
  logger.debug('userDevice: %o', userDevice)

  if (userDevice) {
    await updateOrUnalias(userId, registrationId, userDevice)
  } else {
    await addUserDevice(userId, registrationId)
  }
}

async function getUserDevice(userId: number) {
  return db.userDevice.findUnique({ where: { userId } })
}

export async function addUserDevice(userId: number, registrationId: string) {
  await setJPushAlias(userId, registrationId)
  return db.userDevice.create({
    data: {
      userId,
      devices: [registrationId],
    },
  })
}

export function setJPushAlias(userId: number, registrationId: string) {
  return jpush.addDeviceAlias(registrationId, userId.toString())
}

export async function updateOrUnalias(
  userId: number,
  registrationId: string,
  userDevice: DB.UserDevice
) {
  const previousSize = userDevice.devices.length
  const devices = sortDevice(userDevice.devices, registrationId)

  // 识别到新的设备时，需要设备别名
  if (devices.length > previousSize) await setJPushAlias(userId, registrationId)

  // 长度超过最大值时，把最早的设备去掉别名
  // TODO: 根据设备的最后访问更新列表顺序
  if (devices.length > jpush.JPUSH_MAX_NUMBER_DEVICE) {
    const old = devices.shift()
    if (old) await jpush.removeDeviceAlias(old)
  }

  await db.userDevice.update({
    where: { id: userDevice.id },
    data: { devices },
  })
}

export function sortDevice(devices: string[], newDevice: string) {
  const result = devices.filter((x) => x !== newDevice)
  result.push(newDevice)
  return result
}
