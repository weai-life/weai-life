export const schema = gql`
  type Attachment {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    filename: String!
    status: AttachmentStatus!
    user: User!
    userId: Int!
    key: String!
    url(style: OSSStyleName, previewdoc: Boolean): String!
    uploadInfo: UploadInfo
    meta: JSON
    public: Boolean!
  }

  enum OSSStyleName {
    avatar
    cover
    nine_grids
    placeholder
  }

  enum AttachmentStatus {
    PENDING
    UPLOADED
  }

  type UploadInfo {
    host: String!
    formParams: String!
  }

  type PagedAttachments {
    data: [Attachment!]!
    hasNext: Boolean!
  }

  type Query {
    attachments(
      page: Int
      where: AttachmentsWhereInput
      orderBy: AttachmentsOrderByInput
    ): PagedAttachments @requireAuth
    attachment(id: Int!): Attachment @requireAuth
  }

  input AttachmentsWhereInput {
    title: StringFilter
  }

  input AttachmentsOrderByInput {
    id: SortOrder
  }

  input CreateAttachmentInput {
    filename: String!
    """
    默认 public: true
    """
    public: Boolean
    meta: JSON
  }

  input UpdateAttachmentInput {
    status: AttachmentStatus
    meta: JSON
  }

  type Mutation {
    createAttachment(input: CreateAttachmentInput!): Attachment! @requireAuth
    updateAttachment(id: Int!, input: UpdateAttachmentInput!): Attachment!
      @requireAuth
    deleteAttachment(id: Int!): Attachment! @requireAuth
  }
`
