export const schema = gql`
  type ActivityStat {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    userId: Int!
    user: User!
    date: String!
    count: Int!
  }

  type Query {
    """
    默认返回最近30天数据，最大能返回365天数据
    """
    activityStats(userId: Int!, take: Int): [ActivityStat!] @requireAuth
  }
`
