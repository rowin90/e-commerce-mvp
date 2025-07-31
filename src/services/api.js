import axios from 'axios';

const API_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export default api;