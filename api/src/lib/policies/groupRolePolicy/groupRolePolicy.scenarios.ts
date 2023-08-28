export const standard = defineScenario({
  user: {
    admin: {
      data: { mobile: 'grp4123900', name: 'String', isAdmin: true },
    },
    owner: {
      data: { mobile: 'grp4123901', name: 'String' },
    },
    member: {
      data: { mobile: 'grp4123902', name: 'String' },
    },
    roleCreate: {
      data: { mobile: 'grp4123903', name: 'String' },
    },
    roleUpdate: {
      data: { mobile: 'grp4123904', name: 'String' },
    },
    roleDelete: {
      data: { mobile: 'grp4123905', name: 'String' },
    },
    other: {
      data: { mobile: 'grp4123909', name: 'String' },
    },
  },
  permission: {
    createRole: {
      data: {
        updatedAt: '2022-01-02T14:17:54Z',
        key: 'CREATE_ROLE',
        name: 'Create Role',
      },
    },
    updateRole: {
      data: {
        updatedAt: '2022-01-02T14:17:54Z',
        key: 'UPDATE_ROLE',
        name: 'Update Role',
      },
    },
    deleteRole: {
      data: {
        updatedAt: '2022-01-02T14:17:54Z',
        key: 'DELETE_ROLE',
        name: 'Delete Role',
      },
    },
  },
  groupRole: {
    one: {
      data: {
        updatedAt: '2022-01-05T09:24:43Z',
        name: 'one',
        group: {
          create: {
            name: 'String',
            owner: { connect: { mobile: 'grp4123901' } },
            groupUsers: {
              create: [
                {
                  status: 'JOINED',
                  user: { connect: { mobile: 'grp4123901' } },
                },
                {
                  status: 'JOINED',
                  user: { connect: { mobile: 'grp4123902' } },
                },
              ],
            },
          },
        },
      },
    },
    roleCreate: {
      data: {
        updatedAt: '2022-01-05T09:24:44Z',
        name: 'create',
        group: {
          create: {
            name: 'String',
            owner: { connect: { mobile: 'grp4123901' } },
            groupUsers: {
              create: [
                {
                  status: 'JOINED',
                  user: { connect: { mobile: 'grp4123901' } },
                },
                {
                  status: 'JOINED',
                  user: { connect: { mobile: 'grp4123902' } },
                },
              ],
            },
          },
        },
        users: { connect: [{ mobile: 'grp4123903' }] },
        permissions: {
          connect: [{ key: 'CREATE_ROLE' }],
        },
      },
    },
    roleUpdate: {
      data: {
        updatedAt: '2022-01-05T09:24:44Z',
        name: 'update',
        group: {
          create: {
            name: 'String',
            owner: { connect: { mobile: 'grp4123901' } },
            groupUsers: {
              create: [
                {
                  status: 'JOINED',
                  user: { connect: { mobile: 'grp4123901' } },
                },
                {
                  status: 'JOINED',
                  user: { connect: { mobile: 'grp4123902' } },
                },
              ],
            },
          },
        },
        users: { connect: [{ mobile: 'grp4123904' }] },
        permissions: {
          connect: [{ key: 'UPDATE_ROLE' }],
        },
      },
    },
    roleDelete: {
      data: {
        updatedAt: '2022-01-05T09:24:44Z',
        name: 'delete',
        group: {
          create: {
            name: 'String',
            owner: { connect: { mobile: 'grp4123901' } },
            groupUsers: {
              create: [
                {
                  status: 'JOINED',
                  user: { connect: { mobile: 'grp4123901' } },
                },
                {
                  status: 'JOINED',
                  user: { connect: { mobile: 'grp4123902' } },
                },
              ],
            },
          },
        },
        users: { connect: [{ mobile: 'grp4123905' }] },
        permissions: {
          connect: [{ key: 'DELETE_ROLE' }],
        },
      },
    },
  },
})
