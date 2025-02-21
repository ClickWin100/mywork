
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qfnbsvxtunwbtgixoecg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmbmJzdnh0dW53YnRnaXhvZWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc0MDE0NDYsImV4cCI6MjAyMjk3NzQ0Nn0.b2q9wsXNzBcCJ9A7gZVkIR9KeK1_J2RRvJKS0QzWkgE';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function fetchWithRetry(url: RequestInfo | URL, options?: RequestInit, retryCount = 0): Promise<Response> {
  try {
    const response = await fetch(url, options);
    if (!response.ok && retryCount < MAX_RETRIES) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying fetch attempt ${retryCount + 1} of ${MAX_RETRIES}...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, options, retryCount + 1);
    }
    throw error;
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: async (url: RequestInfo | URL, options?: RequestInit) => {
      const headers = new Headers(options?.headers || {});
      headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      headers.set('Pragma', 'no-cache');
      headers.set('Expires', '0');

      const finalOptions = {
        ...options,
        headers,
        mode: 'cors' as RequestMode,
        credentials: 'include' as RequestCredentials,
        cache: 'no-store' as RequestCache
      };

      try {
        return await fetchWithRetry(url, finalOptions);
      } catch (error) {
        console.error('Supabase fetch error:', error);
        throw error;
      }
    }
  }
});
