import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { fromEnv } from '@aws-sdk/credential-providers' // ES6 import
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { AWS_CLOUDFRONT_DOMAIN_NAME } from '../env'

const client = new S3Client({
  region: 'ap-southeast-1',
  credentials: fromEnv(),
})

const getUploadURL = async function (name) {
  const params = {
    Bucket: 'weai',
    Key: name,
  }

  const command = new PutObjectCommand(params)
  const url = await getSignedUrl(client, command, { expiresIn: 3600 })
  return url
}

export const signedUrl = getUploadURL

export const host = AWS_CLOUDFRONT_DOMAIN_NAME

export const deleteObject = async (fileKey) => {
  try {
    const params = {
      Bucket: 'weai',
      Key: fileKey,
    }
    const data = await client.send(new DeleteObjectCommand(params))
    return data
  } catch (err) {
    console.log('Error', err)
  }
}
