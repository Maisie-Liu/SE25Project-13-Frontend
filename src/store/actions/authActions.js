import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 登录
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('/auth/login', credentials);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '登录失败，请检查用户名和密码'
      );
    }
  }
);

// 注册
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/auth/register', userData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '注册失败，请检查输入信息'
      );
    }
  }
);

// 登出
export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    return true;
  }
);

// 获取当前用户信息
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get('/auth/current-user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '获取用户信息失败'
      );
    }
  }
);

// 更新用户信息
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.put('/users/profile', userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '更新用户信息失败'
      );
    }
  }
);

// 更新用户密码
export const updateUserPassword = createAsyncThunk(
  'auth/updateUserPassword',
  async (passwordData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.put('/users/password', passwordData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '更新密码失败'
      );
    }
  }
);

// 上传头像
export const uploadAvatar = createAsyncThunk(
  'auth/uploadAvatar',
  async (formData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.post('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '上传头像失败'
      );
    }
  }
); 