import { parseLink as parseLinkHelper } from './lib'
import retry from 'async-retry'

interface ParseLinkArgs {
  input: { url: string }
}

export const parseLink = async ({ input }: ParseLinkArgs) => {
  const { url } = input

  if (!url) {
    throw new Error('url is required')
  }

  return retry(() => parseLinkHelper(url), { retries: 3 })
}
