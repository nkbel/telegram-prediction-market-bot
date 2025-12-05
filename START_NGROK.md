# How to Start Ngrok

## Step 1: Sign Up for Ngrok (Free)
1. Go to: https://dashboard.ngrok.com/signup
2. Create a free account
3. After signing up, go to: https://dashboard.ngrok.com/get-started/your-authtoken
4. Copy your authtoken (it looks like: `2abc123def456ghi789jkl012mno345pq_6r7s8t9u0v1w2x3y4z5`)

## Step 2: Configure Ngrok
Run this command (replace YOUR_TOKEN with your actual token):
```powershell
.\ngrok.exe config add-authtoken YOUR_TOKEN_HERE
```

## Step 3: Start the Tunnel
Run this command:
```powershell
.\ngrok.exe http 5173
```

## Step 4: Copy the URL
You'll see output like:
```
Forwarding   https://a1b2c3d4.ngrok-free.app -> http://localhost:5173
```

Copy the HTTPS URL (the one starting with `https://`)

## Step 5: Update .env File
Open `.env` and change:
```
WEBAPP_URL=https://a1b2c3d4.ngrok-free.app
```
(Use your actual ngrok URL)

## Step 6: Restart the Bot
Restart the bot to load the new URL.

---

## Quick Start (After Setup)
Once configured, you can just run:
```powershell
.\ngrok.exe http 5173
```

Keep this terminal open while using the WebApp!

