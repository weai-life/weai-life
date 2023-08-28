export const schema = gql`
  input StringFilter {
    contains: String
    endsWith: String
    equals: String
    startsWith: String
    in: [String!]
  }

  input IntFilter {
    equals: Int
    gt: Int
    gte: Int
    in: [Int!]
    lt: Int
    lte: Int
    notIn: [Int!]
  }

  input BooleanFilter {
    equals: Boolean
  }

  enum SortOrder {
    asc
    desc
  }
`
