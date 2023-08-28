export const schema = gql`
  type InvitePayload {
    code: String!
  }

  type InviteInfo {
    channel: Channel
    group: Group
    inviter: User!
  }

  type Query {
    getInviteInfo(inviteCode: String!): InviteInfo @skipAuth
  }

  type Mutation {
    genInviteCode(channelId: Int!): InvitePayload @requireAuth
    genInviteCodeForGroup(groupId: Int!): InvitePayload @requireAuth
  }
`
