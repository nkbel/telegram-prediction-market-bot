import db from './db.js';

// User operations
export async function getUser(userId) {
  return db.get('SELECT * FROM users WHERE id = ?', [userId]);
}

export async function createUser(userId, username, firstName) {
  return db.run(
    'INSERT OR IGNORE INTO users (id, username, first_name, balance) VALUES (?, ?, ?, 1000.0)',
    [userId, username, firstName]
  );
}

export async function updateUserBalance(userId, newBalance) {
  return db.run('UPDATE users SET balance = ? WHERE id = ?', [newBalance, userId]);
}

export async function getUserBalance(userId) {
  const user = await getUser(userId);
  return user ? user.balance : 0;
}

// Event operations
export async function createEvent(question, description, resolvesAt) {
  const result = await db.run(
    'INSERT INTO events (question, description, resolves_at) VALUES (?, ?, ?)',
    [question, description, resolvesAt]
  );
  return result.lastID;
}

export async function getEvent(eventId) {
  return db.get('SELECT * FROM events WHERE id = ?', [eventId]);
}

export async function getAllActiveEvents() {
  return db.all("SELECT * FROM events WHERE status = 'active' ORDER BY created_at DESC");
}

export async function getAllEvents() {
  return db.all('SELECT * FROM events ORDER BY created_at DESC');
}

export async function resolveEvent(eventId, outcome) {
  return db.run(
    "UPDATE events SET status = 'resolved', outcome = ? WHERE id = ?",
    [outcome, eventId]
  );
}

// Bet operations
export async function createBet(userId, eventId, outcome, shares, pricePerShare) {
  return db.run(
    'INSERT INTO bets (user_id, event_id, outcome, shares, price_per_share) VALUES (?, ?, ?, ?, ?)',
    [userId, eventId, outcome, shares, pricePerShare]
  );
}

export async function getUserBets(userId) {
  return db.all(
    `SELECT b.*, e.question, e.status, e.outcome as event_outcome 
     FROM bets b 
     JOIN events e ON b.event_id = e.id 
     WHERE b.user_id = ? 
     ORDER BY b.created_at DESC`,
    [userId]
  );
}

export async function getEventBets(eventId) {
  return db.all('SELECT * FROM bets WHERE event_id = ? ORDER BY created_at ASC', [eventId]);
}

// Market price calculation
export async function calculateMarketPrice(eventId, outcome) {
  const bets = await getEventBets(eventId);
  
  if (bets.length === 0) {
    return 0.5; // Default 50/50 if no bets
  }

  let totalYesShares = 0;
  let totalNoShares = 0;
  let totalYesValue = 0;
  let totalNoValue = 0;

  bets.forEach(bet => {
    if (bet.outcome === 'yes') {
      totalYesShares += bet.shares;
      totalYesValue += bet.shares * bet.price_per_share;
    } else {
      totalNoShares += bet.shares;
      totalNoValue += bet.shares * bet.price_per_share;
    }
  });

  const totalShares = totalYesShares + totalNoShares;
  if (totalShares === 0) {
    return 0.5;
  }

  // Calculate price based on share distribution
  // Price = total shares of outcome / total shares
  if (outcome === 'yes') {
    return totalYesShares / totalShares;
  } else {
    return totalNoShares / totalShares;
  }
}

// Settlement operations
export async function settleEvent(eventId) {
  const event = await getEvent(eventId);
  if (!event || event.status !== 'resolved' || !event.outcome) {
    throw new Error('Event not resolved or outcome not set');
  }

  const bets = await getEventBets(eventId);
  const winners = bets.filter(bet => bet.outcome === event.outcome);
  const losers = bets.filter(bet => bet.outcome !== event.outcome);

  // Calculate payouts
  const totalShares = bets.reduce((sum, bet) => sum + bet.shares, 0);
  const winningShares = winners.reduce((sum, bet) => sum + bet.shares, 0);

  if (winningShares === 0) {
    return; // No winners
  }

  // Each winning share is worth 1 credit
  // Payout = (shares owned / total winning shares) * total shares
  const payoutPerShare = totalShares / winningShares;

  // Update balances for winners
  for (const bet of winners) {
    const payout = bet.shares * payoutPerShare;
    const user = await getUser(bet.user_id);
    if (user) {
      const newBalance = user.balance + payout;
      await updateUserBalance(bet.user_id, newBalance);
    }
  }

  // Losers don't get anything (already paid when buying)
}

