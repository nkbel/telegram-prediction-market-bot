import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

function EventsList({ userId }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const url = `${API_URL}/api/events`;
      console.log('Fetching events from:', url);
      const response = await fetch(url);
      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch events: ${response.status} ${errorText}`);
      }
      const data = await response.json();
      console.log('Events loaded:', data.length);
      setEvents(data);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-white text-xl">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500 text-white p-4 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-white mb-8 text-center">
        📊 Active Markets
      </h1>

      {events.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 text-center text-white">
          <p className="text-xl">No active events at the moment.</p>
          <p className="text-sm mt-2">Check back later for new predictions!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link
              key={event.id}
              to={`/event/${event.id}`}
              className="bg-white/10 backdrop-blur-md rounded-lg p-6 hover:bg-white/20 transition-all duration-200 border border-white/20"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-white flex-1">
                  {event.question}
                </h2>
              </div>

              {event.description && (
                <p className="text-white/80 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>
              )}

              <div className="mb-4">
                <div className="flex justify-between text-sm text-white/90 mb-2">
                  <span>YES</span>
                  <span>NO</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 relative overflow-hidden">
                  <div
                    className="bg-green-500 h-full transition-all duration-300"
                    style={{ width: `${event.yesPricePercent}%` }}
                  />
                  <div
                    className="bg-red-500 h-full absolute top-0 right-0 transition-all duration-300"
                    style={{ width: `${event.noPricePercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-white/70 mt-1">
                  <span>{event.yesPricePercent}%</span>
                  <span>{event.noPricePercent}%</span>
                </div>
              </div>

              <div className="text-xs text-white/60">
                Resolves: {event.resolves_at ? new Date(event.resolves_at).toLocaleDateString() : 'TBD'}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventsList;

