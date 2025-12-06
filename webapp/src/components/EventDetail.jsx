import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

function EventDetail({ userId }) {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [selectedOutcome, setSelectedOutcome] = useState(null);
  const [betting, setBetting] = useState(false);
  const [userBalance, setUserBalance] = useState(0);

  useEffect(() => {
    if (userId) {
      fetchUserBalance();
    }
    fetchEvent();
  }, [eventId, userId]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/events/${eventId}`);
      if (!response.ok) throw new Error('Failed to fetch event');
      const data = await response.json();
      setEvent(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBalance = async () => {
    try {
      const response = await fetch(`${API_URL}/api/user/${userId}`);
      if (response.ok) {
        const user = await response.json();
        setUserBalance(user.balance);
      }
    } catch (err) {
      console.error('Failed to fetch balance:', err);
    }
  };

  const handleBet = async () => {
    if (!selectedOutcome || !betAmount || parseFloat(betAmount) <= 0) {
      alert('Please select an outcome and enter a valid bet amount');
      return;
    }

    if (parseFloat(betAmount) > userBalance) {
      alert('Insufficient balance');
      return;
    }

    setBetting(true);
    try {
      const response = await fetch(`${API_URL}/api/bets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          eventId: parseInt(eventId),
          outcome: selectedOutcome,
          betAmount: parseFloat(betAmount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place bet');
      }

      alert(`Bet placed successfully! Cost: ${data.cost} credits, Shares: ${data.shares}`);
      setBetAmount('');
      setSelectedOutcome(null);
      fetchEvent();
      fetchUserBalance();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setBetting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-white text-xl">Loading event...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="bg-red-500 text-white p-4 rounded-lg">
        Error: {error || 'Event not found'}
      </div>
    );
  }

  const sharesYes = betAmount && selectedOutcome === 'yes' 
    ? (parseFloat(betAmount) / event.yesPrice).toFixed(2)
    : '0.00';
  const sharesNo = betAmount && selectedOutcome === 'no'
    ? (parseFloat(betAmount) / event.noPrice).toFixed(2)
    : '0.00';

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="text-white hover:text-gray-200 mb-4 flex items-center"
      >
        ← Back to Markets
      </button>

      <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
        <h1 className="text-3xl font-bold text-white mb-4">{event.question}</h1>
        
        {event.description && (
          <p className="text-white/90 mb-6">{event.description}</p>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-white/70 text-sm mb-2">Resolves</div>
            <div className="text-white font-semibold">
              {event.resolves_at ? new Date(event.resolves_at).toLocaleDateString() : 'TBD'}
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-white/70 text-sm mb-2">Status</div>
            <div className="text-white font-semibold capitalize">{event.status}</div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Current Market Prices</h2>
          <div className="bg-white/5 rounded-lg p-6">
            <div className="flex justify-between text-sm text-white/90 mb-2">
              <span className="font-semibold">YES</span>
              <span className="font-semibold">NO</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-6 relative overflow-hidden mb-2">
              <div
                className="bg-green-500 h-full transition-all duration-300 flex items-center justify-center text-white text-xs font-semibold"
                style={{ width: `${event.yesPricePercent}%` }}
              >
                {event.yesPricePercent}%
              </div>
              <div
                className="bg-red-500 h-full absolute top-0 right-0 transition-all duration-300 flex items-center justify-center text-white text-xs font-semibold"
                style={{ width: `${event.noPricePercent}%` }}
              >
                {event.noPricePercent}%
              </div>
            </div>
            <div className="flex justify-between text-white/70 text-sm">
              <span>Price: {event.yesPrice.toFixed(4)}</span>
              <span>Price: {event.noPrice.toFixed(4)}</span>
            </div>
          </div>
        </div>

        {event.status === 'active' && (
          <div className="bg-white/5 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Place a Bet</h2>
            <div className="text-white/70 mb-4">
              Your Balance: <span className="text-white font-semibold">{userBalance.toFixed(2)} credits</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <button
                onClick={() => setSelectedOutcome('yes')}
                className={`p-4 rounded-lg font-semibold transition-all ${
                  selectedOutcome === 'yes'
                    ? 'bg-green-500 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Buy YES
                <div className="text-sm mt-1">Price: {event.yesPrice.toFixed(4)}</div>
              </button>
              <button
                onClick={() => setSelectedOutcome('no')}
                className={`p-4 rounded-lg font-semibold transition-all ${
                  selectedOutcome === 'no'
                    ? 'bg-red-500 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Buy NO
                <div className="text-sm mt-1">Price: {event.noPrice.toFixed(4)}</div>
              </button>
            </div>

            {selectedOutcome && (
              <div className="space-y-4">
                <div>
                  <label className="block text-white/90 mb-2">
                    Bet Amount (credits)
                  </label>
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                    min="0.01"
                    step="0.01"
                    max={userBalance}
                  />
                </div>

                {betAmount && parseFloat(betAmount) > 0 && (
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-white/70 text-sm mb-2">
                      You will buy: <span className="text-white font-semibold">
                        {selectedOutcome === 'yes' ? sharesYes : sharesNo} shares
                      </span>
                    </div>
                    <div className="text-white/70 text-sm">
                      Cost: <span className="text-white font-semibold">{betAmount} credits</span>
                    </div>
                    <div className="text-white/70 text-sm mt-2">
                      If you win, you'll receive: <span className="text-white font-semibold">
                        {selectedOutcome === 'yes' ? sharesYes : sharesNo} credits
                      </span>
                      <span className="text-white/50 text-xs ml-2">(1 credit per share)</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBet}
                  disabled={betting || !betAmount || parseFloat(betAmount) <= 0}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all"
                >
                  {betting ? 'Placing Bet...' : 'Confirm Bet'}
                </button>
              </div>
            )}
          </div>
        )}

        {event.status === 'resolved' && (
          <div className="bg-white/5 rounded-lg p-6">
            <div className="text-xl font-semibold text-white mb-2">
              Event Resolved: <span className={event.outcome === 'yes' ? 'text-green-400' : 'text-red-400'}>
                {event.outcome.toUpperCase()}
              </span>
            </div>
            <p className="text-white/70">Payouts have been distributed to winners.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventDetail;

