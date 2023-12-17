import nodemailer from 'nodemailer'
import { Resend } from 'resend'

import { logger } from '../logger'

import { EMAIL_USER, EMAIL_PASS, RESEND_API_KEY } from './env'

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

const resend = new Resend(RESEND_API_KEY)

export const resendSESCode = async (email: string, code: string) => {
  try {
    const data = await resend.emails.send({
      from: 'Applets.Group <hi@applets.group>',
      to: email,
      subject: 'Verify email from Applets Group',
      html: `<p>Code: <strong>${code}</strong> .Welcome to use Applets Group!</p>`,
    })

    console.log(
      'Resend Message sent: %s',
      JSON.stringify({
        data,
      })
    )
  } catch (err) {
    logger.error({ label: 'SMS' }, err)
    throw new Error(err.message)
  }
}

export const resendInvitationLink = async (
  email: string,
  link: string,
  inviter: string
) => {
  try {
    const data = await resend.emails.send({
      from: 'Applets.Group <hi@applets.group>',
      to: email,
      subject: `Invitation from ${inviter}`,
      html: `<p>I wanna invite you to use an applet together with me.</p><p><a href="${link}">Click this link to accpet invitation.</a></p><p> Or copy below link and open in the browser:</p><p>${link}</p>`,
    })

    console.log(
      'Resend Message sent: %s',
      JSON.stringify({
        data,
      })
    )
  } catch (err) {
    logger.error({ label: 'SMS' }, err)
    throw new Error(err.message)
  }
}
