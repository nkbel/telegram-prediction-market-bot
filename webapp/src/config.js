// API configuration
export const API_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:3000' 
    : 'https://three-doodles-shake.loca.lt'); // Fallback to tunnel URL for deployed version

