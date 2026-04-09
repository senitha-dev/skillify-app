const rawApiUrl = (import.meta as any).env.VITE_API_URL || '';

// Robust check for API URL
export const API_BASE_URL = (() => {
  // Handle empty, placeholder, or "undefined" string
  if (!rawApiUrl || rawApiUrl === 'undefined' || rawApiUrl.includes('your-railway-app-url')) {
    return '';
  }
  
  try {
    // If it's just a path (like "/api"), use it
    if (rawApiUrl.startsWith('/')) {
      return rawApiUrl.replace(/\/$/, '');
    }

    const url = new URL(rawApiUrl);
    if (url.origin === window.location.origin) {
      return '';
    }
    return rawApiUrl.replace(/\/$/, '');
  } catch (e) {
    return '';
  }
})();
