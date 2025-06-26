import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// 获取物品列表
export const fetchItems = createAsyncThunk(
  'item/fetchItems',
  async ({ pageNum = 1, pageSize = 10, sort = 'createTime', order = 'desc', keyword, category, condition, minPrice, maxPrice, campus, hasImage }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/items/search`, {
        params: {
          pageNum,
          pageSize,
          sort,
          order,
          keyword,
          categoryId: category,
          condition,
          minPrice,
          maxPrice,
          campus,
          hasImage
        }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '获取物品列表失败'
      );
    }
  }
);

// 获取物品详情
export const fetchItemById = createAsyncThunk(
  'item/fetchItemById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/items/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '获取物品详情失败'
      );
    }
  }
);

// 创建物品
export const createItem = createAsyncThunk(
  'item/createItem',
  async (itemData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/items', itemData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '创建物品失败'
      );
    }
  }
);

// 更新物品
export const updateItem = createAsyncThunk(
  'item/updateItem',
  async ({ id, itemData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/items/${id}`, itemData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '更新物品失败'
      );
    }
  }
);

// 删除物品
export const deleteItem = createAsyncThunk(
  'item/deleteItem',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/items/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '删除物品失败'
      );
    }
  }
);

// 上架物品
export const publishItem = createAsyncThunk(
  'item/publishItem',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/items/${id}/publish`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '上架物品失败'
      );
    }
  }
);

// 下架物品
export const unpublishItem = createAsyncThunk(
  'item/unpublishItem',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/items/${id}/unpublish`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '下架物品失败'
      );
    }
  }
);

// 获取用户物品列表
export const fetchUserItems = createAsyncThunk(
  'item/fetchUserItems',
  async ({ userId, pageNum = 1, pageSize = 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/items/user/${userId}`, {
        params: {
          pageNum,
          pageSize
        }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '获取用户物品列表失败'
      );
    }
  }
);

// 获取分类物品列表
export const fetchCategoryItems = createAsyncThunk(
  'item/fetchCategoryItems',
  async ({ categoryId, pageNum = 1, pageSize = 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/items/category/${categoryId}`, {
        params: {
          pageNum,
          pageSize
        }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '获取分类物品列表失败'
      );
    }
  }
);

// 搜索物品
export const searchItems = createAsyncThunk(
  'item/searchItems',
  async ({ keyword, categoryId, minPrice, maxPrice, condition, pageNum = 1, pageSize = 10, sort = 'createTime', order = 'desc' }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/items/search', {
        params: {
          keyword,
          categoryId,
          minPrice,
          maxPrice,
          condition,
          pageNum,
          pageSize,
          sort,
          order
        }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '搜索物品失败'
      );
    }
  }
);

// 上传物品图片
export const uploadItemImage = createAsyncThunk(
  'item/uploadItemImage',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/items/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '上传物品图片失败'
      );
    }
  }
);

// 生成物品描述
export const generateItemDescription = createAsyncThunk(
  'item/generateItemDescription',
  async (imageUrl, { rejectWithValue }) => {
    try {
      const response = await axios.post('/items/generate-description', { imageUrl });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '生成物品描述失败'
      );
    }
  }
);

// 获取推荐物品列表
export const fetchRecommendedItems = createAsyncThunk(
  'item/fetchRecommendedItems',
  async ({ pageNum = 1, pageSize = 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/items/recommended', {
        params: {
          pageNum,
          pageSize
        }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '获取推荐物品列表失败'
      );
    }
  }
);

// 获取当前用户的物品列表
export const fetchMyItems = createAsyncThunk(
  'item/fetchMyItems',
  async ({ pageNum = 1, pageSize = 10 }, { getState, rejectWithValue }) => {
    try {
      const { currentUser } = getState().auth;
      const response = await axios.get(`/items/user/${currentUser.id}`, {
        params: {
          pageNum,
          pageSize
        }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '获取我的物品列表失败'
      );
    }
  }
);

// 更新物品状态
export const updateItemStatus = createAsyncThunk(
  'item/updateItemStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      let endpoint = '';
      
      switch (status) {
        case 'PUBLISHED':
          endpoint = `/items/${id}/publish`;
          break;
        case 'UNPUBLISHED':
          endpoint = `/items/${id}/unpublish`;
          break;
        case 'SOLD':
          endpoint = `/items/${id}/mark-sold`;
          break;
        default:
          endpoint = `/items/${id}/status`;
      }
      
      const response = await axios.put(endpoint, { status });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '更新物品状态失败'
      );
    }
  }
); 