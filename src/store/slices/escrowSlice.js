import { createSlice } from '@reduxjs/toolkit';
import { 
  createEscrow, payEscrow, releaseEscrow, refundEscrow,
  getEscrowById, getEscrowByOrderId
} from '../actions/escrowActions';

// 初始状态
const initialState = {
  escrowDetail: null,
  paymentInfo: null,
  transactions: [],
  currentTransaction: null,
  paymentQRCode: null,
  loading: false,
  error: null,
};

// 创建Slice
const escrowSlice = createSlice({
  name: 'escrow',
  initialState,
  reducers: {
    setEscrowLoading: (state, action) => {
      state.loading = action.payload;
    },
    setEscrowError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearEscrowError: (state) => {
      state.error = null;
    },
    clearEscrowDetail: (state) => {
      state.escrowDetail = null;
    },
    clearPaymentInfo: (state) => {
      state.paymentInfo = null;
    },
    setTransactions: (state, action) => {
      state.transactions = action.payload;
      state.loading = false;
    },
    setCurrentTransaction: (state, action) => {
      state.currentTransaction = action.payload;
      state.loading = false;
    },
    setPaymentQRCode: (state, action) => {
      state.paymentQRCode = action.payload;
      state.loading = false;
    },
    clearCurrentTransaction: (state) => {
      state.currentTransaction = null;
    },
    updateTransactionStatus: (state, action) => {
      const { transactionId, status } = action.payload;
      if (state.currentTransaction && state.currentTransaction.id === transactionId) {
        state.currentTransaction.status = status;
      }
      
      state.transactions = state.transactions.map(transaction => 
        transaction.id === transactionId ? { ...transaction, status } : transaction
      );
      state.loading = false;
    }
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
export const {
  setEscrowLoading,
  setEscrowError,
  clearEscrowError,
  clearEscrowDetail,
  clearPaymentInfo,
  setTransactions,
  setCurrentTransaction,
  setPaymentQRCode,
  clearCurrentTransaction,
  updateTransactionStatus
} = escrowSlice.actions;

// 导出Selector
export const selectEscrowDetail = (state) => state.escrow.escrowDetail;
export const selectPaymentInfo = (state) => state.escrow.paymentInfo;
export const selectTransactions = (state) => state.escrow.transactions;
export const selectCurrentTransaction = (state) => state.escrow.currentTransaction;
export const selectPaymentQRCode = (state) => state.escrow.paymentQRCode;
export const selectEscrowLoading = (state) => state.escrow.loading;
export const selectEscrowError = (state) => state.escrow.error;

// 导出Reducer
export default escrowSlice.reducer; 