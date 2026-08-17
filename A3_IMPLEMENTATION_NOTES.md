# A3 implementation notes

This branch/worktree extends the existing A2 project. It deliberately avoids Cloud Functions and paid cloud services.

## Implemented in this revision

- **D.1 External Authentication:** Firebase Authentication integration for normal member registration/login. Existing staff demo accounts remain local for marking. Configuration is read from `.env`.
- **D.3 Interactive Table Data:** Booking, rating and user tables now support global search, per-column filtering, sorting and 10-row pagination. Seed data contains more than 10 rows so pagination can be demonstrated.
- **D.4 Deployment:** GitHub Pages workflow included. Uses the existing GitHub account/repository.
- **E.2 Geo Location:** Leaflet + OpenStreetMap service map, category filters, browser geolocation, distance/nearest-service calculation, and routing links. No API account/key is required.
- **E.3 Accessibility:** skip link, visible keyboard focus, accessible table controls, reduced-motion support, form error associations and accessible map/list fallback.
- **E.4 Export:** real client-side CSV and PDF downloads for bookings and users. No export service is required.
- **F.1 Innovation:** constrained booking (capacity/duplicate/time-conflict checks), interactive admin chart/dashboard, and the geolocation service finder.

## Intentionally not implemented

- **D.2 Email API:** normally requires an external email service/account.
- **E.1 Cloud Functions:** intentionally skipped to avoid billing risk.

## Firebase setup (existing project only)

1. In the existing Firebase project, enable **Authentication > Sign-in method > Email/Password**.
2. Register/reuse the Firebase Web App and copy its config values.
3. Copy `.env.example` to `.env` and fill the four `VITE_FIREBASE_*` values.
4. In Firebase Authentication settings, add your deployed GitHub Pages host (for example `yuzk47-coder.github.io`) to **Authorized domains** if it is not already listed.
5. Never put billing details or service-account private keys in `.env`.

## GitHub Pages

In the existing repository, open **Settings > Pages** and choose **GitHub Actions** as the source. The included workflow deploys on pushes to `main`. Add the four Firebase config values as repository Actions secrets if D.1 must work in the deployed site.
