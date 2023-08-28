export const schema = gql`
  type ActivityStream {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    user: User!
    userId: Int!
    data: JSON!
    channelId: Int
    channel: Channel
  }

  type PagedActivityStreams {
    data: [ActivityStream!]!
    hasNext: Boolean!
  }

  type Query {
    myActivityStreams(
      page: Int
      pageSize: Int
      where: ActivityStreamsWhereInput
      orderBy: ActivityStreamsOrderByInput
    ): PagedActivityStreams! @requireAuth
    # activityStreams: [ActivityStream!]!
    # activityStream(id: Int!): ActivityStream
  }

  input ActivityStreamsWhereInput {
    type: StringFilter
  }

  input ActivityStreamsOrderByInput {
    id: SortOrder
    type: SortOrder
  }

  # input CreateActivityStreamInput {
  #   userId: Int!
  #   data: JSON!
  # }

  # input UpdateActivityStreamInput {
  #   userId: Int
  #   data: JSON
  # }

  # type Mutation {
  #   createActivityStream(input: CreateActivityStreamInput!): ActivityStream!
  #   updateActivityStream(id: Int!, input: UpdateActivityStreamInput!): ActivityStream!
  #   deleteActivityStream(id: Int!): ActivityStream!
  # }
`
