const emailJsConfig = {
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID
}

export const emailJsConfigured = Boolean(
  emailJsConfig.publicKey &&
  emailJsConfig.serviceId &&
  emailJsConfig.templateId
)

function errorMessageFromResponse(text, status) {
  const clean = String(text || '').trim()
  if (clean) return `Email service returned ${status}: ${clean}`
  return `Email service returned HTTP ${status}.`
}

/**
 * A3 D.2 - send a booking confirmation through the EmailJS REST API.
 *
 * EmailJS intentionally uses a browser-safe public key. The email content and
 * recipient fields are constrained by the template configured in EmailJS.
 */
export async function sendBookingConfirmation(booking) {
  if (!emailJsConfigured) {
    return {
      ok: false,
      skipped: true,
      message: 'EmailJS is not configured in this environment.'
    }
  }

  const templateParams = {
    to_email: booking.userEmail,
    to_name: booking.userName,
    booking_id: String(booking.id ?? ''),
    programme_name: booking.programmeName,
    session_date: booking.sessionDate,
    session_time: booking.sessionTime,
    location: booking.location || 'See programme details',
    phone: booking.phone || '',
    notes: booking.notes || 'None provided'
  }

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        service_id: emailJsConfig.serviceId,
        template_id: emailJsConfig.templateId,
        user_id: emailJsConfig.publicKey,
        template_params: templateParams
      })
    })

    if (!response.ok) {
      const text = await response.text()
      return { ok: false, message: errorMessageFromResponse(text, response.status) }
    }

    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      message: error?.message || 'The confirmation email could not be sent.'
    }
  }
}
