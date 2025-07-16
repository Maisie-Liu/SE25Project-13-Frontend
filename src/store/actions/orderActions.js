import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';
import { 
  setOrderLoading, 
  setOrderError, 
  setOrders, 
  setCurrentOrder,
  updateOrderStatus
} from '../slices/orderSlice';

// 获取用户订单列表（买家+卖家合并）
export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async (params, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setOrderLoading(true));
      // 分别请求买家和卖家订单
      const [buyerRes, sellerRes] = await Promise.all([
        axios.get('/orders/buyer', { params: { pageNum: 1, pageSize: 100 } }),
        axios.get('/orders/seller', { params: { pageNum: 1, pageSize: 100 } })
      ]);
      // 合并订单数据
      const buyerOrders = buyerRes.data.data?.list || [];
      const sellerOrders = sellerRes.data.data?.list || [];
      const allOrders = [...buyerOrders, ...sellerOrders];
      dispatch(setOrders(allOrders));
      return allOrders;
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
      dispatch(setCurrentOrder(response.data.data));
      return response.data.data;
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
      const response = await axios.post('/orders', null, { params: orderData });
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
  async ({ orderId, reason }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setOrderLoading(true));
      const response = await axios.put(`/orders/${orderId}/cancel`, null, { params: { reason } });
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

// 卖家确认订单
export const confirmOrder = createAsyncThunk(
  'order/confirmOrder',
  async ({ orderId, sellerRemark }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setOrderLoading(true));
      const response = await axios.put(`/orders/${orderId}/confirm`, sellerRemark ? { sellerRemark } : undefined);
      return response.data;
    } catch (error) {
      dispatch(setOrderError(error.response?.data?.message || '确认订单失败'));
      return rejectWithValue(error.response?.data?.message || '确认订单失败');
    }
  }
);

// 卖家发货
export const deliverOrder = createAsyncThunk(
  'order/deliverOrder',
  async ({ orderId, trackingNumber }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setOrderLoading(true));
      const response = await axios.put(`/orders/${orderId}/deliver`, null, { params: { trackingNumber } });
      return response.data;
    } catch (error) {
      dispatch(setOrderError(error.response?.data?.message || '发货失败'));
      return rejectWithValue(error.response?.data?.message || '发货失败');
    }
  }
);

// 买家确认收货
export const confirmReceive = createAsyncThunk(
  'order/confirmReceive',
  async (orderId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setOrderLoading(true));
      const response = await axios.put(`/orders/${orderId}/receive`);
      return response.data;
    } catch (error) {
      dispatch(setOrderError(error.response?.data?.message || '确认收货失败'));
      return rejectWithValue(error.response?.data?.message || '确认收货失败');
    }
  }
);

// 订单评价
export const commentOrder = createAsyncThunk(
  'order/commentOrder',
  async ({ orderId, comment, isBuyer, rating }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setOrderLoading(true));
      const response = await axios.put(`/orders/${orderId}/comment`, null, { params: { comment, isBuyer, rating } });
      return response.data;
    } catch (error) {
      dispatch(setOrderError(error.response?.data?.message || '评价失败'));
      return rejectWithValue(error.response?.data?.message || '评价失败');
    }
  }
); 

// 卖家拒绝订单
export const rejectOrder = createAsyncThunk(
  'order/rejectOrder',
  async ({ orderId, sellerRemark }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/orders/${orderId}/reject`, sellerRemark ? { sellerRemark } : undefined);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '拒绝订单失败');
    }
  }
); 