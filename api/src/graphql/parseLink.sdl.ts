export const schema = gql`
  input parseLinkInput {
    url: String!
  }

  type PraseLinkPayload {
    title: String
    description: String
    image: String
    url: String
    oEmbed: OEmbedPayload
  }

  type OEmbedPayload {
    type: String
    html: String
  }

  type Query {
    parseLink(input: parseLinkInput!): PraseLinkPayload @requireAuth
  }
`
