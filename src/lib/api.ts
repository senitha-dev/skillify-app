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
      console.error('[API] Session expired or invalid (403/401)');
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

    return response;
  } catch (error) {
    console.error('[API] Fetch error:', error);
    throw error;
  }
}
