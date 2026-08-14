const BASE_URL = ''; // using Vite proxy

export const apiCall = async (endpoint, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    // This ensures cookies are sent with requests and set on responses
    // However, since we are using vite proxy (same origin for the browser), this is true by default
    // But it's good practice to keep it explicit for future-proofing.
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, finalOptions);
    
    // Safely parse JSON, handling empty responses
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    
    if (!response.ok) {
      let errorMessage = 'An error occurred during the API call';
      if (data.errors && Array.isArray(data.errors)) {
        errorMessage = data.errors.map(err => err.msg).join(', ');
      } else if (data.message) {
        errorMessage = data.message;
      } else if (data.error) {
        errorMessage = data.error;
      }
      throw new Error(errorMessage);
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const authAPI = {
  login: (credentials) => 
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),
    
  register: (userData) => 
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
};
