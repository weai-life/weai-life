export const standard = defineScenario({
  user: {
    admin: {
      data: { mobile: 'attP123908', name: 'String', isAdmin: true },
    },
    owner: {
      data: { mobile: 'attP123903', name: 'String' },
    },
    other: {
      data: { mobile: 'attP123900', name: 'String' },
    },
  },
  attachment: {
    private: {
      data: {
        updatedAt: '2021-06-19T09:33:21Z',
        filename: 'String.jpg',
        user: {
          connect: {
            mobile: 'attP123903',
          },
        },
        public: false,
      },
    },
    public: {
      data: {
        updatedAt: '2021-06-19T09:33:21Z',
        filename: 'String.jpg',
        user: {
          connect: {
            mobile: 'attP123903',
          },
        },
        status: 'UPLOADED',
        public: true,
      },
    },
  },
})

export type StandardScenario = typeof standard
