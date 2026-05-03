# GitHub Pages Deployment

Target repository: `fengyuraoo/codex`

Final URL:

`https://fengyuraoo.github.io/codex/`

## First Setup

1. Push this project to the `main` branch of `fengyuraoo/codex`.
2. Open the GitHub repository page.
3. Go to **Settings > Pages**.
4. Under **Build and deployment**, set **Source** to **GitHub Actions**.
5. Go to **Actions** and wait for **Deploy GitHub Pages** to finish.
6. Open `https://fengyuraoo.github.io/codex/` on the MatePad browser.

## Update Later

1. Commit changes.
2. Push to `main`.
3. GitHub Actions builds the static Next.js export and deploys the `out` folder automatically.

## Notes

- GitHub Pages uses `/codex/`, so production builds set `basePath` and `assetPrefix` to `/codex`.
- Local development can still use the normal localhost path.
- Materials and recordings stay in the browser through IndexedDB. Use **Settings > Export Full Backup** before clearing browser data or changing devices.
