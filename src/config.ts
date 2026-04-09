const rawApiUrl = (import.meta as any).env.VITE_API_URL || 'https://skillify-app-production.up.railway.app';

// Robust check for API URL
export const API_BASE_URL = (() => {
  // If we're in a browser/preview environment, relative paths work fine
  if (typeof window !== 'undefined' && !window.location.protocol.startsWith('http')) {
    // This might be a mobile app environment (file:// or similar)
    console.warn('Mobile environment detected. VITE_API_URL is required for backend connectivity.');
  }

  // Handle empty, placeholder, or "undefined" string
  if (!rawApiUrl || rawApiUrl === 'undefined' || rawApiUrl.includes('your-railway-app-url')) {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return ''; // Local dev
    }
    // In AI Studio preview, relative paths work
    return ''; 
  }
  
  try {
    const url = new URL(rawApiUrl);
    return rawApiUrl.replace(/\/$/, '');
  } catch (e) {
    // If it's just a path (like "/api"), use it
    if (rawApiUrl.startsWith('/')) {
      return rawApiUrl.replace(/\/$/, '');
    }
    return '';
  }
})();

console.log('[Config] API_BASE_URL initialized as:', API_BASE_URL || '(relative)');
if (!API_BASE_URL && typeof window !== 'undefined' && !window.location.protocol.startsWith('http')) {
  console.error('[CRITICAL] Mobile environment detected but VITE_API_URL is missing! Backend requests will fail.');
}
