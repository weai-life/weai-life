export const standard = defineScenario({
  user: {
    owner: {
      data: { mobile: 'mp4123901', name: 'String' },
    },
    member: {
      data: { mobile: 'mp4123902', name: 'String' },
    },
    other: {
      data: { mobile: 'mp4123903', name: 'String' },
    },
    mpUser: {
      data: { mobile: 'mp4123904', name: 'String' },
    },
    admin: {
      data: { mobile: 'mp4123909', name: 'String', isAdmin: true },
    },
  },
  group: {
    one: {
      data: {
        name: 'String',
        description: 'Description',
        owner: { connect: { mobile: 'mp4123901' } },
        groupUsers: {
          create: [
            {
              status: 'JOINED',
              user: { connect: { mobile: 'mp4123902' } },
            },
            {
              status: 'JOINED',
              user: { connect: { mobile: 'mp4123904' } },
            },
          ],
        },
        mpUsers: {
          create: [
            {
              user: { connect: { mobile: 'mp4123904' } },
              openid: 'openid',
            },
          ],
        },
      },
    },
  },
})
