import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/category/list');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || '获取分类失败');
  }
}); 