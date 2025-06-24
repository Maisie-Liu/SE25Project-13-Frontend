import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { 
  setFavoriteLoading, 
  setFavoriteError, 
  setFavorites,
  addFavorite,
  removeFavorite
} from '../slices/favoriteSlice';

// 获取用户收藏列表
export const fetchUserFavorites = createAsyncThunk(
  'favorite/fetchUserFavorites',
  async (params, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setFavoriteLoading(true));
      const response = await axios.get('/favorites', { params });
      dispatch(setFavorites(response.data));
      return response.data;
    } catch (error) {
      dispatch(setFavoriteError(error.response?.data?.message || '获取收藏列表失败'));
      return rejectWithValue(error.response?.data?.message || '获取收藏列表失败');
    }
  }
);

// 添加收藏
export const addToFavorite = createAsyncThunk(
  'favorite/addToFavorite',
  async (itemId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setFavoriteLoading(true));
      const response = await axios.post('/favorites', { itemId });
      dispatch(addFavorite(response.data));
      return response.data;
    } catch (error) {
      dispatch(setFavoriteError(error.response?.data?.message || '添加收藏失败'));
      return rejectWithValue(error.response?.data?.message || '添加收藏失败');
    }
  }
);

// 取消收藏
export const removeFromFavorite = createAsyncThunk(
  'favorite/removeFromFavorite',
  async (favoriteId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setFavoriteLoading(true));
      await axios.delete(`/favorites/${favoriteId}`);
      dispatch(removeFavorite(favoriteId));
      return favoriteId;
    } catch (error) {
      dispatch(setFavoriteError(error.response?.data?.message || '取消收藏失败'));
      return rejectWithValue(error.response?.data?.message || '取消收藏失败');
    }
  }
);

// 检查物品是否已收藏
export const checkFavoriteStatus = createAsyncThunk(
  'favorite/checkFavoriteStatus',
  async (itemId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setFavoriteLoading(true));
      const response = await axios.get(`/favorites/check/${itemId}`);
      return response.data;
    } catch (error) {
      dispatch(setFavoriteError(error.response?.data?.message || '检查收藏状态失败'));
      return rejectWithValue(error.response?.data?.message || '检查收藏状态失败');
    }
  }
); 