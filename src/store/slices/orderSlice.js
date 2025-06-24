import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    current: 1,
    pageSize: 10
  }
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderLoading: (state, action) => {
      state.loading = action.payload;
    },
    setOrderError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearOrderError: (state) => {
      state.error = null;
    },
    setOrders: (state, action) => {
      state.orders = action.payload.orders;
      state.pagination = {
        ...state.pagination,
        total: action.payload.total || action.payload.orders.length,
        current: action.payload.current || state.pagination.current
      };
      state.loading = false;
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
      state.loading = false;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      if (state.currentOrder && state.currentOrder.id === orderId) {
        state.currentOrder.status = status;
      }
      
      state.orders = state.orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      );
      state.loading = false;
    }
  }
});

export const {
  setOrderLoading,
  setOrderError,
  clearOrderError,
  setOrders,
  setCurrentOrder,
  clearCurrentOrder,
  updateOrderStatus
} = orderSlice.actions;

// Selectors
export const selectOrders = (state) => state.order.orders;
export const selectOrderLoading = (state) => state.order.loading;
export const selectOrderError = (state) => state.order.error;
export const selectCurrentOrder = (state) => state.order.currentOrder;
export const selectOrderPagination = (state) => state.order.pagination;

export default orderSlice.reducer; 