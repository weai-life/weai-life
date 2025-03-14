type StringEnv = Record<string, string>

const defaultENV = {
  JWT_SECRET: 'I09BbxowYvvUzNdARKtUHJboNKLrRvhzXePx',
  LOG_LEVEL: 'info',
  NODE_ENV: 'development',
  REDIS_PREFIX: 'guxi:',

  // https://help.aliyun.com/document_detail/25489.html
  ALIYUN_SMS_ENDPOINT: 'https://dysmsapi.aliyuncs.com',
  ALIYUN_SMS_API_VERSION: '2017-05-25',
}

const allEnv: StringEnv = {
  ...defaultENV,
  ...process.env,
}

if (process.env.NODE_ENV === 'production') {
  console.log('node version:', process.version)
  console.log('LOG_LEVEL:', allEnv.LOG_LEVEL)
}

const envProxy = new Proxy(allEnv, {
  get(env, key: string) {
    if (!env[key]) {
      throw new Error(`Missing ${key} ENV var`)
    }

    return env[key]
  },
})

// all env vars are guaranteed to be string
export const {
  DATABASE_URL,
  LOG_LEVEL,
  JWT_SECRET,
  NODE_ENV,
  REDIS_PREFIX,
  REDIS_URL,
  FAKTORY_URL,
  EMAIL_USER,
  EMAIL_PASS,
  RESEND_API_KEY,
  AZURE_EMAIL_CONNECTION_STRING,
  AZURE_EMAIL_SENDER,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_CLOUDFRONT_DOMAIN_NAME,
} = envProxy
