# deaddrops.me

Next.js (App Router) web frontend for DeadDrops.

## Dev

Env:
- Copy `.env.example` to `.env` and fill Firebase + RevenueCat + Sentry.

Run (via the backend compose stack):

```bash
cd C:\GitHub\api.deaddrops.me
docker compose up --build
```

Pages:
- `/` home
- `/login` Firebase Auth (email/password)
- `/subscribe` RevenueCat offerings (dynamic pricing)
- `/admin` Admin dashboard (requires backend role=admin)

