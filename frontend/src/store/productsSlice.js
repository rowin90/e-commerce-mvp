import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts, updateProductStock, toggleProductActive, addNewProduct, updateProduct } from '../services/api';

// 异步获取商品数据
export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (_, { rejectWithValue }) => {
    try {
      const products = await fetchProducts();
      return products;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 异步更新商品库存
export const updateProductStockAsync = createAsyncThunk(
  'products/updateStock',
  async ({ id, newStock }, { rejectWithValue }) => {
    try {
      const updatedProduct = await updateProductStock(id, newStock);
      return updatedProduct;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 异步切换商品状态
export const toggleProductStatusAsync = createAsyncThunk(
  'products/toggleStatus',
  async (id, { rejectWithValue }) => {
    try {
      const updatedProduct = await toggleProductActive(id);
      return updatedProduct;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 异步添加新商品
export const addProductAsync = createAsyncThunk(
  'products/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const newProduct = await addNewProduct(productData);
      return newProduct;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 异步更新商品
export const updateProductAsync = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const updatedProduct = await updateProduct(id, productData);
      return updatedProduct;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 获取商品列表
      .addCase(getProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // 更新商品库存
      .addCase(updateProductStockAsync.fulfilled, (state, action) => {
        const updatedProduct = action.payload;
        const index = state.items.findIndex(item => item.id === updatedProduct.id);
        if (index !== -1) {
          state.items[index] = updatedProduct;
        }
      })
      // 切换商品状态
      .addCase(toggleProductStatusAsync.fulfilled, (state, action) => {
        const updatedProduct = action.payload;
        const index = state.items.findIndex(item => item.id === updatedProduct.id);
        if (index !== -1) {
          state.items[index] = updatedProduct;
        }
      })
      // 添加新商品
      .addCase(addProductAsync.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // 更新商品
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        const updatedProduct = action.payload;
        const index = state.items.findIndex(item => item.id === updatedProduct.id);
        if (index !== -1) {
          state.items[index] = updatedProduct;
        }
      });
  },
});

export default productsSlice.reducer;