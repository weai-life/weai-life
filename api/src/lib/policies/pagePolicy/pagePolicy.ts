import { hasOwnerPermission } from './../channelPolicy/channelPolicy'
import { rejectNil } from 'src/lib/utils'
import { User, Page } from '@prisma/client'
import { db } from 'src/lib/db'
// import * as ChannelPolicy from '../channelPolicy/channelPolicy'

import { throwForbiddenErrorUnless, isAdmin, hasPermissionT } from '../lib'
import { task as T } from 'fp-ts'

const hasPermissionCreatePage = hasPermissionT('CREATE_PAGE')
const hasPermissionUpdatePage = hasPermissionT('UPDATE_PAGE')
const hasPermissionDeletePage = hasPermissionT('DELETE_PAGE')

const getChannel = (id: number) =>
  db.channel.findUnique({ where: { id } }).then(rejectNil('频道不存在'))

export const list = (user: User) => async () =>
  throwForbiddenErrorUnless('您无权访问')(isAdmin(user))

const any: (
  t1: T.Task<boolean>,
  t2: T.Task<boolean>
) => Promise<boolean> = async (t1, t2) => (await t1()) || (await t2())

export const create = (user: User) => async (channelId: number) =>
  getChannel(channelId)
    .then((channel) =>
      any(
        hasOwnerPermission(user)(channel),
        hasPermissionCreatePage(user)(channel.groupId)
      )
    )
    .then(throwForbiddenErrorUnless('您无权生成页面'))

export const update = (user: User) => async (page: Page) =>
  getChannel(page.channelId)
    .then((channel) =>
      any(
        hasOwnerPermission(user)(channel),
        hasPermissionUpdatePage(user)(channel.groupId)
      )
    )
    .then(throwForbiddenErrorUnless('您无权修改页面'))

export const destroy = (user: User) => async (page: Page) =>
  getChannel(page.channelId)
    .then((channel) =>
      any(
        hasOwnerPermission(user)(channel),
        hasPermissionDeletePage(user)(channel.groupId)
      )
    )
    .then(throwForbiddenErrorUnless('您无权删除页面'))
