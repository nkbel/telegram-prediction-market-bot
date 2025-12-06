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
      const response = await fetch(`${API_URL}/api/events`);
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data);
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
          <p className="text-text-secondary text-lg">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-modal text-center">
        <p className="font-semibold mb-2">Error loading events</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Active Markets
        </h1>
        <p className="text-text-secondary">Make predictions on everyday events</p>
      </div>

      {events.length === 0 ? (
        <div className="bg-surface rounded-card card-shadow p-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-xl font-semibold text-text-primary mb-2">No active events</p>
          <p className="text-text-secondary">Check back later for new predictions!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <Link
              key={event.id}
              to={`/event/${event.id}`}
              className="bg-surface rounded-card card-shadow p-5 hover-lift border border-primary/5 hover:border-primary/20 transition-smooth group"
            >
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {event.question}
                </h2>
                {event.description && (
                  <p className="text-text-secondary text-sm line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs font-semibold text-text-secondary mb-2">
                  <span className="text-primary">YES</span>
                  <span className="text-accent-no-from">NO</span>
                </div>
                <div className="w-full bg-surface-light rounded-full h-2.5 relative overflow-hidden mb-2">
                  <div
                    className="gradient-yes h-full transition-all duration-300 rounded-full"
                    style={{ width: `${event.yesPricePercent}%` }}
                  />
                  <div
                    className="gradient-no h-full absolute top-0 right-0 transition-all duration-300 rounded-full"
                    style={{ width: `${event.noPricePercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-primary">{event.yesPricePercent}%</span>
                  <span className="text-accent-no-from">{event.noPricePercent}%</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-text-secondary pt-3 border-t border-surface-light">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Resolves: {event.resolves_at ? new Date(event.resolves_at).toLocaleDateString() : 'TBD'}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventsList;

