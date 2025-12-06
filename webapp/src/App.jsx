import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useSearchParams } from 'react-router-dom';
import EventsList from './components/EventsList';
import EventDetail from './components/EventDetail';
import Profile from './components/Profile';

function App() {
  const [tg, setTg] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Initialize Telegram WebApp
    if (window.Telegram?.WebApp) {
      const tgApp = window.Telegram.WebApp;
      tgApp.ready();
      tgApp.expand();
      setTg(tgApp);

      // Get user ID from start param or initData
      const urlParams = new URLSearchParams(window.location.search);
      const startParam = urlParams.get('tgWebAppStartParam');
      if (startParam) {
        setUserId(parseInt(startParam));
      } else if (tgApp.initDataUnsafe?.user?.id) {
        setUserId(tgApp.initDataUnsafe.user.id);
      }
    } else {
      // Development mode - use default user ID
      setUserId(1);
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-surface-light via-surface to-surface-light">
        <nav className="bg-surface border-b border-primary/10 shadow-blue-sm sticky top-0 z-50 backdrop-blur-sm bg-surface/95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link to="/" className="text-primary text-xl font-bold flex items-center gap-2 hover:text-primary-light transition-colors">
                  <span className="text-2xl">🎯</span>
                  <span>Prediction Market</span>
                </Link>
              </div>
              <div className="flex items-center space-x-2">
                <Link
                  to="/profile"
                  className="text-text-secondary hover:text-primary px-4 py-2 rounded-button text-sm font-medium transition-colors hover:bg-surface-light"
                >
                  Profile
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
          <Routes>
            <Route path="/" element={<EventsList userId={userId} />} />
            <Route path="/event/:eventId" element={<EventDetail userId={userId} />} />
            <Route path="/profile" element={<Profile userId={userId} />} />
          </Routes>
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-primary/10 shadow-blue-lg rounded-t-[20px] z-50">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex justify-around items-center">
              <Link
                to="/"
                className="flex flex-col items-center gap-1 px-4 py-2 rounded-button text-text-secondary hover:text-primary transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-xs font-medium">Markets</span>
              </Link>
              <Link
                to="/profile"
                className="flex flex-col items-center gap-1 px-4 py-2 rounded-button text-text-secondary hover:text-primary transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-xs font-medium">Profile</span>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </Router>
  );
}

export default App;

