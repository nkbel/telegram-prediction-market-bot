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
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
        <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="text-white text-xl font-bold">
                  🎯 Prediction Market
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profile
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<EventsList userId={userId} />} />
            <Route path="/event/:eventId" element={<EventDetail userId={userId} />} />
            <Route path="/profile" element={<Profile userId={userId} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

