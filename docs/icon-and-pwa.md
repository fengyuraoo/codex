# Icon and PWA

## App Name

The app name is **Speaking Map**.

## Icon Files

- `public/favicon.svg`
- `public/icons/icon-192.png`
- `public/icons/icon-512.png`
- `public/icons/maskable-icon-512.png`
- `public/icons/apple-touch-icon.png`

The icon uses a warm beige background with simple brown node-map and speaking-tool line marks.

## PWA Files

- Manifest: `public/manifest.webmanifest`
- Metadata and mobile theme color: `src/app/layout.tsx`

## Install Behavior

The desktop or home-screen name should be **Speaking Map**. This setup supports adding the site to the home screen. It does not add a complex offline service worker, so it is a stable install shortcut rather than a full offline app.
