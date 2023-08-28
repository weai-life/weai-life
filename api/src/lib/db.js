// See https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/constructor
// for options.

import { PrismaClient } from '@prisma/client'

import { emitLogLevels, handlePrismaLogging } from '@redwoodjs/api/logger'

import { logger } from './logger'

const logLevels = ['info', 'warn', 'error', 'query']

/*
 * Instance of the Prisma Client
 */
export const db = new PrismaClient({
  log: emitLogLevels(logLevels),
})

handlePrismaLogging({
  db,
  logger,
  logLevels,
})
