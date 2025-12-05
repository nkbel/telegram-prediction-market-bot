# Deploy WebApp to Vercel (Permanent Solution)

If tunneling services are blocked, deploy your WebApp to Vercel - it's free and permanent!

## Step 1: Build the WebApp

```powershell
cd webapp
npm run build
```

## Step 2: Install Vercel CLI

```powershell
npm install -g vercel
```

## Step 3: Deploy

```powershell
cd webapp
vercel
```

Follow the prompts:
- Login to Vercel (or create account)
- Use default settings
- You'll get a URL like: `https://your-app.vercel.app`

## Step 4: Update .env

Change in `.env`:
```
WEBAPP_URL=https://your-app.vercel.app
```

## Step 5: Restart Bot

Restart the bot to load the new URL.

## Alternative: Manual Deploy via Website

1. Go to https://vercel.com
2. Sign up (free)
3. Click "Add New Project"
4. Connect your GitHub (or upload the `webapp` folder)
5. Set build command: `npm run build`
6. Set output directory: `dist`
7. Deploy!
8. Copy the deployment URL
9. Update `.env`

## Benefits

- ✅ Permanent URL (doesn't change)
- ✅ Free HTTPS
- ✅ No tunneling needed
- ✅ Works from anywhere
- ✅ Auto-deploys on code changes (if using GitHub)

