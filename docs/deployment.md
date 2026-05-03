# Deployment

Recommended target: **Vercel**.

## First Deploy

1. Push this project to a GitHub repository.
2. Open Vercel and choose **Add New Project**.
3. Import the GitHub repository.
4. Keep the default Next.js settings.
5. Click **Deploy**.

Vercel will provide a fixed HTTPS link. Open that link on the MatePad browser.

## Update Later

1. Commit code changes.
2. Push to the same GitHub branch.
3. Vercel redeploys automatically.

## Data Reminder

This app stores materials and recordings in the browser with IndexedDB. Deployment updates do not upload or sync recordings. Use **Settings > Export Full Backup** before clearing browser data or moving devices.
