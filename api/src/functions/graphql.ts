// import { useLogger } from '@envelop/core'

import { createGraphQLHandler } from '@redwoodjs/graphql-server'

import directives from 'src/directives/**/*.{js,ts}'
import sdls from 'src/graphql/**/*.sdl.{js,ts}'
import services from 'src/services/**/*.{js,ts}'

import { getCurrentUser } from 'src/lib/auth'
import { getContext } from 'src/lib/context'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import { redis, env } from 'src/lib/utils'

export const handler = createGraphQLHandler({
  context: getContext,
  directives,
  sdls,
  services,

  cors: {
    origin: '*',
    credentials: true,
  },

  onException: () => {
    // Disconnect from your database with an unhandled exception.
    db.$disconnect()
    redis.client.quit()
  },

  getCurrentUser,

  loggerConfig: {
    logger,
    options: {
      operationName: true,
      requestId: env.NODE_ENV === 'production',
      query: true,
      // data: true,
      excludeOperations: ['IntrospectionQuery'],
      // showConfig: true,
    },
  },

  // depthLimitOptions: { maxDepth: 10 }, // default is 10,

  // extraPlugins: [useRequestLogger()],
})

// should logged here but not
// https://github.com/redwoodjs/redwood/blob/5280736241dd0e29107ecf8f88767aa0aab0dd95/packages/graphql-server/src/functions/graphql.ts#L252
// function useRequestLogger() {
//   const logFn = (msg, { args }) => {
//     if (msg === 'execute-start') {
//       const { query, operationName, variables, extensions } = args.contextValue

//       logger.info(
//         {
//           custom: {
//             query: query.replace(/\n/, '').replace(/\s+/g, ' '),
//             operationName,
//             variables,
//             extensions,
//           },
//         },
//         msg
//       )
//     }
//   }

//   return useLogger({ logFn, skipIntrospection: true })
// }
