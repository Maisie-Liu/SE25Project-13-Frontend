import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { 
  setOrderLoading, 
  setOrderError, 
  setOrders, 
  setCurrentOrder,
  updateOrderStatus
} from '../slices/orderSlice';

// 获取用户订单列表
export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async (params, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setOrderLoading(true));
      const response = await axios.get('/orders/user', { params });
      dispatch(setOrders(response.data));
      return response.data;
    } catch (error) {
      dispatch(setOrderError(error.response?.data?.message || '获取订单列表失败'));
      return rejectWithValue(error.response?.data?.message || '获取订单列表失败');
    }
  }
);

// 获取卖家订单列表
export const fetchSellerOrders = createAsyncThunk(
  'order/fetchSellerOrders',
  async (params, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setOrderLoading(true));
      const response = await axios.get('/orders/seller', { params });
      dispatch(setOrders(response.data));
      return response.data;
    } catch (error) {
      dispatch(setOrderError(error.response?.data?.message || '获取卖家订单列表失败'));
      return rejectWithValue(error.response?.data?.message || '获取卖家订单列表失败');
    }
  }
);

// 获取订单详情
export const fetchOrderById = createAsyncThunk(
  'order/fetchOrderById',
  async (orderId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setOrderLoading(true));
      const response = await axios.get(`/orders/${orderId}`);
      dispatch(setCurrentOrder(response.data));
      return response.data;
    } catch (error) {
      dispatch(setOrderError(error.response?.data?.message || '获取订单详情失败'));
      return rejectWithValue(error.response?.data?.message || '获取订单详情失败');
    }
  }
);

// 创建订单
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setOrderLoading(true));
      const response = await axios.post('/orders', orderData);
      return response.data;
    } catch (error) {
      dispatch(setOrderError(error.response?.data?.message || '创建订单失败'));
      return rejectWithValue(error.response?.data?.message || '创建订单失败');
    }
  }
);

// 更新订单状态
export const updateOrder = createAsyncThunk(
  'order/updateOrder',
  async ({ orderId, status }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setOrderLoading(true));
      const response = await axios.put(`/orders/${orderId}/status`, { status });
      dispatch(updateOrderStatus({ orderId, status }));
      return response.data;
    } catch (error) {
      dispatch(setOrderError(error.response?.data?.message || '更新订单状态失败'));
      return rejectWithValue(error.response?.data?.message || '更新订单状态失败');
    }
  }
);

// 取消订单
export const cancelOrder = createAsyncThunk(
  'order/cancelOrder',
  async (orderId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setOrderLoading(true));
      const response = await axios.put(`/orders/${orderId}/cancel`);
      dispatch(updateOrderStatus({ orderId, status: 'CANCELLED' }));
      return response.data;
    } catch (error) {
      dispatch(setOrderError(error.response?.data?.message || '取消订单失败'));
      return rejectWithValue(error.response?.data?.message || '取消订单失败');
    }
  }
);

// 确认收货
export const confirmReceipt = createAsyncThunk(
  'order/confirmReceipt',
  async (orderId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setOrderLoading(true));
      const response = await axios.put(`/orders/${orderId}/confirm`);
      dispatch(updateOrderStatus({ orderId, status: 'COMPLETED' }));
      return response.data;
    } catch (error) {
      dispatch(setOrderError(error.response?.data?.message || '确认收货失败'));
      return rejectWithValue(error.response?.data?.message || '确认收货失败');
    }
  }
);

// 评价订单
export const rateOrder = createAsyncThunk(
  'order/rateOrder',
  async ({ orderId, rating, comment }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setOrderLoading(true));
      const response = await axios.post(`/orders/${orderId}/rate`, { rating, comment });
      return response.data;
    } catch (error) {
      dispatch(setOrderError(error.response?.data?.message || '评价订单失败'));
      return rejectWithValue(error.response?.data?.message || '评价订单失败');
    }
  }
); 