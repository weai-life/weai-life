import { ResolverArgs, UserInputError } from '@redwoodjs/graphql-server'
import { Prisma } from '@prisma/client'

import { db } from 'src/lib/db'
import { oss, paginate } from 'src/lib/utils'
import {
  authorize,
  ChannelPolicy,
  PagePolicy as policy,
} from 'src/lib/policies'

export interface PagesInputArgs {
  page?: number
  pageSize?: number
  where?: Prisma.PageWhereInput
  orderBy?: Prisma.PageOrderByWithRelationInput
}

export const pages = async ({ where = {}, ...input }: PagesInputArgs = {}) => {
  await authorize(policy.list)()

  return queryPages({
    ...input,
    where: {
      ...where,
    },
  })
}

async function queryPages({
  page,
  pageSize,
  where = {},
  orderBy = { id: 'desc' },
}: PagesInputArgs = {}) {
  return paginate({
    page,
    pageSize,
    fun: ({ skip, take }) => {
      return db.page.findMany({ skip, take, where, orderBy })
    },
  })
}

export const page = ({ id }: Prisma.PageWhereUniqueInput) => {
  return db.page.findUnique({
    where: { id },
  })
}

type ActivePageInput = {
  slug: string
}

export const activePage = ({ slug }: ActivePageInput) => {
  return db.page.findFirst({
    where: { slug, active: true },
  })
}

interface CreatePageArgs {
  input: Prisma.PageUncheckedCreateInput
}

export const createPage = async ({ input }: CreatePageArgs) => {
  await authorize(policy.create)(input.channelId)
  const data = downcaseSlug(input)

  validateName(input.slug)
  await validateSlugNotUsed(input.slug)

  try {
    const result = await db.page.create({
      data,
    })

    await copyTemplateFiles(result)

    return result
  } catch (err) {
    // https://github.com/prisma/prisma/issues/5040
    if (err.code === 'P2002') {
      // unique violation
      if (err.meta.target[0] === 'slug')
        throw new UserInputError('频道号(slug)已经被使用，请尝试使用其他字符')
      else if (err.meta.target[0] === 'channelId')
        throw new UserInputError('该频道已经创建了页面')
      else throw new Error('Unique Violation')
    } else throw err
  }
}

const downcaseSlug = <A extends { slug?: unknown }>(object: A): A => {
  if (object.slug && object.slug instanceof String) {
    object.slug = object.slug.toLowerCase()
  }

  return object
}

const VALID_NAME_REGEX = /^[a-z][a-z0-9_-]{3,29}$/i
function validateName(name: string) {
  if (!VALID_NAME_REGEX.test(name))
    throw new UserInputError(
      '频道号(slug)必须使用英文字母开头且只能使用英文、数字、-、_字符，长度4~30'
    )
}

async function validateSlugNotUsed(slug: string): Promise<void> {
  const count = await db.page.count({
    where: {
      slug: {
        equals: slug,
        mode: 'insensitive',
      },
    },
  })

  if (count > 0) throw new UserInputError('频道号(slug)已经被占用')
}

interface UpdatePageArgs extends Prisma.PageWhereUniqueInput {
  input: Prisma.PageUpdateInput
}

export const updatePage = async ({ id, input }: UpdatePageArgs) => {
  const page = await db.page.findUnique({ where: { id } })
  await authorize(policy.update)(page)

  const data = downcaseSlug(input)

  if (data.slug) {
    const slug = (data.slug as string).toLowerCase()
    validateName(slug)
    await validateSlugNotUsed(slug)
  }

  const result = await db.page.update({
    data,
    where: { id },
  })

  await copyTemplateFiles(result)

  return result
}

export const deletePage = async ({ id }: Prisma.PageWhereUniqueInput) => {
  const page = await db.page.findUnique({ where: { id } })
  await authorize(policy.destroy)(page)

  return db.page.delete({
    where: { id },
  })
}

export const Page = {
  channel: async (_obj, { root }: ResolverArgs<ReturnType<typeof page>>) => {
    const channel = await db.page
      .findUnique({ where: { id: root.id } })
      .channel()

    // 只有当频道是公开时才返回
    await authorize(ChannelPolicy.read)(channel)
    return channel
  },
}

async function copyTemplateFiles(page) {
  if (!page.templateId) return

  const template = await db.template.findUnique({
    where: {
      id: page.templateId,
    },
  })

  if (!template) throw new Error('找不到对应的模板')

  await oss.copyDir2(`${template.name}/`, `${page.slug}/`)
}
