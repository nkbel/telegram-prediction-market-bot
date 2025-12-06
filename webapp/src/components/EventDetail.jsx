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
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-text-secondary text-lg">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-modal">
        <p className="font-semibold">Error: {error || 'Event not found'}</p>
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
        className="text-text-secondary hover:text-primary mb-6 flex items-center gap-2 transition-colors group"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-medium">Back to Markets</span>
      </button>

      <div className="bg-surface rounded-card card-shadow p-6 mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-3">{event.question}</h1>
        
        {event.description && (
          <p className="text-text-secondary mb-6 leading-relaxed">{event.description}</p>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-surface-light rounded-input p-4">
            <div className="text-text-secondary text-sm mb-1 font-medium">Resolves</div>
            <div className="text-text-primary font-semibold flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {event.resolves_at ? new Date(event.resolves_at).toLocaleDateString() : 'TBD'}
            </div>
          </div>
          <div className="bg-surface-light rounded-input p-4">
            <div className="text-text-secondary text-sm mb-1 font-medium">Status</div>
            <div className="text-text-primary font-semibold capitalize flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${event.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              {event.status}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Current Market Prices</h2>
          <div className="bg-surface-light rounded-card p-5">
            <div className="flex justify-between text-sm font-semibold text-text-secondary mb-3">
              <span className="text-primary">YES</span>
              <span className="text-accent-no-from">NO</span>
            </div>
            <div className="w-full bg-surface rounded-full h-4 relative overflow-hidden mb-3">
              <div
                className="gradient-yes h-full transition-all duration-300 flex items-center justify-end pr-2"
                style={{ width: `${event.yesPricePercent}%` }}
              >
                {parseFloat(event.yesPricePercent) > 10 && (
                  <span className="text-white text-xs font-bold">{event.yesPricePercent}%</span>
                )}
              </div>
              <div
                className="gradient-no h-full absolute top-0 right-0 transition-all duration-300 flex items-center justify-start pl-2"
                style={{ width: `${event.noPricePercent}%` }}
              >
                {parseFloat(event.noPricePercent) > 10 && (
                  <span className="text-white text-xs font-bold">{event.noPricePercent}%</span>
                )}
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Price: <span className="font-semibold text-primary">{event.yesPrice.toFixed(4)}</span></span>
              <span className="text-text-secondary">Price: <span className="font-semibold text-accent-no-from">{event.noPrice.toFixed(4)}</span></span>
            </div>
          </div>
        </div>

        {event.status === 'active' && (
          <div className="bg-surface-light rounded-card p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Place a Bet</h2>
            <div className="bg-surface rounded-input p-4 mb-6">
              <div className="text-text-secondary text-sm mb-1">Your Balance</div>
              <div className="text-2xl font-bold text-primary">{userBalance.toFixed(2)} <span className="text-lg text-text-secondary">credits</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setSelectedOutcome('yes')}
                className={`p-5 rounded-button font-semibold transition-smooth hover-lift ${
                  selectedOutcome === 'yes'
                    ? 'gradient-yes text-white shadow-blue-lg scale-105'
                    : 'bg-surface border-2 border-primary/20 text-primary hover:border-primary hover:bg-surface-light'
                }`}
              >
                <div className="text-lg mb-1">Buy YES</div>
                <div className="text-sm opacity-90">Price: {event.yesPrice.toFixed(4)}</div>
              </button>
              <button
                onClick={() => setSelectedOutcome('no')}
                className={`p-5 rounded-button font-semibold transition-smooth hover-lift ${
                  selectedOutcome === 'no'
                    ? 'gradient-no text-white shadow-blue-lg scale-105'
                    : 'bg-surface border-2 border-accent-no-from/20 text-accent-no-from hover:border-accent-no-from hover:bg-red-50'
                }`}
              >
                <div className="text-lg mb-1">Buy NO</div>
                <div className="text-sm opacity-90">Price: {event.noPrice.toFixed(4)}</div>
              </button>
            </div>

            {selectedOutcome && (
              <div className="space-y-4">
                <div>
                  <label className="block text-text-primary font-medium mb-2">
                    Bet Amount (credits)
                  </label>
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 rounded-input bg-surface border-2 border-primary/20 text-text-primary placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
                    min="0.01"
                    step="0.01"
                    max={userBalance}
                  />
                </div>

                {betAmount && parseFloat(betAmount) > 0 && (
                  <div className="bg-surface rounded-input p-5 border-2 border-primary/10">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">You will buy:</span>
                        <span className="font-semibold text-text-primary">{selectedOutcome === 'yes' ? sharesYes : sharesNo} shares</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Cost:</span>
                        <span className="font-semibold text-text-primary">{betAmount} credits</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-surface-light">
                        <span className="text-text-secondary">If you win:</span>
                        <span className="font-semibold text-primary">{selectedOutcome === 'yes' ? sharesYes : sharesNo} credits</span>
                      </div>
                      <div className="text-xs text-text-light mt-1">(1 credit per share)</div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBet}
                  disabled={betting || !betAmount || parseFloat(betAmount) <= 0}
                  className="w-full gradient-yes text-white font-semibold py-4 px-6 rounded-button transition-smooth hover-lift disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-blue-md"
                >
                  {betting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Placing Bet...
                    </span>
                  ) : (
                    'Confirm Bet'
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {event.status === 'resolved' && (
          <div className="bg-surface-light rounded-card p-6 border-2 border-primary/20">
            <div className="text-xl font-semibold text-text-primary mb-2 flex items-center gap-2">
              Event Resolved:
              <span className={`px-4 py-2 rounded-button font-bold ${
                event.outcome === 'yes' 
                  ? 'gradient-yes text-white' 
                  : 'gradient-no text-white'
              }`}>
                {event.outcome.toUpperCase()}
              </span>
            </div>
            <p className="text-text-secondary">Payouts have been distributed to winners.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventDetail;
