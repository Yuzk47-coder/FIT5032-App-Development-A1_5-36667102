# A3 D.2 EmailJS booking confirmation

This project sends a booking confirmation after a successful programme booking.
No Cloud Function or paid backend is required.

## Required `.env` values

```env
VITE_EMAILJS_PUBLIC_KEY=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
```

## Template variables expected by the app

Configure the EmailJS template with these variables:

- `{{to_email}}`
- `{{to_name}}`
- `{{booking_id}}`
- `{{programme_name}}`
- `{{session_date}}`
- `{{session_time}}`
- `{{location}}`
- `{{phone}}`
- `{{notes}}`

Set the template **To Email** field to `{{to_email}}`.

Suggested subject:

`Silver Age booking confirmation #{{booking_id}} - {{programme_name}}`

Suggested body:

Hello {{to_name}},

Your booking with Silver Age Wellbeing Foundation is confirmed.

Booking reference: #{{booking_id}}
Programme: {{programme_name}}
Date: {{session_date}}
Time: {{session_time}}
Location: {{location}}
Phone: {{phone}}
Notes: {{notes}}

Thank you,
Silver Age Wellbeing Foundation
