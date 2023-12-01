import nodemailer from 'nodemailer'

import { logger } from '../logger'

import { EMAIL_USER, EMAIL_PASS } from './env'

const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com', // hostname
  secureConnection: false, // TLS requires secureConnection to be false
  port: 587, // port for secure SMTP
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  tls: {
    ciphers: 'SSLv3',
  },
})

export const sendVerificationCode = async (email: string, code: string) => {
  try {
    const info = await transporter.sendMail({
      from: '"Applets Group" <applets.group@outlook.com>', // sender address
      to: email, // list of receivers
      subject: 'Verify email', // Subject line
      text: code, // plain text body
      html: `<b>${code}</b>`, // html body
    })

    console.log('Message sent: %s', info.messageId)
  } catch (err) {
    logger.error({ label: 'SMS' }, err)
    throw new Error(err.message)
  }
}
