# Deploy Bot Server to Make API Work

The WebApp is deployed but can't access the API because the bot server is on localhost.

## Quick Fix: Tunnel the API Server

### Option 1: Localtunnel
```powershell
lt --port 3000
```
Copy the URL (e.g., `https://xxxxx.loca.lt`)

### Option 2: Serveo
```powershell
ssh -R 80:localhost:3000 serveo.net
```
Copy the URL (e.g., `https://xxxxx.serveo.net`)

Then set Vercel environment variable:
- Go to Vercel project settings
- Add environment variable: `VITE_API_URL` = your tunnel URL
- Redeploy

## Permanent Solution: Deploy Bot Server

### Railway (Recommended)
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub"
4. Select your repository
5. Set root directory: `/` (root)
6. Add environment variables:
   - `BOT_TOKEN` = your bot token
   - `PORT` = 3000 (or let Railway assign)
   - `WEBAPP_URL` = https://telegram-prediction-market-bot.vercel.app
   - `ADMIN_IDS` = 484815401
   - `DB_PATH` = ./data/database.db
7. Deploy!

### Render
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repo
5. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node
6. Add environment variables (same as Railway)
7. Deploy!

After deployment, update Vercel environment variable `VITE_API_URL` with your bot server URL.

