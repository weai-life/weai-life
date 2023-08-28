import { getCurrentUser } from 'src/lib/context'
import { ResolverArgs, UserInputError } from '@redwoodjs/graphql-server'
import DB, { Prisma } from '@prisma/client'

import { db } from 'src/lib/db'
import { oss, paginate, env } from 'src/lib/utils'
import { authorize, TemplatePolicy as policy } from 'src/lib/policies'
import type { PagesInputArgs } from '../pages/pages'

export interface TemplatesInputArgs {
  page?: number
  pageSize?: number
  where?: Prisma.TemplateWhereInput
  orderBy?: Prisma.TemplateOrderByWithRelationInput
}

export const templates = async ({
  where = {},
  ...input
}: TemplatesInputArgs = {}) => {
  return queryTemplates({
    ...input,
    where,
  })
}

export const myTemplates = async ({
  where = {},
  ...input
}: TemplatesInputArgs = {}) => {
  return queryTemplates({
    ...input,
    where: {
      ...where,
      userId: getCurrentUser().id,
    },
  })
}

async function queryTemplates({
  page,
  pageSize,
  where = {},
  orderBy = { id: 'desc' },
}: TemplatesInputArgs = {}) {
  return paginate({
    page,
    pageSize,
    fun: ({ skip, take }) => {
      return db.template.findMany({ skip, take, where, orderBy })
    },
  })
}

export const template = ({ id }: Prisma.TemplateWhereUniqueInput) => {
  return db.template.findUnique({
    where: { id },
  })
}

interface CreateTemplateArgs {
  input: Omit<Prisma.TemplateUncheckedCreateInput, 'userId'>
}

export const createTemplate = async ({ input }: CreateTemplateArgs) => {
  await authorize(policy.create)()
  validateName(input.name)

  return db.template.create({
    data: {
      ...input,
      userId: context?.currentUser?.id as number,
    },
  })
}

const VALID_NAME_REGEX = /^[a-z][a-z0-9_-]{3,29}$/i
function validateName(name) {
  if (!VALID_NAME_REGEX.test(name))
    throw new UserInputError(
      'name(名称)必须使用英文字母开头且只能使用英文、数字、-、_字符，长度4~30'
    )
}

interface UpdateTemplateArgs extends Prisma.TemplateWhereUniqueInput {
  input: Prisma.TemplateUpdateInput
}

export const updateTemplate = async ({ id, input }: UpdateTemplateArgs) => {
  const target = await db.template.findUnique({
    where: { id },
  })

  await authorize(policy.update)(target)

  return db.template.update({
    data: input,
    where: { id },
  })
}

export const deleteTemplate = async ({
  id,
}: Prisma.TemplateWhereUniqueInput) => {
  const target = await db.template.findUnique({
    where: { id },
  })

  await authorize(policy.destroy)(target)

  return db.template.delete({
    where: { id },
  })
}

export const Template = {
  pages: (
    {
      page,
      pageSize,
      where = {},
      orderBy = { id: 'asc' },
    }: PagesInputArgs = {},
    { root }: ResolverArgs<ReturnType<typeof template>>
  ) =>
    paginate({
      page,
      pageSize,
      fun: ({ skip, take }) => {
        return db.template
          .findUnique({
            where: { id: root.id },
          })
          .pages({ skip, take, where, orderBy })
      },
    }),

  user: (_obj, { root }: ResolverArgs<ReturnType<typeof template>>) =>
    db.template.findUnique({ where: { id: root.id } }).user(),

  uploadInfo: (_obj, { root }: ResolverArgs<DB.Template>) => {
    const bucket = env.ALIYUN_OSS_TEMPLATE_BUCKET

    return {
      host: oss.hostForTemplate,
      formParams: JSON.stringify(oss.formParams(getKey(root), bucket)),
    }
  },
}

const ZIP_FILE_PREFIX = '__uploaded_zip__'
// 返回云存储路径
function getKey(template: DB.Template) {
  return `${ZIP_FILE_PREFIX}/${template.name}.zip`
}
