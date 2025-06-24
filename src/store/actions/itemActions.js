import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 获取物品列表
export const fetchItems = createAsyncThunk(
  'item/fetchItems',
  async ({ pageNum = 1, pageSize = 10, sort = 'createTime', order = 'desc' }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/items?pageNum=${pageNum}&pageSize=${pageSize}&sort=${sort}&order=${order}`);
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
  async (itemData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.post('/items', itemData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
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
  async ({ id, itemData }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.put(`/items/${id}`, itemData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
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
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.delete(`/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
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
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.put(`/items/${id}/publish`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
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
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.put(`/items/${id}/unpublish`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
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
  async ({ userId, pageNum = 1, pageSize = 10 }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get(`/items/user/${userId}?pageNum=${pageNum}&pageSize=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${token}`
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
      const response = await axios.get(`/items/category/${categoryId}?pageNum=${pageNum}&pageSize=${pageSize}`);
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
      let url = `/items/search?pageNum=${pageNum}&pageSize=${pageSize}&sort=${sort}&order=${order}`;
      if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
      if (categoryId) url += `&categoryId=${categoryId}`;
      if (minPrice) url += `&minPrice=${minPrice}`;
      if (maxPrice) url += `&maxPrice=${maxPrice}`;
      if (condition) url += `&condition=${condition}`;

      const response = await axios.get(url);
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
  async (formData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.post('/items/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
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
  async (imageUrl, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.post('/items/generate-description', { imageUrl }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
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
      const response = await axios.get(`/items/recommended?pageNum=${pageNum}&pageSize=${pageSize}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '获取推荐物品列表失败'
      );
    }
  }
); 