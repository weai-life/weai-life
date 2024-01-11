import crypto from 'crypto'
import path from 'path'

import DB, { Prisma } from '@prisma/client'

import { ResolverArgs } from '@redwoodjs/graphql-server'

import { getCurrentUser } from 'src/lib/context'
import { db } from 'src/lib/db'
import { authorize, AttachmentPolicy as policy } from 'src/lib/policies'
import { paginate } from 'src/lib/utils'
import * as s3 from 'src/lib/utils/s3'

export interface AttachmentsInputArgs {
  page?: number
  pageSize?: number
  where?: Prisma.AttachmentWhereInput
  orderBy?: Prisma.AttachmentOrderByWithRelationInput
}

export const attachments = async ({
  page,
  pageSize,
  where = {},
  orderBy = { id: 'desc' },
}: AttachmentsInputArgs = {}) => {
  await authorize(policy.list)()

  return paginate({
    page,
    pageSize,
    fun: ({ skip, take }) => {
      return db.attachment.findMany({ skip, take, where, orderBy })
    },
  })
}

export const attachment = async ({ id }: Prisma.AttachmentWhereUniqueInput) => {
  const target = await db.attachment.findUnique({
    where: { id },
  })

  await authorize(policy.read)(target)

  return target
}

interface CreateAttachmentArgs {
  input: Omit<Prisma.AttachmentUncheckedCreateInput, 'userId'>
}

export const createAttachment = async ({ input }: CreateAttachmentArgs) => {
  await authorize(policy.create)()

  return db.attachment.create({
    data: {
      ...input,
      userId: getCurrentUser().id,
      hash: hash(),
    },
  })
}

function hash() {
  return crypto
    .createHash('md5')
    .update(new Date().toISOString())
    .digest('hex')
    .slice(0, 6)
}
interface UpdateAttachmentArgs extends Prisma.AttachmentWhereUniqueInput {
  input: Prisma.AttachmentUpdateInput
}

export const updateAttachment = async ({ id, input }: UpdateAttachmentArgs) => {
  const attachment = await db.attachment.findUnique({ where: { id } })
  await authorize(policy.update)(attachment)

  return db.attachment.update({
    data: input,
    where: { id },
  })
}

export const deleteAttachment = async ({
  id,
}: Prisma.AttachmentWhereUniqueInput) => {
  const attachment = await db.attachment.findUnique({ where: { id } })
  await authorize(policy.destroy)(attachment)

  const result = await db.attachment.delete({
    where: { id },
  })

  if (result.status === 'UPLOADED') {
    await s3.deleteCloudFile(getKey(result))
  }

  return result
}

export const Attachment = {
  user: (_obj, { root }: ResolverArgs<DB.Attachment>) =>
    db.attachment.findUnique({ where: { id: root.id } }).user(),

  key: (_obj, { root }: ResolverArgs<DB.Attachment>) => getKey(root),

  url: ({ style }, { root }: ResolverArgs<DB.Attachment>) => {
    let filepath = getKey(root)

    if (style) filepath += `!${style}`

    if (root.public) {
      return `${s3.host}/${filepath}`
    } else {
      return 'Error private url, need to implement'
    }
  },

  signedUrl: (_obj, { root }: ResolverArgs<DB.Attachment>) => {
    const filepath = getKey(root)

    return s3.signedUrl(filepath)
  },
}

// 返回云存储路径
function getKey(attachment: DB.Attachment) {
  const extname = path.extname(attachment.filename)
  const filename =
    [attachment.id, attachment.hash].filter((x) => x).join('-') + extname
  const prefix = attachment.public ? 'p' : 's'
  return `${prefix}/u/${attachment.userId}/f/${filename}`
}
