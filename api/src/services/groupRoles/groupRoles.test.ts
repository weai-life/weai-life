import { db } from 'src/lib/db'
import {
  groupRoles,
  groupRole,
  createGroupRole,
  updateGroupRole,
  deleteGroupRole,
  addUsersToGroupRole,
  removeUsersFromGroupRole,
} from './groupRoles'
import type { StandardScenario } from './groupRoles.scenarios'

const getGroupRoleWithPermissionId = (permissionId: number) =>
  db.groupRole.findFirst({
    where: {
      permissions: {
        some: {
          id: permissionId,
        },
      },
    },
  })

const getGroupRoleWithUserId = (userId: number) =>
  db.groupRole.findFirst({
    where: {
      users: {
        some: {
          id: userId,
        },
      },
    },
  })

describe('groupRoles', () => {
  scenario('returns all groupRoles', async (scenario: StandardScenario) => {
    const result = await groupRoles({
      where: {
        groupId: scenario.groupRole.one.groupId,
      },
    })

    expect(result.length).toEqual(1)
  })

  scenario('returns a single groupRole', async (scenario: StandardScenario) => {
    const result = await groupRole({ id: scenario.groupRole.one.id })

    expect(result).toEqual(scenario.groupRole.one)
  })

  scenario('creates a groupRole', async (scenario: StandardScenario) => {
    const result = await createGroupRole({
      input: {
        updatedAt: '2022-01-05T09:24:43Z',
        name: 'String',
        groupId: scenario.groupRole.two.groupId,
        permissionIds: [scenario.permission.one.id],
        userIds: [scenario.user.one.id],
      },
    })

    expect(result.name).toEqual('String')
    expect(result.groupId).toEqual(scenario.groupRole.two.groupId)
    const result2 = getGroupRoleWithPermissionId(
      scenario.permission.one.id
    ).then((x) => x.id)
    expect(result2).resolves.toEqual(result.id)

    const result3 = await getGroupRoleWithUserId(scenario.user.one.id).then(
      (x) => x.id
    )
    expect(result3).toEqual(result.id)
  })

  scenario(
    'creates a groupRole without userIds',
    async (scenario: StandardScenario) => {
      const result = await createGroupRole({
        input: {
          updatedAt: '2022-01-05T09:24:43Z',
          name: 'String',
          groupId: scenario.groupRole.two.groupId,
          permissionIds: [scenario.permission.one.id],
        },
      })

      expect(result.name).toEqual('String')
      expect(result.groupId).toEqual(scenario.groupRole.two.groupId)
      const result2 = getGroupRoleWithPermissionId(
        scenario.permission.one.id
      ).then((x) => x.id)
      expect(result2).resolves.toEqual(result.id)
    }
  )

  scenario('updates a groupRole', async (scenario: StandardScenario) => {
    const original = await groupRole({ id: scenario.groupRole.one.id })
    const result = await updateGroupRole({
      id: original.id,
      input: { name: '2022-01-06T09:24:43Z' },
    })

    expect(result.name).toEqual('2022-01-06T09:24:43Z')
  })

  scenario(
    'updates permission of a groupRole',
    async (scenario: StandardScenario) => {
      const original = await groupRole({ id: scenario.groupRole.two.id })
      const result = await updateGroupRole({
        id: original.id,
        input: {
          // replace permission 2 with 3
          permissionIds: [scenario.permission.three.id],
        },
      })

      const result2 = await getGroupRoleWithPermissionId(
        scenario.permission.two.id
      )
      expect(result2).toEqual(null)

      const result3 = await getGroupRoleWithPermissionId(
        scenario.permission.three.id
      ).then((x) => x.id)
      expect(result3).toEqual(result.id)
    }
  )

  scenario('deletes a groupRole', async (scenario: StandardScenario) => {
    const original = await deleteGroupRole({ id: scenario.groupRole.one.id })
    const result = await groupRole({ id: original.id })

    expect(result).toEqual(null)
  })

  scenario('add users to a groupRole', async (scenario: StandardScenario) => {
    const original = await groupRole({ id: scenario.groupRole.two.id })
    const result = await addUsersToGroupRole({
      groupRoleId: original.id,
      userIds: [scenario.user.three.id],
    })

    expect(result).toEqual(true)

    const result2 = await getGroupRoleWithUserId(scenario.user.two.id)
    expect(result2.id).toEqual(original.id)

    const result3 = await getGroupRoleWithUserId(scenario.user.three.id)
    expect(result3.id).toEqual(original.id)
  })

  scenario(
    'remove users from a groupRole',
    async (scenario: StandardScenario) => {
      const original = await groupRole({ id: scenario.groupRole.two.id })
      const result = await removeUsersFromGroupRole({
        groupRoleId: original.id,
        userIds: [scenario.user.two.id],
      })

      expect(result).toEqual(true)

      const result2 = getGroupRoleWithUserId(scenario.user.two.id)
      expect(result2).resolves.toEqual(null)
    }
  )
})
