import nodemailer from 'nodemailer'

interface LoginDetails {
  email: string
  name?: string | null
  time: Date
  ip?: string
  userAgent?: string
  platform?: string
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendLoginNotification(details: LoginDetails) {
  const { email, name, time, ip, userAgent, platform } = details

  const subject = `New Login to Operone${platform ? ` (${platform})` : ''}`
  
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New Login Detected</h2>
      <p>Hello ${name || 'User'},</p>
      <p>We detected a new login to your Operone account.</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Time:</strong> ${time.toLocaleString()}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${platform ? `<p><strong>Platform:</strong> ${platform}</p>` : ''}
        ${ip ? `<p><strong>IP Address:</strong> ${ip}</p>` : ''}
        ${userAgent ? `<p><strong>Device:</strong> ${userAgent}</p>` : ''}
      </div>

      <p>If this was you, you can ignore this email.</p>
      <p>If you did not sign in, please contact support immediately.</p>
    </div>
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject,
      html,
    })
    console.log(`Login notification sent to ${email}`)
  } catch (error) {
    console.error('Failed to send login notification:', error)
  }
}
