import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// 获取用户收藏列表
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (params, { rejectWithValue }) => {
    try {
      // 将前端的page参数转换为后端的pageNum参数
      const backendParams = {
        pageNum: (params.page || 0) + 1, // 后端页码从1开始
        pageSize: params.size || 10
      };
      
      const response = await axios.get('/favorites', { params: backendParams });
      
      // 适配后端返回的PageResponseDTO格式
      return {
        items: response.data.data.list || [],
        totalItems: response.data.data.total || 0,
        totalPages: response.data.data.pages || 0,
        currentPage: (response.data.data.pageNum || 1) - 1 // 转换为从0开始的页码
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '获取收藏列表失败'
      );
    }
  }
);

// 添加收藏
export const addFavorite = createAsyncThunk(
  'favorites/addFavorite',
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await axios.post('/favorites', { itemId });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '添加收藏失败'
      );
    }
  }
);

// 移除收藏
export const removeFavorite = createAsyncThunk(
  'favorites/removeFavorite',
  async (favoriteId, { rejectWithValue }) => {
    try {
      await axios.delete(`/favorites/${favoriteId}`);
      return favoriteId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '移除收藏失败'
      );
    }
  }
);

// 根据物品ID移除收藏
export const removeFavoriteByItemId = createAsyncThunk(
  'favorites/removeFavoriteByItemId',
  async (itemId, { rejectWithValue }) => {
    try {
      await axios.delete(`/favorites/item/${itemId}`);
      return itemId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '移除收藏失败'
      );
    }
  }
);

// 检查物品是否已收藏
export const checkIsFavorite = createAsyncThunk(
  'favorites/checkIsFavorite',
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/favorites/check/${itemId}`);
      // 返回收藏信息，如果未收藏则为null
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // 404表示未收藏
        return null;
      }
      return rejectWithValue(
        error.response?.data?.message || '检查收藏状态失败'
      );
    }
  }
); 