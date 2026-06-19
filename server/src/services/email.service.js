import { config } from '../config/env.js'
import { HttpError } from '../core/http/error.types.js'
import { logger } from '../core/logging/logger.js'

export async function sendServerDeliveryEmail({
  toEmail,
  customerName,
  serverName,
  serverDetails,
  delivery,
}) {
  if (!config.brevoApiKey) {
    throw new HttpError(
      503,
      'Email service is not configured. Set BREVO_API_KEY in environment.',
      'EMAIL_NOT_CONFIGURED'
    )
  }

  const subject = `Your server is ready: ${serverName}`
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Hello ${customerName},</h2>
      <p>Your server <strong>${serverName}</strong> is ready. Below are your access details.</p>
      <h3>Server Details</h3>
      <p>${serverDetails || 'N/A'}</p>
      <h3>Login / Access Details</h3>
      <ul>
        <li><strong>IP:</strong> ${delivery.serverIp}</li>
        <li><strong>Username:</strong> ${delivery.serverUsername}</li>
        <li><strong>Password:</strong> ${delivery.serverPassword}</li>
        <li><strong>Panel URL:</strong> ${delivery.serverPanelUrl || 'N/A'}</li>
      </ul>
      ${
        delivery.additionalNotes
          ? `<h3>Additional Notes</h3><p>${delivery.additionalNotes}</p>`
          : ''
      }
      <p>If you need help, please reply to this email or contact our support team.</p>
      <p>Thank you for your business.</p>
    </div>
  `

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': config.brevoApiKey,
    },
    body: JSON.stringify({
      sender: {
        name: config.brevoSenderName,
        email: config.brevoSenderEmail,
      },
      to: [{ email: toEmail, name: customerName }],
      subject,
      htmlContent,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    logger.error('Brevo email failed', { status: response.status, body })
    throw new HttpError(502, 'Failed to send email', 'EMAIL_SEND_FAILED')
  }

  return response.json()
}
