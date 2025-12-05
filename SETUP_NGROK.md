# Quick Ngrok Setup

## Step 1: Download Ngrok
1. Go to: https://ngrok.com/download
2. Download "Windows" version
3. Extract `ngrok.exe` to this folder: `C:\Users\nikbe\OneDrive\Рабочий стол\bot\`

## Step 2: Sign Up (if you haven't)
1. Go to: https://dashboard.ngrok.com/signup
2. Create a free account
3. Get your authtoken from: https://dashboard.ngrok.com/get-started/your-authtoken
4. Run: `.\ngrok.exe config add-authtoken YOUR_TOKEN_HERE`

## Step 3: Start Tunnel
Run this command in a NEW terminal:
```powershell
.\ngrok.exe http 5173
```

## Step 4: Copy the Real URL
You'll see output like:
```
Forwarding   https://a1b2c3d4.ngrok-free.app -> http://localhost:5173
```

Copy the HTTPS URL (the one starting with https://)

## Step 5: Update .env
Change this line in `.env`:
```
WEBAPP_URL=https://a1b2c3d4.ngrok-free.app
```
(Use your actual ngrok URL, not the example)

## Step 6: Restart Bot
Restart the bot to load the new URL.

