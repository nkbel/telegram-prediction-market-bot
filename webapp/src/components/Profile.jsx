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
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20 mb-6">
        <h1 className="text-3xl font-bold text-white mb-6">Profile</h1>
        
        {user && (
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/70 text-sm mb-1">Username</div>
              <div className="text-white font-semibold text-lg">
                {user.username || `User ${user.id}`}
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/70 text-sm mb-1">Balance</div>
              <div className="text-white font-semibold text-2xl">
                {user.balance.toFixed(2)} credits
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/70 text-sm mb-1">Member Since</div>
              <div className="text-white font-semibold">
                {new Date(user.joined_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6">Your Bets</h2>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
            Error: {error}
          </div>
        )}

        {bets.length === 0 ? (
          <div className="text-center text-white/70 py-8">
            <p className="text-lg mb-2">No bets yet!</p>
            <Link
              to="/"
              className="text-blue-300 hover:text-blue-200 underline"
            >
              Browse active markets
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bets.map((bet) => (
              <div
                key={bet.id}
                className="bg-white/5 rounded-lg p-4 border border-white/10"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <Link
                      to={`/event/${bet.event_id}`}
                      className="text-white font-semibold hover:text-blue-300"
                    >
                      {bet.question}
                    </Link>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    bet.status === 'resolved'
                      ? bet.outcome === bet.event_outcome
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : 'bg-yellow-500 text-white'
                  }`}>
                    {bet.status === 'resolved'
                      ? bet.outcome === bet.event_outcome
                        ? '✅ Won'
                        : '❌ Lost'
                      : '⏳ Pending'}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-white/70">
                  <div>
                    <span className="text-white/50">Outcome:</span>{' '}
                    <span className="text-white font-semibold">{bet.outcome.toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-white/50">Shares:</span>{' '}
                    <span className="text-white font-semibold">{bet.shares.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-white/50">Price:</span>{' '}
                    <span className="text-white font-semibold">{bet.price_per_share.toFixed(4)}</span>
                  </div>
                  <div>
                    <span className="text-white/50">Date:</span>{' '}
                    <span className="text-white font-semibold">
                      {new Date(bet.created_at).toLocaleDateString()}
                    </span>
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

