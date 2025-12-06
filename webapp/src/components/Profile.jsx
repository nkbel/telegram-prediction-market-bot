import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

function Profile({ userId }) {
  const [user, setUser] = useState(null);
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchUserData();
      fetchBets();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/user/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user data');
      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchBets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/user/${userId}/bets`);
      if (!response.ok) throw new Error('Failed to fetch bets');
      const data = await response.json();
      setBets(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-text-secondary text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-surface rounded-card card-shadow p-6 mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-6">Profile</h1>
        
        {user && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface-light rounded-input p-5">
              <div className="text-text-secondary text-sm mb-2 font-medium">Username</div>
              <div className="text-text-primary font-semibold text-lg">
                {user.username || `User ${user.id}`}
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-input p-5 text-white">
              <div className="text-white/80 text-sm mb-2 font-medium">Balance</div>
              <div className="text-3xl font-bold">
                {user.balance.toFixed(2)}
              </div>
              <div className="text-white/70 text-sm mt-1">credits</div>
            </div>
            <div className="bg-surface-light rounded-input p-5">
              <div className="text-text-secondary text-sm mb-2 font-medium">Member Since</div>
              <div className="text-text-primary font-semibold">
                {new Date(user.joined_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-surface rounded-card card-shadow p-6">
        <h2 className="text-xl font-bold text-text-primary mb-6">Your Bets</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-input mb-4">
            <p className="font-semibold">Error: {error}</p>
          </div>
        )}

        {bets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-lg font-semibold text-text-primary mb-2">No bets yet!</p>
            <p className="text-text-secondary mb-4">Start making predictions on active markets</p>
            <Link
              to="/"
              className="inline-block gradient-yes text-white font-semibold py-3 px-6 rounded-button hover-lift transition-smooth shadow-blue-md"
            >
              Browse Markets
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bets.map((bet) => (
              <div
                key={bet.id}
                className="bg-surface-light rounded-card p-5 border border-primary/5 hover:border-primary/20 hover-lift transition-smooth"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <Link
                      to={`/event/${bet.event_id}`}
                      className="text-text-primary font-semibold hover:text-primary transition-colors line-clamp-2"
                    >
                      {bet.question}
                    </Link>
                  </div>
                  <div className={`px-4 py-1.5 rounded-button text-xs font-bold ml-3 ${
                    bet.status === 'resolved'
                      ? bet.outcome === bet.event_outcome
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : 'bg-yellow-400 text-white'
                  }`}>
                    {bet.status === 'resolved'
                      ? bet.outcome === bet.event_outcome
                        ? '✅ Won'
                        : '❌ Lost'
                      : '⏳ Pending'}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-text-light">Outcome:</span>
                    <div className="font-semibold text-text-primary mt-1">
                      <span className={`px-2 py-1 rounded text-xs ${
                        bet.outcome === 'yes' 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-accent-no-from/10 text-accent-no-from'
                      }`}>
                        {bet.outcome.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-text-light">Shares:</span>
                    <div className="font-semibold text-text-primary mt-1">{bet.shares.toFixed(2)}</div>
                  </div>
                  <div>
                    <span className="text-text-light">Price:</span>
                    <div className="font-semibold text-text-primary mt-1">{bet.price_per_share.toFixed(4)}</div>
                  </div>
                  <div>
                    <span className="text-text-light">Date:</span>
                    <div className="font-semibold text-text-primary mt-1">
                      {new Date(bet.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
