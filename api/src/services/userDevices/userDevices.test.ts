/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { jpush } from 'src/lib/utils'
import { db } from 'src/lib/db'
import { updateUserDevice } from './userDevices'

jest.mock('@redwoodjs/graphql-server', () => {
  return {
    context: { clientInfo: { jpush: { registrationId: 'device1' } } },
  }
})

const mockCreate = jest.fn()
const mockUpdate = jest.fn()

const mockAddDeviceAlias = jest.fn()
const mockRemoveDeviceAlias = jest.fn()
jpush.addDeviceAlias = mockAddDeviceAlias
jpush.removeDeviceAlias = mockRemoveDeviceAlias

describe('updateUserDevice', () => {
  scenario(
    'call UpdateOrUnalias when has device info already',
    async (scenario) => {
      db.userDevice.update = mockUpdate

      await updateUserDevice(scenario.user.one.id)
      expect(mockAddDeviceAlias).toHaveBeenCalled()
      expect(mockUpdate).toHaveBeenCalled()
    }
  )

  scenario('unlias when number of device over 10', async (scenario) => {
    db.userDevice.update = mockUpdate

    await updateUserDevice(scenario.user.two.id)
    expect(mockAddDeviceAlias).toHaveBeenCalled()
    expect(mockRemoveDeviceAlias).toHaveBeenCalled()
    expect(mockUpdate).toHaveBeenCalled()
  })

  scenario(
    'call addUserDevice when has no device info yet',
    async (scenario) => {
      db.userDevice.create = mockCreate

      await updateUserDevice(scenario.user.three.id)
      expect(mockAddDeviceAlias).toHaveBeenCalled()
      expect(mockCreate).toHaveBeenCalled()
    }
  )
})
