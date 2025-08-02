import axios from 'axios';

const API_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器，添加认证令牌
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器，处理认证错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 清除本地存储的认证信息
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // 可以在这里添加重定向到登录页面的逻辑
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const fetchProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const updateProductStock = async (id, newStock) => {
  try {
    const product = await api.get(`/products/${id}`);
    const updatedProduct = { ...product.data, stock: newStock };
    const response = await api.put(`/products/${id}`, updatedProduct);
    return response.data;
  } catch (error) {
    console.error('Error updating product stock:', error);
    throw error;
  }
};

export const toggleProductActive = async (id) => {
  try {
    const product = await api.get(`/products/${id}`);
    const updatedProduct = { ...product.data, isActive: !product.data.isActive };
    const response = await api.put(`/products/${id}`, updatedProduct);
    return response.data;
  } catch (error) {
    console.error('Error toggling product status:', error);
    throw error;
  }
};

export const addNewProduct = async (productData) => {
  try {
    const response = await api.post('/products', productData);
    return response.data;
  } catch (error) {
    console.error('Error adding new product:', error);
    throw error;
  }
};

// 认证相关API
export const register = async (username, email, password) => {
  try {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    // 保存令牌和用户信息到本地存储
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

// 购物车相关API
export const getCart = async () => {
  try {
    const response = await api.get('/carts/my-cart');
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

export const addItemToCart = async (productId, quantity) => {
  try {
    const response = await api.post('/carts/add-to-cart', { productId, quantity });
    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

export const updateCartItem = async (itemId, quantity) => {
  try {
    const response = await api.patch(`/carts/cart-items/${itemId}`, { quantity });
    return response.data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

export const removeCartItem = async (itemId) => {
  try {
    const response = await api.delete(`/carts/cart-items/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing cart item:', error);
    throw error;
  }
};

export const clearCart = async () => {
  try {
    const response = await api.delete('/carts/clear');
    return response.data;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

// 订单相关API
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getMyOrders = async () => {
  try {
    const response = await api.get('/orders/my-orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getOrderDetails = async (orderId) => {
  try {
    const response = await api.get(`/orders/my-orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await api.patch(`/orders/my-orders/${orderId}/cancel`);
    return response.data;
  } catch (error) {
    console.error('Error canceling order:', error);
    throw error;
  }
};

export default api;