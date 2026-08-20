# Silver Age Wellbeing Foundation — FIT5032 A3

Vue 3 + Vite web application extending the previous A2 submission.

## Implemented A3 features

- **D.1 External Authentication:** Firebase Authentication (Email/Password) for normal member registration and login. Local staff demo accounts are retained for role-based marking.
- **D.3 Interactive Table Data:** Admin booking, user and rating tables support sorting, global search, per-column filtering and 10-row pagination.
- **E.2 Geo Location:** Service map with category filters, browser geolocation, nearest-service distance and route links.
- **E.3 Accessibility:** Keyboard navigation, visible focus, skip link, accessible forms/tables, reduced-motion support and responsive layouts.
- **E.4 Export:** CSV and PDF export for booking and user data.
- **F.1 Innovation:** Constrained appointment booking, interactive admin dashboard/charts and geolocation service finder.

D.2 Email, D.4 Cloud Deployment and E.1 Cloud Functions are not included in this final version.

## Project setup

```sh
npm install
npm run dev
```

Production build:

```sh
npm run build
npm run preview
```

## Firebase Authentication setup

Copy `.env.example` to `.env` and provide the Firebase Web App values used for this assignment:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
```

Enable Email/Password sign-in in Firebase Authentication. If Firebase is not configured, local demo accounts remain available but external member authentication will not be demonstrated.

## Demo staff accounts

- Admin: `admin@test.com` / `admin123`
- Volunteer: `volunteer@test.com` / `vol123`
- User: `user@test.com` / `user123`
