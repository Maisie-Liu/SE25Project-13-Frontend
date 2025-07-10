import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// 获取用户公开资料
export const fetchUserPublicProfile = createAsyncThunk(
  'userPublicProfile/fetch',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/users/${userId}`);
      if (response.data && response.data.code === 200) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || '获取用户资料失败');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '获取用户资料失败'
      );
    }
  }
); 