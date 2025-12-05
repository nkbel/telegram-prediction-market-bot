# Quick Tunnel Setup Guide

## The Problem
Telegram WebApps need a **public HTTPS URL**. `localhost` won't work.

## Easiest Solution: Ngrok

### Step 1: Get Ngrok
1. Go to https://ngrok.com
2. Sign up (free)
3. Download ngrok for Windows
4. Extract `ngrok.exe` to your project folder (or any folder in PATH)

### Step 2: Start Tunnel
Open a new terminal in your project folder and run:
```powershell
.\ngrok.exe http 5173
```

Or if ngrok is in your PATH:
```powershell
ngrok http 5173
```

### Step 3: Copy the URL
You'll see something like:
```
Forwarding   https://abc123.ngrok.io -> http://localhost:5173
```

Copy the HTTPS URL: `https://abc123.ngrok.io`

### Step 4: Update .env
Edit your `.env` file and change:
```
WEBAPP_URL=https://abc123.ngrok.io
```

### Step 5: Restart Bot
Stop and restart your bot to load the new URL.

### Step 6: Test
1. Send `/start` in Telegram
2. Click "📊 Open Market" button
3. WebApp should open! 🎉

## Alternative: Cloudflared

If you prefer cloudflared:

1. Download from: https://github.com/cloudflare/cloudflared/releases
2. Extract `cloudflared.exe` to your project folder
3. Run: `.\cloudflared.exe tunnel --url http://localhost:5173`
4. Copy the HTTPS URL it shows
5. Update `.env` and restart bot

## Using the Helper Script

I've created a helper script. Just run:
```powershell
.\start-tunnel.ps1
```

It will automatically detect and use ngrok or cloudflared if available.

## Important Notes

- **Keep the tunnel running** while testing the WebApp
- The URL changes each time you restart the tunnel (unless using paid ngrok)
- For production, deploy to Vercel/Netlify instead

## Troubleshooting

**"ngrok not found"**: Make sure `ngrok.exe` is in your project folder or in your system PATH

**"WebApp still doesn't open"**: 
- Make sure the tunnel is running
- Check that `.env` has the correct URL
- Restart the bot after updating `.env`
- Make sure the WebApp dev server is running on port 5173

