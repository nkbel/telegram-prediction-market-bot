# Localtunnel Setup (No Signup Required!)

Since ngrok is blocked in your country, we'll use **localtunnel** instead - it's free and requires no signup!

## Step 1: Start the Tunnel

Open a new terminal and run:
```powershell
lt --port 5173
```

Or use the helper script:
```powershell
.\start-localtunnel.ps1
```

## Step 2: Copy the URL

You'll see output like:
```
your url is: https://random-name-123.loca.lt
```

Copy the HTTPS URL (the one starting with `https://`)

## Step 3: Update .env File

Open `.env` and change:
```
WEBAPP_URL=https://random-name-123.loca.lt
```
(Use your actual localtunnel URL)

## Step 4: Restart the Bot

Restart the bot to load the new URL.

## Step 5: Test

1. Send `/start` in Telegram
2. Click "📊 Open Market" button
3. WebApp should open! 🎉

---

## Important Notes

- **Keep the localtunnel terminal open** while using the WebApp
- The URL changes each time you restart localtunnel
- If the URL stops working, just restart localtunnel and update `.env` again
- Localtunnel is free and requires no account!

## Troubleshooting

**"lt command not found"**: Make sure localtunnel is installed:
```powershell
npm install -g localtunnel
```

**"WebApp doesn't open"**: 
- Make sure localtunnel is running
- Check that `.env` has the correct URL
- Restart the bot after updating `.env`
- Make sure WebApp dev server is running on port 5173

