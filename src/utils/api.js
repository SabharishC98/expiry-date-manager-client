const rawUrl = import.meta.env.VITE_API_URL || '';
const BASE_URL = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;

export const apiCall = async (endpoint, options = {}) => {
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
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
    const url = endpoint.startsWith('/') ? `${BASE_URL}${endpoint}` : `${BASE_URL}/${endpoint}`;
    const response = await fetch(url, finalOptions);
    
    const text = await response.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(`Server returned invalid response (Status ${response.status}). Verify VITE_API_URL is configured on Vercel.`);
    }
    
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
    }),

  logout: () =>
    apiCall('/auth/logout', {
      method: 'POST'
    }),

  getMe: () =>
    apiCall('/auth/me', {
      method: 'GET'
    })
};

export const productAPI = {
  getProducts: (params = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    if (params.search) query.append('search', params.search);
    if (params.timeframe) query.append('timeframe', params.timeframe);
    if (params.category) query.append('category', params.category);
    if (params.location) query.append('location', params.location);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return apiCall(`/products${queryString}`, { method: 'GET' });
  },

  getStats: () =>
    apiCall('/products/stats', { method: 'GET' }),

  getProductById: (id) =>
    apiCall(`/products/${id}`, { method: 'GET' }),

  createProduct: (productData) =>
    apiCall('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    }),

  updateProduct: (id, productData) =>
    apiCall(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    }),

  deleteProduct: (id) =>
    apiCall(`/products/${id}`, {
      method: 'DELETE'
    })
};
