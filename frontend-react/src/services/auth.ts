import axios from 'axios';

const AUTH_TOKEN_KEY = 'authToken';

export interface GenerateTokenRequest {
  email: string;
  authProviderId: string;
}

export interface TokenResponse {
  token: string;
  expiresAt: string;
  expiresIn: number;
  userId: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string>;
}

// Auth endpoint configuration
const AUTH_ENDPOINT = '/Auth/token'; // Matches backend route: api/v1/Auth/token

// Create a separate axios instance for auth (doesn't require token)
const authApi = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Authenticate and get JWT token
 * @param email User email (NOT hardcoded - must be provided)
 * @param authProviderId Auth provider ID (NOT hardcoded - must be provided, e.g., "auth0|test123")
 * @returns Token response with JWT token
 * 
 * Note: The endpoint URL is hardcoded to '/api/v1/Auth/token' which gets proxied to 
 * 'https://localhost:7001/api/v1/Auth/token' via Vite proxy configuration.
 */
export const authenticate = async (
  email: string,
  authProviderId: string
): Promise<TokenResponse> => {
  try {
    const response = await authApi.post<ApiResponse<TokenResponse>>(AUTH_ENDPOINT, {
      email,
      authProviderId,
    });

    // Unwrap ApiResponse
    const apiResponse = response.data;
    if (!apiResponse.success || !apiResponse.data) {
      throw new Error(apiResponse.message || 'Authentication failed');
    }

    const tokenData = apiResponse.data;
    
    // Store token in localStorage
    localStorage.setItem(AUTH_TOKEN_KEY, tokenData.token);
    
    // Optionally store other token info
    localStorage.setItem('authTokenExpiresAt', tokenData.expiresAt);
    localStorage.setItem('authUserId', tokenData.userId);
    localStorage.setItem('authUserEmail', tokenData.email);

    return tokenData;
  } catch (error: any) {
    // Clear any existing token on error
    clearAuth();
    
    if (error.response?.data) {
      const apiResponse = error.response.data as ApiResponse<any>;
      throw new Error(apiResponse.message || 'Authentication failed');
    }
    throw error;
  }
};

/**
 * Get the stored auth token
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  if (!token) return false;

  // Check if token is expired
  const expiresAt = localStorage.getItem('authTokenExpiresAt');
  if (expiresAt) {
    const expiryDate = new Date(expiresAt);
    if (expiryDate < new Date()) {
      clearAuth();
      return false;
    }
  }

  return true;
};

/**
 * Clear authentication data
 */
export const clearAuth = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem('authTokenExpiresAt');
  localStorage.removeItem('authUserId');
  localStorage.removeItem('authUserEmail');
};

/**
 * Get current user info from stored data
 */
export const getCurrentUser = (): { userId: string; email: string } | null => {
  const userId = localStorage.getItem('authUserId');
  const email = localStorage.getItem('authUserEmail');
  
  if (userId && email) {
    return { userId, email };
  }
  
  return null;
};

/**
 * Initialize authentication with test credentials
 * This is a convenience function for development/testing
 */
export const initializeTestAuth = async (): Promise<TokenResponse> => {
  return authenticate('test@example.com', 'auth0|test123');
};

// Make auth functions available globally for console access (development only)
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as any).auth = {
    authenticate,
    initializeTestAuth,
    isAuthenticated,
    getAuthToken,
    clearAuth,
    getCurrentUser,
  };
}
