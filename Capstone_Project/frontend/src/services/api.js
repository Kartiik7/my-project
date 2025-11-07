import axios from 'axios';

// Set the backend API base URL (use Vite env var when available)
// Use import.meta.env.VITE_API_URL in production; fall back to localhost for local dev
const API_URL = typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true // This is crucial for sending/receiving httpOnly cookies
});

// We no longer need the REQUEST interceptor to add the token,
// as the browser will handle sending the httpOnly cookie automatically.

// We ADD a RESPONSE interceptor to handle token refreshing
// This is a complex but powerful pattern.
// We use 'isRefreshing' to prevent an infinite loop of refresh calls.
let isRefreshing = false;
// 'failedQueue' will hold any requests that failed due to a 401
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    // If the request was successful, just return the response
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // We only want to retry on 401s (Unauthorized), 
    // and not for the refresh token request itself.
    if (error.response?.status === 401 && originalRequest.url !== '/api/auth/refresh') {
      if (isRefreshing) {
        // If we are already refreshing, push this request to the queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          // The promise will resolve when refreshing is done, then we retry
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to get a new access token
        const res = await api.post('/api/auth/refresh');
        const { firebaseToken } = res.data; 

        // Process any queued requests
        processQueue(null, firebaseToken);
        
        // Retry the original request (which now has a new accessToken cookie)
        return api(originalRequest);

      } catch (refreshError) {
        // If refresh fails, process the queue with an error
        processQueue(refreshError, null);
        
        // This means auth has failed. We must trigger a full logout.
        // We can't use the AuthContext here, so we force a page reload to login.
        // This will clear all state and AuthContext will re-run its check.
        if (window.location.pathname !== '/login') {
            window.location.href = '/'; // Force reload/redirect to login
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For any other error, just reject the promise
    return Promise.reject(error);
  }
);


export default api;
