# Deploy: GitHub → Render (beta)

The site is static (`public/`), so it runs as a free Render **Static Site** — no server, no cold start.

## 1. GitHub (on the Mac, in Terminal)

```bash
cd path/to/PetSim
git init -b main
git config user.name "PARK, SEHO"
git config user.email "<your email>"
git add .
git commit -m "Keep Me — Until the End: public beta v0.9.25"
```

Create an **empty** repository on github.com (no README, no .gitignore), for example `petsim`, then:

```bash
git remote add origin https://github.com/<your-id>/petsim.git
git push -u origin main
```

(With the GitHub CLI: `gh repo create petsim --public --source=. --remote=origin --push`.)

`.gitignore` leaves out the raw art sheets (`Dogs/`, `Fish/`); the game only uses the cut sprites in `public/img`.

## 2. Render

1. render.com → sign in with GitHub → **New** → **Blueprint** → pick the repository.
2. Render reads `render.yaml`: static site `petsim`, publish directory `public`, no build command,
   security headers, a week of caching for sprites, and every unknown path rewritten to the game.
3. **Apply.** The site appears at `https://petsim.onrender.com` (or the name Render gives it).
   Every push to `main` redeploys.

By hand instead: **New → Static Site** → repository → Build command *(empty)* → Publish directory `public`.

## 3. After the first deploy

- Put the live URL in the repository description and at the top of `README.md`.
- Share preview: `og:image` is relative (`og.png`); most apps resolve it, but for KakaoTalk and
  Slack set it to the absolute URL (`https://<site>/og.png`) and push again.
- Check on a phone (Safari and Chrome): start a life, finish it, keep it in 주마등, replay it.

## Checklist (beta)

- [x] OG image `public/og.png` (1200×630), favicon (svg, 32 px png, apple-touch-icon)
- [x] layouts checked at 320, 360, 390, 768, 1024, 1440 px and a landscape phone — no horizontal scroll
- [x] `node tools/sim.mjs 6000` runs without errors; anchors in LOG.md
- [x] only localStorage is used (stated in the footer)
