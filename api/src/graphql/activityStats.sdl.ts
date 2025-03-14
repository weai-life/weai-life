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
    Returns data for the last 30 days by default, maximum can return data for 365 days
    """
    activityStats(userId: Int!, take: Int): [ActivityStat!] @requireAuth
  }
`
