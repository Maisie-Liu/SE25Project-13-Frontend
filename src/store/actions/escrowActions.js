import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  setEscrowLoading,
  setEscrowError,
  setPaymentQRCode
} from '../slices/escrowSlice';

// 创建托管交易
export const createEscrow = createAsyncThunk(
  'escrow/createEscrow',
  async (orderId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.post('/escrow/create', { orderId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '创建托管交易失败'
      );
    }
  }
);

// 支付托管定金
export const payEscrow = createAsyncThunk(
  'escrow/payEscrow',
  async (escrowId, { getState, dispatch, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.post(`/escrow/${escrowId}/pay`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // 生成支付二维码
      if (response.data.data.paymentInfo) {
        dispatch(setPaymentQRCode(response.data.data.paymentInfo));
      }
      
      return response.data.data;
    } catch (error) {
      dispatch(setEscrowError(error.response?.data?.message || '支付托管定金失败'));
      return rejectWithValue(
        error.response?.data?.message || '支付托管定金失败'
      );
    }
  }
);

// 释放托管定金给卖家
export const releaseEscrow = createAsyncThunk(
  'escrow/releaseEscrow',
  async (escrowId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.post(`/escrow/${escrowId}/release`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '释放托管定金失败'
      );
    }
  }
);

// 退还托管定金给买家
export const refundEscrow = createAsyncThunk(
  'escrow/refundEscrow',
  async (escrowId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.post(`/escrow/${escrowId}/refund`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '退还托管定金失败'
      );
    }
  }
);

// 获取托管交易详情
export const getEscrowById = createAsyncThunk(
  'escrow/getEscrowById',
  async (escrowId, { getState, dispatch, rejectWithValue }) => {
    try {
      dispatch(setEscrowLoading(true));
      const { token } = getState().auth;
      const response = await axios.get(`/escrow/${escrowId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      dispatch(setEscrowError(error.response?.data?.message || '获取托管交易详情失败'));
      return rejectWithValue(
        error.response?.data?.message || '获取托管交易详情失败'
      );
    }
  }
);

// 根据订单ID获取托管交易
export const getEscrowByOrderId = createAsyncThunk(
  'escrow/getEscrowByOrderId',
  async (orderId, { getState, dispatch, rejectWithValue }) => {
    try {
      dispatch(setEscrowLoading(true));
      const { token } = getState().auth;
      const response = await axios.get(`/escrow/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      dispatch(setEscrowError(error.response?.data?.message || '获取订单托管交易失败'));
      return rejectWithValue(
        error.response?.data?.message || '获取订单托管交易失败'
      );
    }
  }
); 