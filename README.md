# Calm Rest booking platform

This repository contains three independently deployed applications:

| Application | Directory | Production |
| --- | --- | --- |
| Guest website | `frontend` | https://www.calmrestmidigama.com |
| Admin dashboard | `Dashbord 2` | https://admin.calmrestmidigama.com |
| Express API | `backend` | https://hotel-managment-system-six.vercel.app/api |

## Development

Use Node 24, matching the production runtime and CI. Run `npm ci` in each application directory. Copy each `.env.example` to `.env`, then supply private credentials locally. Never commit environment files.

Start `npm run dev` in the backend, frontend, and admin directories. The two Vite apps use `VITE_API_BASE_URL=http://localhost:5000/api`. Include both local Vite origins in backend `ALLOWED_ORIGINS`. If local MongoDB SRV lookups fail, set `DNS_SERVERS` to working DNS resolvers; production uses its own system DNS unless explicitly configured.

MongoDB must support transactions: use Atlas or a replica set. Reservation creation and inventory changes serialize on the room record inside a transaction, preventing concurrent overselling. Each room document represents one category; `inventory` is its physical room count (defaults to one). Review inventory for existing room categories before accepting reservations.

## Validation

- Frontend and admin: `npm run lint`, `npm run build` (includes strict TypeScript checking).
- Backend: `npm test`. Tests start a disposable MongoDB replica set and mock email transport; they never write to production or send guest emails. To use an installed MongoDB binary, set `MONGOMS_SYSTEM_BINARY`; otherwise MongoMemoryServer downloads a binary.
- Each application: `npm audit --omit=dev`. Production dependencies had no reported vulnerabilities at release validation. Some development tooling dependencies still have moderate advisories; avoid exposing development servers publicly and review upstream updates.
- GitHub Actions runs these checks for main pushes and pull requests.

## Authentication and operations

Public registration always creates guests. Only an existing authenticated administrator may call `POST /api/users/admin`. Google sign-in requires a signed Firebase ID token, verified against Google's keys, project audience, issuer, expiration and provider; supplied email addresses alone cannot sign in. Existing local accounts are never implicitly linked to Google identities. JWT authorization looks up the current account and role; logout revokes previously issued tokens for that account. Configure a random JWT secret of at least 32 characters. Password recovery uses 15-minute hashed single-use tokens; successful reset revokes existing sessions. Configure `FRONTEND_URL` if password reset links should target a different public site.

Bookings support guest checkout with validated dates, guest limits, server-calculated prices, and request idempotency. New bookings start Pending unless auto-confirm is enabled. Admins can confirm, check in/out, cancel, and delete bookings. Closed bookings cannot be reopened. The application reserves rooms; it does not collect online payments. Dashboard value charts show reservation value, not settled payments, and omit unknown historical prices rather than inventing rates.

Owner notifications are sent to `ADMIN_NOTIFICATION_EMAIL` (Calm Rest's Gmail account). SMTP delivery is awaited and failures are retained in the email-job collection; use Settings > Retry email delivery after correcting credentials. Guest receipt emails accurately distinguish requests from confirmed bookings. Owner alerts remain enabled even when guest confirmation emails are disabled. Use a Gmail app password for SMTP, not the Gmail account password. Delivery to the actual inbox still depends on the provider and spam filtering.

Messages retain their read status. Hotel settings persist in MongoDB and online-booking policy is enforced by the API. Room cards use responsive Cloudinary transformations, square layouts and lazy loading; routes are loaded separately. Admin image uploads use the existing Cloudinary unsigned preset: restrict that preset's allowed formats, size, folder and moderation in Cloudinary. Client upload limits are usability checks and are not a provider-side security boundary.

## Deployment and remaining security operations

The three existing Vercel projects use their corresponding root directories. Production API URL, CORS origins, JWT, Firebase project and SMTP variables must be configured in Vercel. Never put backend secrets in `VITE_` variables. Runtime secrets belong in production environment variables; the `.vercelignore` excludes local environments, dependencies, tests and scratch files from uploads.

The original repository tracked `backend/.env`. It is now untracked and ignored, and the JWT secret has been replaced. Historical commits still contain the original credentials. Rotate MongoDB and SMTP credentials at their providers; removing the latest file does not invalidate leaked passwords. History rewriting requires separate coordination with repository collaborators and was not performed.

Rate limits use per-instance memory. For high traffic or distributed abuse protection across Vercel instances, use a shared rate-limit store or Vercel WAF. Email jobs retry during submissions or explicit administrator retries; no recurring background scheduler has been provisioned. Existing legacy booking documents keep their original data; missing statuses are treated conservatively as pending reservations and unknown historical prices are not guessed.

Browser automation was unavailable in this session, so production HTTP checks, builds and automated tests do not substitute for manual mobile/desktop visual QA or a real Google popup sign-in test.


### Guest experience and inventory update — November 2026

- Room gallery and cards show complete photos using square frames and contain fitting. Decorative hero images retain their own presentation.
- Existing password accounts can connect Google after verifying the Google ID token and confirming the existing password once. Subsequent Google sign-ins preserve the same account and local password access.
- `/api/bookings/mine` returns account-owned reservations. Earlier guest reservations are visible only after verified Google identity or an eight-digit email verification code. Codes expire after ten minutes, are single-use, and stop working after five incorrect attempts; endpoint throttling also applies.
- Guests can save name, country, and phone in My account. Booking forms prefill signed-in details, show availability for the requested stay, and display a reference and accurate pending/confirmed success state. New accounts sign in after registration.
- Email includes escaped branded HTML and a plain-text alternative. Booking status changes queue guest updates when guest notifications are enabled. SMTP delivery remains queued and retryable through admin settings; queuing is not proof of inbox delivery.
- The dashboard refreshes every 30 seconds while visible and on focus/mutations. Its seven-night planner subtracts overlapping active reservations from each category's physical inventory, excluding departure night. The room editor validates form fields and prevents duplicate clicks while saving.
- Short-lived (20-second) browser memory caching applies only to the public room catalogue. Date-specific availability, authentication, and private data are not cached. Booking writes still revalidate inventory transactionally.
- Shared notifications, session loading, and booking success animations respect reduced-motion preferences. Local browser checks cover 390px and 1440px guest and admin layouts using mocked API fixtures; live Google popup and actual inbox receipt require a real account.
