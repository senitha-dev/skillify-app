import { API_BASE_URL } from '../config';
import { toast } from 'sonner';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 403 || response.status === 401) {
      console.error(`[API] Session expired or invalid (Status: ${response.status}) at ${endpoint}`);
      // Clear auth and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-change'));
      
      // Only show toast if we were actually trying to do something authenticated
      if (token) {
        toast.error('Session expired. Please login again.');
      }
      return null;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`[API] Request failed: ${response.status} ${response.statusText}`, errorData);
      return response; // Return the response so the caller can handle the error
    }

    return response;
  } catch (error: any) {
    console.error('[API] Fetch error:', error);
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    throw new Error(`Failed to fetch from ${fullUrl}: ${error.message}`);
  }
}
