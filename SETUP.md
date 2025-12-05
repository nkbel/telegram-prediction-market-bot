# Quick Setup Guide

## Step 1: Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd webapp
npm install
cd ..
```

## Step 2: Get Your Telegram Bot Token

1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Copy the bot token you receive

## Step 3: Get Your Telegram User ID

1. Open Telegram and search for [@userinfobot](https://t.me/userinfobot)
2. Send any message to the bot
3. Copy your user ID (a number like `123456789`)

## Step 4: Configure Environment

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and fill in:
   - `BOT_TOKEN`: Your bot token from Step 2
   - `ADMIN_IDS`: Your user ID from Step 3 (comma-separated if multiple admins)
   - `WEBAPP_URL`: Keep as `http://localhost:5173` for local development

## Step 5: Run the Application

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run webapp:dev
```

## Step 6: Test the Bot

1. Open Telegram and find your bot
2. Send `/start` to initialize
3. Test admin command: `/admin_create_event Will it rain tomorrow? | Weather prediction | 2024-12-20`
4. Click "Open Market" button to launch the WebApp
5. Place a test bet
6. Resolve the event: `/admin_resolve_event 1 yes`

## Troubleshooting

- **Bot not responding**: Check that `BOT_TOKEN` is correct in `.env`
- **WebApp not loading**: Make sure both backend and frontend are running
- **Database errors**: Delete `data/database.db` and restart (database will be recreated)
- **Admin commands not working**: Verify your user ID is in `ADMIN_IDS` in `.env`

