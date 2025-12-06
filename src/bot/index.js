import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';
import db from '../database/db.js';
import { getUser, createUser, getUserBalance, getAllActiveEvents, createEvent, resolveEvent, getAllEvents, getUserBets, settleEvent, getEvent, createBet, getEventBets } from '../database/models.js';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;
const WEBAPP_URL = process.env.WEBAPP_URL || 'http://localhost:5173';
const ADMIN_IDS_RAW = process.env.ADMIN_IDS || '';
const ADMIN_IDS = ADMIN_IDS_RAW.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
console.log('Admin IDs loaded:', ADMIN_IDS, 'from:', ADMIN_IDS_RAW);

if (!BOT_TOKEN) {
  console.error('BOT_TOKEN is required! Please set it in .env file');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);
const app = express();

app.use(cors({
  origin: '*', // Allow all origins for now
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Middleware to ensure user exists in database
bot.use(async (ctx, next) => {
  if (ctx.from) {
    await createUser(ctx.from.id, ctx.from.username, ctx.from.first_name);
  }
  return next();
});

// Helper function to check if user is admin
function isAdmin(userId) {
  // Ensure userId is a number for comparison
  const userIdNum = typeof userId === 'number' ? userId : parseInt(userId);
  const isAdminUser = ADMIN_IDS.includes(userIdNum);
  if (!isAdminUser) {
    console.log(`Admin check failed for user ${userId} (${userIdNum}):`, {
      userId,
      userIdNum,
      userIdType: typeof userId,
      adminIds: ADMIN_IDS,
      adminIdsTypes: ADMIN_IDS.map(id => typeof id)
    });
  }
  return isAdminUser;
}

// Start command
bot.command('start', async (ctx) => {
  const welcomeMessage = `🎯 Welcome to the Prediction Market Bot!

This is a fun, harmless prediction market where you can bet on everyday events like:
• "Will someone post a cat photo in our group chat this week?"
• "Will the temperature be above 25°C tomorrow?"
• "Will oat milk become more popular in our office this month?"

💰 You start with 1000 credits to make predictions!

📊 How it works:
1. Browse active events in the market
2. Buy YES or NO shares based on your prediction
3. If you're right, you get paid when the event resolves!

Use /events to see active markets, or click the button below to open the full trading interface!`;

  await ctx.reply(welcomeMessage, Markup.keyboard([
    [Markup.button.webApp('📊 Open Market', `${WEBAPP_URL}?tgWebAppStartParam=${ctx.from.id}`)]
  ]).resize());
});

// Events command
bot.command('events', async (ctx) => {
  const events = await getAllActiveEvents();
  
  if (events.length === 0) {
    await ctx.reply('No active events at the moment. Check back later!');
    return;
  }

  let message = '📊 Active Events:\n\n';
  for (const event of events.slice(0, 10)) { // Show first 10
    const resolvesAt = event.resolves_at ? new Date(event.resolves_at).toLocaleDateString() : 'TBD';
    message += `📌 Event #${event.id}\n`;
    message += `❓ ${event.question}\n`;
    message += `📅 Resolves: ${resolvesAt}\n\n`;
  }

  message += `\nClick the button below to see all events and place bets!`;
  
  await ctx.reply(message, Markup.keyboard([
    [Markup.button.webApp('📊 Open Market', `${WEBAPP_URL}?tgWebAppStartParam=${ctx.from.id}`)]
  ]).resize());
});

// Balance command
bot.command('balance', async (ctx) => {
  const balance = await getUserBalance(ctx.from.id);
  await ctx.reply(`💰 Your current balance: ${balance.toFixed(2)} credits`);
});

// Debug command to check user ID and admin status
bot.command('debug', async (ctx) => {
  const userId = ctx.from.id;
  const isAdminUser = isAdmin(userId);
  const adminIds = ADMIN_IDS;
  
  await ctx.reply(
    `🔍 Debug Info:\n\n` +
    `Your User ID: ${userId}\n` +
    `Your User ID Type: ${typeof userId}\n` +
    `Configured Admin IDs: ${adminIds.length > 0 ? adminIds.join(', ') : 'None'}\n` +
    `Admin IDs Type: ${adminIds.map(id => typeof id).join(', ')}\n` +
    `Is Admin: ${isAdminUser ? '✅ Yes' : '❌ No'}\n\n` +
    `To add yourself as admin, edit .env and set:\n` +
    `ADMIN_IDS=${userId}`
  );
});

// My bets command
bot.command('my_bets', async (ctx) => {
  const bets = await getUserBets(ctx.from.id);
  
  if (bets.length === 0) {
    await ctx.reply('You haven\'t placed any bets yet. Use /events to see active markets!');
    return;
  }

  let message = '📋 Your Bets:\n\n';
  for (const bet of bets.slice(0, 10)) {
    const status = bet.status === 'resolved' 
      ? (bet.outcome === bet.event_outcome ? '✅ Won' : '❌ Lost')
      : '⏳ Pending';
    message += `${status} Event #${bet.event_id}: ${bet.question.substring(0, 50)}...\n`;
    message += `   ${bet.outcome.toUpperCase()}: ${bet.shares.toFixed(2)} shares @ ${bet.price_per_share.toFixed(2)}\n\n`;
  }

  await ctx.reply(message);
});

// Admin: Create event
bot.command('admin_create_event', async (ctx) => {
  if (!isAdmin(ctx.from.id)) {
    await ctx.reply('❌ Access denied. This command is for administrators only.');
    return;
  }

  const args = ctx.message.text.split(' ').slice(1).join(' ');
  
  if (!args || args.trim().length === 0) {
    await ctx.reply(
      '📝 To create an event, use:\n/admin_create_event <question> | <description> | <resolves_at (YYYY-MM-DD)>\n\n' +
      'Example:\n/admin_create_event Will it rain tomorrow? | Weather prediction for tomorrow | 2024-12-20'
    );
    return;
  }

  const parts = args.split('|').map(p => p.trim());

  if (parts.length < 3) {
    await ctx.reply('❌ Invalid format. Use: /admin_create_event <question> | <description> | <resolves_at>');
    return;
  }

  const [question, description, resolvesAt] = parts;

  try {
    const eventId = await createEvent(question, description, resolvesAt);
    await ctx.reply(`✅ Event created!\n\nID: ${eventId}\nQuestion: ${question}\nResolves: ${resolvesAt}`);
  } catch (error) {
    await ctx.reply(`❌ Error creating event: ${error.message}`);
  }
});

// Admin: List events
bot.command('admin_list_events', async (ctx) => {
  if (!isAdmin(ctx.from.id)) {
    await ctx.reply('❌ Access denied.');
    return;
  }

  const events = await getAllEvents();
  
  if (events.length === 0) {
    await ctx.reply('No events found.');
    return;
  }

  let message = '📋 All Events:\n\n';
  for (const event of events.slice(0, 20)) {
    const status = event.status === 'resolved' ? '✅' : '⏳';
    const outcome = event.outcome ? ` (${event.outcome.toUpperCase()})` : '';
    message += `${status} #${event.id}: ${event.question.substring(0, 60)}${outcome}\n`;
  }

  await ctx.reply(message);
});

// Admin: Resolve event
bot.command('admin_resolve_event', async (ctx) => {
  if (!isAdmin(ctx.from.id)) {
    await ctx.reply('❌ Access denied.');
    return;
  }

  const args = ctx.message.text.split(' ').slice(1);
  
  if (args.length < 2) {
    await ctx.reply('❌ Usage: /admin_resolve_event <event_id> <yes|no>');
    return;
  }

  const [eventId, outcome] = args;
  const validOutcome = outcome.toLowerCase() === 'yes' ? 'yes' : outcome.toLowerCase() === 'no' ? 'no' : null;

  if (!validOutcome) {
    await ctx.reply('❌ Outcome must be "yes" or "no"');
    return;
  }

  try {
    await resolveEvent(parseInt(eventId), validOutcome);
    await settleEvent(parseInt(eventId));
    await ctx.reply(`✅ Event #${eventId} resolved as ${validOutcome.toUpperCase()}. Payouts have been distributed.`);
  } catch (error) {
    await ctx.reply(`❌ Error resolving event: ${error.message}`);
  }
});

// Admin: Add credits
bot.command('admin_add_credits', async (ctx) => {
  if (!isAdmin(ctx.from.id)) {
    await ctx.reply('❌ Access denied.');
    return;
  }

  const args = ctx.message.text.split(' ').slice(1);
  
  if (args.length < 2) {
    await ctx.reply('❌ Usage: /admin_add_credits <user_id> <amount>');
    return;
  }

  const [userId, amount] = args;
  const user = await getUser(parseInt(userId));

  if (!user) {
    await ctx.reply('❌ User not found.');
    return;
  }

  try {
    const newBalance = user.balance + parseFloat(amount);
    await db.run('UPDATE users SET balance = ? WHERE id = ?', [newBalance, parseInt(userId)]);
    await ctx.reply(`✅ Added ${amount} credits to user ${userId}. New balance: ${newBalance.toFixed(2)}`);
  } catch (error) {
    await ctx.reply(`❌ Error: ${error.message}`);
  }
});

// API Routes for WebApp
app.get('/api/user/:userId', async (req, res) => {
  try {
    const user = await getUser(parseInt(req.params.userId));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const events = await getAllActiveEvents();
    // Calculate market prices for each event
    const eventsWithPrices = await Promise.all(events.map(async (event) => {
      const yesPrice = await db.get(
        `SELECT COALESCE(SUM(CASE WHEN outcome = 'yes' THEN shares ELSE 0 END), 0) as yes_shares,
                COALESCE(SUM(shares), 0) as total_shares
         FROM bets WHERE event_id = ?`,
        [event.id]
      );
      const totalShares = yesPrice.total_shares || 0;
      const yesShares = yesPrice.yes_shares || 0;
      const yesPricePercent = totalShares > 0 ? (yesShares / totalShares) * 100 : 50;
      const noPricePercent = 100 - yesPricePercent;

      return {
        ...event,
        yesPrice: yesPricePercent / 100,
        noPrice: noPricePercent / 100,
        yesPricePercent: yesPricePercent.toFixed(1),
        noPricePercent: noPricePercent.toFixed(1)
      };
    }));
    res.json(eventsWithPrices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/events/:eventId', async (req, res) => {
  try {
    const event = await getEvent(parseInt(req.params.eventId));
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Calculate market prices
    const priceData = await db.get(
      `SELECT COALESCE(SUM(CASE WHEN outcome = 'yes' THEN shares ELSE 0 END), 0) as yes_shares,
              COALESCE(SUM(shares), 0) as total_shares
       FROM bets WHERE event_id = ?`,
      [event.id]
    );
    const totalShares = priceData.total_shares || 0;
    const yesShares = priceData.yes_shares || 0;
    const yesPricePercent = totalShares > 0 ? (yesShares / totalShares) * 100 : 50;
    const noPricePercent = 100 - yesPricePercent;

    // Get betting history
    const bets = await getEventBets(event.id);

    res.json({
      ...event,
      yesPrice: yesPricePercent / 100,
      noPrice: noPricePercent / 100,
      yesPricePercent: yesPricePercent.toFixed(1),
      noPricePercent: noPricePercent.toFixed(1),
      bets: bets
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/user/:userId/bets', async (req, res) => {
  try {
    const bets = await getUserBets(parseInt(req.params.userId));
    res.json(bets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/bets', async (req, res) => {
  try {
    const { userId, eventId, outcome, betAmount } = req.body;

    if (!userId || !eventId || !outcome || !betAmount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (outcome !== 'yes' && outcome !== 'no') {
      return res.status(400).json({ error: 'Outcome must be "yes" or "no"' });
    }

    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid bet amount' });
    }

    // Check event exists and is active
    const event = await getEvent(eventId);
    if (!event || event.status !== 'active') {
      return res.status(400).json({ error: 'Event not found or not active' });
    }

    // Get current market price
    const priceData = await db.get(
      `SELECT COALESCE(SUM(CASE WHEN outcome = 'yes' THEN shares ELSE 0 END), 0) as yes_shares,
              COALESCE(SUM(shares), 0) as total_shares
       FROM bets WHERE event_id = ?`,
      [eventId]
    );
    const totalShares = priceData.total_shares || 0;
    const yesShares = priceData.yes_shares || 0;
    const pricePerShare = outcome === 'yes' 
      ? (totalShares > 0 ? yesShares / totalShares : 0.5)
      : (totalShares > 0 ? (totalShares - yesShares) / totalShares : 0.5);

    // Ensure price is between 0.01 and 0.99
    const adjustedPrice = Math.max(0.01, Math.min(0.99, pricePerShare || 0.5));

    // Calculate shares from bet amount
    const shares = amount / adjustedPrice;

    // Check user balance
    const user = await getUser(userId);
    if (!user || user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Create bet and update balance
    await createBet(userId, eventId, outcome, shares, adjustedPrice);
    await db.run('UPDATE users SET balance = balance - ? WHERE id = ?', [amount, userId]);

    res.json({ 
      success: true, 
      cost: amount.toFixed(2),
      shares: shares.toFixed(4),
      pricePerShare: adjustedPrice.toFixed(4)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve static files from webapp dist (after API routes)
app.use(express.static('webapp/dist'));

// Catch-all handler for React Router (must be after API routes)
app.get('*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(process.cwd(), 'webapp/dist/index.html'));
});

// Start bot
bot.launch().then(() => {
  console.log('🤖 Telegram bot is running!');
}).catch(console.error);

// Start Express server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 WebApp URL: ${WEBAPP_URL}`);
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

