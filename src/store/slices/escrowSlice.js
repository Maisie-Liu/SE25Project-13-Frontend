import { createSlice } from '@reduxjs/toolkit';
import { 
  createEscrow, payEscrow, releaseEscrow, refundEscrow,
  getEscrowById, getEscrowByOrderId
} from '../actions/escrowActions';

// 初始状态
const initialState = {
  escrowDetail: null,
  paymentInfo: null,
  loading: false,
  error: null,
};

// 创建Slice
const escrowSlice = createSlice({
  name: 'escrow',
  initialState,
  reducers: {
    clearEscrowError: (state) => {
      state.error = null;
    },
    clearEscrowDetail: (state) => {
      state.escrowDetail = null;
    },
    clearPaymentInfo: (state) => {
      state.paymentInfo = null;
    },
  },
  extraReducers: (builder) => {
    // 创建托管
    builder.addCase(createEscrow.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createEscrow.fulfilled, (state, action) => {
      state.loading = false;
      state.escrowDetail = action.payload;
    });
    builder.addCase(createEscrow.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || '创建定金托管失败';
    });

    // 支付定金
    builder.addCase(payEscrow.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(payEscrow.fulfilled, (state, action) => {
      state.loading = false;
      state.paymentInfo = action.payload;
    });
    builder.addCase(payEscrow.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || '支付定金失败';
    });

    // 释放定金
    builder.addCase(releaseEscrow.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(releaseEscrow.fulfilled, (state) => {
      state.loading = false;
      // 释放成功后重新获取托管详情
      if (state.escrowDetail) {
        state.escrowDetail = {
          ...state.escrowDetail,
          status: 3, // 已释放给卖家
        };
      }
    });
    builder.addCase(releaseEscrow.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || '释放定金失败';
    });

    // 退还定金
    builder.addCase(refundEscrow.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(refundEscrow.fulfilled, (state) => {
      state.loading = false;
      // 退还成功后重新获取托管详情
      if (state.escrowDetail) {
        state.escrowDetail = {
          ...state.escrowDetail,
          status: 4, // 已退还给买家
        };
      }
    });
    builder.addCase(refundEscrow.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || '退还定金失败';
    });

    // 获取托管详情
    builder.addCase(getEscrowById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getEscrowById.fulfilled, (state, action) => {
      state.loading = false;
      state.escrowDetail = action.payload;
    });
    builder.addCase(getEscrowById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || '获取托管详情失败';
    });

    // 根据订单ID获取托管信息
    builder.addCase(getEscrowByOrderId.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getEscrowByOrderId.fulfilled, (state, action) => {
      state.loading = false;
      state.escrowDetail = action.payload;
    });
    builder.addCase(getEscrowByOrderId.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || '获取托管信息失败';
    });
  },
});

// 导出Action
export const { clearEscrowError, clearEscrowDetail, clearPaymentInfo } = escrowSlice.actions;

// 导出Selector
export const selectEscrowDetail = (state) => state.escrow.escrowDetail;
export const selectPaymentInfo = (state) => state.escrow.paymentInfo;
export const selectEscrowLoading = (state) => state.escrow.loading;
export const selectEscrowError = (state) => state.escrow.error;

// 导出Reducer
export default escrowSlice.reducer; 