import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 创建定金托管
export const createEscrow = createAsyncThunk(
  'escrow/createEscrow',
  async ({ orderId, escrowAmount, expireTime }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append('orderId', orderId);
      params.append('escrowAmount', escrowAmount);
      if (expireTime) {
        params.append('expireTime', expireTime);
      }
      
      const response = await axios.post('/escrow', params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '创建定金托管失败'
      );
    }
  }
);

// 支付定金
export const payEscrow = createAsyncThunk(
  'escrow/payEscrow',
  async ({ escrowId, paymentMethod }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append('paymentMethod', paymentMethod);
      
      const response = await axios.post(`/escrow/${escrowId}/pay`, params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '支付定金失败'
      );
    }
  }
);

// 释放定金给卖家
export const releaseEscrow = createAsyncThunk(
  'escrow/releaseEscrow',
  async (escrowId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/escrow/${escrowId}/release`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '释放定金失败'
      );
    }
  }
);

// 退还定金给买家
export const refundEscrow = createAsyncThunk(
  'escrow/refundEscrow',
  async ({ escrowId, reason }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append('reason', reason);
      
      const response = await axios.post(`/escrow/${escrowId}/refund`, params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '退还定金失败'
      );
    }
  }
);

// 获取托管详情
export const getEscrowById = createAsyncThunk(
  'escrow/getEscrowById',
  async (escrowId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/escrow/${escrowId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '获取托管详情失败'
      );
    }
  }
);

// 根据订单ID获取托管信息
export const getEscrowByOrderId = createAsyncThunk(
  'escrow/getEscrowByOrderId',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/escrow/order/${orderId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '获取托管信息失败'
      );
    }
  }
); 