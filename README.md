# Kerlos Amir — Portfolio

A summer-vacation cartoon portfolio inspired by *Phineas and Ferb*, built with Next.js 16, Tailwind CSS 4 and Motion.

It stars two characters drawn as animated SVG components in [`components/characters.tsx`](components/characters.tsx): **Kerlos** (a cartoon version of me) and my cockatiel, a female normal grey. Limbs, wings and the crest are separate groups, posed and animated by the `rig-*` keyframes in `app/globals.css`; on Main Street Kerlos's steps and her wingbeats follow the scroll. Click her on the backyard fence for a surprise.

In the hero they also appear in 3D: Kerlos with her on his shoulder, built from primitives with three.js in [`components/hero/kerlos-3d-cast.ts`](components/hero/kerlos-3d-cast.ts) (cel shading and ink outlines in the same palette) and animated in [`kerlos-3d-stage.ts`](components/hero/kerlos-3d-stage.ts). It loads in its own chunk after the page is up, and falls back to the 2D pair without WebGL. Drag to spin them round; poke either of them.

Each section is a scene from one summer day:

| Section | Scene |
| --- | --- |
| Intro | "Today's episode…" title card that irises open |
| Hero | Backyard with a big 3D Kerlos and his cockatiel on his shoulder, plus a cockatiel on the fence (click her) |
| About | "Whatcha doin'?" with a to-do notebook and count-up stats |
| Experience | Secret-agent mission dossiers along a pneumatic tube |
| Apps | Blueprint sheets that "build" into real screenshots, plus a swipeable gallery |
| Websites | Main Street storefronts; hover a shop window to tour the whole site |
| Skills | Tool tags hanging on a garage pegboard |
| Contact / Footer | Sunset, then night |

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (the page is fully static)
npm run lint
```

## Editing content

All text lives in [`lib/data.ts`](lib/data.ts): profile and links, stats, experience, mobile apps, websites and skills. Components read from there, so most updates need no component changes.

Images are in `public/media`:

- `apps/<slug>/01.webp, 02.webp, …`: phone screenshots (framed, about 900px wide)
- `apps/digitalhouse/demo.mp4`: demo video, loaded only when the gallery opens
- `sites/<slug>/desktop.webp`, `full.webp` (full-page capture, 900px wide), `mobile.webp`

### Adding the Flower app screenshots

1. Save the screenshots as `public/media/apps/flower/01.webp`, `02.webp`, and so on.
2. In `lib/data.ts`, find the `flower` entry and:
   - set `screens` to the number of images
   - set `size` to their pixel size
   - pick the three `cover` screens
   - remove `blueprintOnly`
   - replace the description with the real one

### Adding a website

Add an entry to `websites` in `lib/data.ts` and put `desktop.webp`, `full.webp` and `mobile.webp` in `public/media/sites/<slug>/`. Set `fullHeight` to the height of `full.webp`.

## Deploying

On Vercel it works as-is. On any other host, set `NEXT_PUBLIC_SITE_URL` (for example `https://kerlos.dev`) so link previews use absolute image URLs.

---

An unofficial fan tribute. *Phineas and Ferb* belongs to Disney; this site is not affiliated with or endorsed by Disney. Tech logos come from [Devicon](https://devicon.dev) (MIT).
