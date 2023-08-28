import faktory from 'faktory-worker'
import { FAKTORY_URL } from './env'

type CreateJobInput = {
  jobtype: string
  args: unknown[]
  at?: Date | string
  retry?: number
}

export const createJob = async ({
  jobtype,
  args,
  at,
  retry,
}: CreateJobInput) => {
  const client = await faktory.connect({ url: FAKTORY_URL })

  const jid = await client.push({
    jobtype,
    args,
    at,
    retry,
  })

  await client.close()

  return jid
}

export const cancelJob = async (jid: string) => {
  const client = await faktory.connect({ url: FAKTORY_URL })
  const job = client.scheduled.withJids(jid)
  await job.discard()
  await client.close()
}
