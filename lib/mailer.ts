import nodemailer from 'nodemailer'

export const mailer = nodemailer.createTransport({
  host:   'smtp-mail.outlook.com',
  port:   587,
  secure: false,
  auth: {
    user: process.env.OUTLOOK_EMAIL,
    pass: process.env.OUTLOOK_PASSWORD,
  },
  tls: { ciphers: 'SSLv3' },
})
