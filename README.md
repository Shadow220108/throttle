# Throttle

**Build anything that can fly. We fund it.** A Hack Club You Ship, We Ship program for teens 13–18.


## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## What's here (Phase 0)

- `src/app/page.tsx`: one-screen landing page (sky, Hack Club flag, title, subheading, RSVP)
- `src/components/SkyPlane.tsx`: red biplane towing a banner on a swooping path (banner text: `BANNER_TEXT`)
- `src/components/Waitlist.tsx` + `src/app/actions.ts`: RSVP form (server action)
- `src/components/ThrottleHero.tsx`, `FlyerIcons.tsx`, `Plane.tsx`: earlier designs, not used on the page right now

## Waitlist storage

By default signups go to `.data/waitlist.json` (git-ignored). To send them to Airtable instead, copy
`.env.example` to `.env.local` and fill in `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID`. The table needs an `Email` field.
