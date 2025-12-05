# 🎯 Telegram Prediction Market Bot

A Telegram bot with a WebApp that functions as a harmless prediction market for everyday events. Users can bet on fun, neutral topics like weather, personal habits, internet trends, and more - no politics, economics, or controversial topics!

## ✨ Features

- **Telegram Bot Interface**: Commands for browsing events, checking balance, and viewing bets
- **WebApp Trading Platform**: Full-featured web interface for browsing markets and placing bets
- **Betting System**: Buy YES/NO shares at market prices using in-game credits
- **Admin Panel**: Create events, resolve outcomes, and manage user balances
- **Automatic Settlements**: Payouts are automatically calculated and distributed when events resolve

## 🛠️ Tech Stack

- **Backend**: Node.js with Telegraf.js (Telegram bot framework)
- **Frontend**: React with Vite, Tailwind CSS
- **Database**: SQLite (can be easily upgraded to PostgreSQL)
- **Server**: Express.js for API endpoints

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Telegram Bot Token (get one from [@BotFather](https://t.me/BotFather))

## 🚀 Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd webapp
npm install
cd ..
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
# Telegram Bot Configuration
BOT_TOKEN=your_telegram_bot_token_here

# Server Configuration
PORT=3000
WEBAPP_URL=http://localhost:5173

# Admin Configuration (comma-separated Telegram user IDs)
ADMIN_IDS=123456789,987654321

# Database
DB_PATH=./data/database.db
```

**Important**: 
- Get your `BOT_TOKEN` from [@BotFather](https://t.me/BotFather) on Telegram
- Add your Telegram user ID(s) to `ADMIN_IDS` to access admin commands
- For production, update `WEBAPP_URL` to your deployed WebApp URL

### 3. Initialize the Database

The database will be automatically created on first run. The `data/` directory will be created if it doesn't exist.

### 4. Run the Application

#### Development Mode

**Terminal 1 - Backend (Bot + API Server):**
```bash
npm run dev
```

**Terminal 2 - Frontend (WebApp):**
```bash
npm run webapp:dev
```

#### Production Mode

**Build the WebApp:**
```bash
npm run webapp:build
```

**Start the server:**
```bash
npm start
```

The bot will start and the server will run on port 3000. The WebApp will be available at `http://localhost:5173` in development.

## 📱 Bot Commands

### User Commands

- `/start` - Welcome message and instructions
- `/events` - List all active events
- `/balance` - Check your current credit balance
- `/my_bets` - View your betting history

### Admin Commands

- `/admin_create_event <question> | <description> | <resolves_at>` - Create a new event
- `/admin_list_events` - List all events (active and resolved)
- `/admin_resolve_event <event_id> <yes|no>` - Resolve an event and distribute payouts
- `/admin_add_credits <user_id> <amount>` - Add credits to a user's account

**Example Admin Command:**
```
/admin_create_event Will it rain tomorrow? | Weather prediction for tomorrow | 2024-12-20
```

## 🎮 How It Works

### For Users

1. **Starting Balance**: New users receive 1000 credits automatically
2. **Browsing Events**: Use `/events` or click "Open Market" to see active predictions
3. **Placing Bets**: 
   - Select an event
   - Choose YES or NO
   - Enter the amount you want to bet
   - Confirm your bet
4. **Winning**: When an event resolves, if you bet correctly, you receive payouts automatically

### Market Pricing

- Prices are determined by the ratio of YES shares to NO shares
- If more people bet YES, the YES price goes up
- Prices range from 0.01 to 0.99 credits per share
- When you win, each share is redeemed for 1 credit

### Example

Event: "Will it rain tomorrow?"
- Current market: YES 70% | NO 30%
- You bet 10 credits on YES
- You receive: 10 / 0.7 = ~14.29 shares
- If YES wins: You get 14.29 credits (profit: 4.29 credits)
- If NO wins: You lose your 10 credits

## 📁 Project Structure

```
bot/
├── src/
│   ├── bot/
│   │   └── index.js          # Main bot file with commands and API routes
│   └── database/
│       ├── db.js             # Database connection and initialization
│       └── models.js         # Database models and operations
├── webapp/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EventsList.jsx
│   │   │   ├── EventDetail.jsx
│   │   │   └── Profile.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── data/
│   └── database.db           # SQLite database (created automatically)
├── .env                      # Environment variables (create from .env.example)
├── package.json
└── README.md
```

## 🔧 Database Schema

### Users Table
- `id` (INTEGER PRIMARY KEY) - Telegram user ID
- `username` (TEXT) - Telegram username
- `first_name` (TEXT) - User's first name
- `balance` (REAL) - Current credit balance
- `joined_at` (DATETIME) - Account creation timestamp

### Events Table
- `id` (INTEGER PRIMARY KEY) - Event ID
- `question` (TEXT) - Event question
- `description` (TEXT) - Detailed description
- `created_at` (DATETIME) - Creation timestamp
- `resolves_at` (DATETIME) - Resolution date
- `status` (TEXT) - 'active' or 'resolved'
- `outcome` (TEXT) - 'yes', 'no', or NULL

### Bets Table
- `id` (INTEGER PRIMARY KEY) - Bet ID
- `user_id` (INTEGER) - User ID (foreign key)
- `event_id` (INTEGER) - Event ID (foreign key)
- `outcome` (TEXT) - 'yes' or 'no'
- `shares` (REAL) - Number of shares purchased
- `price_per_share` (REAL) - Price at time of purchase
- `created_at` (DATETIME) - Bet timestamp

## 🌐 Deploying to Production

### WebApp Deployment

1. **Build the WebApp:**
   ```bash
   npm run webapp:build
   ```

2. **Deploy to Vercel/Netlify:**
   - Connect your repository
   - Set build command: `cd webapp && npm install && npm run build`
   - Set output directory: `webapp/dist`
   - Update `WEBAPP_URL` in `.env` to your deployed URL

### Bot Deployment

1. **Set up a server** (VPS, Heroku, Railway, etc.)
2. **Install dependencies** and set environment variables
3. **Run the bot** using `npm start` or a process manager like PM2
4. **Set up Webhook** (optional) or keep long polling

### Environment Variables for Production

Update `.env`:
```env
BOT_TOKEN=your_production_bot_token
PORT=3000
WEBAPP_URL=https://your-webapp-url.vercel.app
ADMIN_IDS=your_telegram_user_id
DB_PATH=./data/database.db
```

## 🧪 Testing

1. Start the bot and WebApp locally
2. Open Telegram and find your bot
3. Send `/start` to initialize
4. Use `/admin_create_event` to create a test event
5. Open the WebApp via the "Open Market" button
6. Place a test bet
7. Use `/admin_resolve_event` to resolve the event
8. Check your balance to see the payout

## 📝 Example Event

```
Question: "Will this prompt for Cursor get 1000 views on GitHub within the first week?"
Description: "This refers to views of the repository created based on this prompt specifically. Monitoring via GitHub API."
Resolution Date: 2024-12-20
```

## 🤝 Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## 📄 License

MIT License - feel free to use this project for your own purposes!

## 🎉 Enjoy!

Have fun creating and betting on harmless, amusing predictions! Remember to keep events light, fun, and non-controversial.

