# Setting Up WebApp Tunnel for Development

Telegram WebApps require a **public HTTPS URL** - `localhost` won't work. You need to create a tunnel to expose your local WebApp.

## Option 1: Cloudflare Tunnel (Recommended - Free, No Signup)

1. **Install cloudflared:**
   ```powershell
   winget install --id Cloudflare.cloudflared
   ```
   Or download from: https://github.com/cloudflare/cloudflared/releases

2. **Start the tunnel:**
   ```powershell
   cloudflared tunnel --url http://localhost:5173
   ```

3. **Copy the HTTPS URL** it gives you (e.g., `https://xxxxx.trycloudflare.com`)

4. **Update `.env` file:**
   ```
   WEBAPP_URL=https://xxxxx.trycloudflare.com
   ```

5. **Restart the bot** to load the new URL

## Option 2: Ngrok (Requires Signup)

1. **Sign up at:** https://ngrok.com (free account)

2. **Download and install ngrok**

3. **Start tunnel:**
   ```bash
   ngrok http 5173
   ```

4. **Copy the HTTPS URL** (e.g., `https://xxxxx.ngrok.io`)

5. **Update `.env` file:**
   ```
   WEBAPP_URL=https://xxxxx.ngrok.io
   ```

6. **Restart the bot**

## Quick Setup Script

You can also use the provided script:
```powershell
.\setup-tunnel.ps1
```

## Important Notes

- The tunnel URL changes each time you restart it (unless you use a paid ngrok plan)
- You need to update `.env` and restart the bot each time the URL changes
- For production, deploy to Vercel/Netlify and use that URL instead

## Testing

After setting up the tunnel:
1. Update `.env` with the tunnel URL
2. Restart the bot
3. Send `/start` in Telegram
4. Click "📊 Open Market" button
5. The WebApp should open!

