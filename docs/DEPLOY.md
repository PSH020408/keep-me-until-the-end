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

Create an **empty** repository on github.com (no README, no .gitignore), `keep-me-until-the-end`, then:

```bash
git remote add origin https://github.com/PSH020408/keep-me-until-the-end.git
git push -u origin main
```

(With the GitHub CLI: `gh repo create keep-me-until-the-end --public --source=. --remote=origin --push`.)

`.gitignore` leaves out the raw art sheets (`Dogs/`, `Fish/`); the game only uses the cut sprites in `public/img`.

## 2. Render

1. render.com → sign in with GitHub → **New** → **Blueprint** → pick the repository.
2. Render reads `render.yaml`: static site `keep-me-until-the-end`, publish directory `public`, no build command,
   security headers, a week of caching for sprites, and every unknown path rewritten to the game.
3. **Apply.** The site appears at `https://keep-me-until-the-end.onrender.com` (or the name Render gives it).
   Every push to `main` redeploys.

By hand instead: **New → Static Site** → repository → Build command *(empty)* → Publish directory `public`.

## 3. Shared memorial (Supabase)

The shared memorial needs one Supabase project (free tier, Seoul). Steps, SQL and moderation are in
[SHARING.md](SHARING.md); the project URL and the publishable key live in `public/js/share.js`. Leaving
them empty hides the feature.

## 4. After the first deploy

- Live: https://keep-me-until-the-end.onrender.com — linked at the top of `README.md`; `og:url`, `og:image` and the canonical link use it.
- If the address ever changes, update those three tags in `public/index.html` and the README.
- Check on a phone (Safari and Chrome): start a life, finish it, keep it in 주마등, replay it.

### Is a push live?

Render → the service → **Deploys**. The *Trigger* column says what started each deploy:

| Trigger | Meaning |
|---|---|
| New commit | a push to `main` deployed itself — auto-deploy works |
| Blueprint | Render applied `render.yaml` (when the service was created or the file changed) |
| Manual | someone pressed **Manual Deploy → Deploy latest commit** |

The footer of the page shows the version (`베타 v0.9.x`); it must match `package.json` after a deploy.
If a push does not appear as *New commit*, check **Settings → Build & Deploy → Auto-Deploy** (On Commit)
and that Render's GitHub app can see the repository; **Manual Deploy** always works as a fallback.
(2026-10-12: v0.9.27–0.9.31 were pushed but never deployed; the site stayed on v0.9.26 until a manual deploy.)

## Checklist (beta)

- [x] OG image `public/og.png` (1200×630), favicon (svg, 32 px png, apple-touch-icon)
- [x] layouts checked at 320, 360, 390, 768, 1024, 1440 px and a landscape phone — no horizontal scroll
- [x] `node tools/sim.mjs 6000` runs without errors; anchors in LOG.md
- [x] only localStorage is used (stated in the footer)
