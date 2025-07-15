import { createSlice } from '@reduxjs/toolkit';
import {
  FETCH_BUY_REQUESTS_REQUEST,
  FETCH_BUY_REQUESTS_SUCCESS,
  FETCH_BUY_REQUESTS_FAILURE,
  FETCH_BUY_REQUEST_DETAIL_SUCCESS,
  CREATE_BUY_REQUEST_SUCCESS,
  UPDATE_BUY_REQUEST_SUCCESS,
  DELETE_BUY_REQUEST_SUCCESS,
  FETCH_BUY_REQUEST_COMMENTS_SUCCESS,
  CREATE_BUY_REQUEST_COMMENT_SUCCESS,
  DELETE_BUY_REQUEST_COMMENT_SUCCESS
} from '../actions/buyRequestActions';

const initialState = {
  loading: false,
  list: [],
  pageNum: 0,
  pageSize: 10,
  total: 0,
  detail: null,
  comments: {}, // { [buyRequestId]: { list, pageNum, pageSize, total } }
  error: null
};

const buyRequestSlice = createSlice({
  name: 'buyRequest',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(FETCH_BUY_REQUESTS_REQUEST, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(FETCH_BUY_REQUESTS_SUCCESS, (state, action) => {
        state.loading = false;
        state.list = action.payload.list || [];
        state.pageNum = action.payload.pageNum || 0;
        state.pageSize = action.payload.pageSize || 10;
        state.total = action.payload.totalElements || 0;
      })
      .addCase(FETCH_BUY_REQUESTS_FAILURE, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(FETCH_BUY_REQUEST_DETAIL_SUCCESS, (state, action) => {
        state.detail = action.payload;
      })
      .addCase(CREATE_BUY_REQUEST_SUCCESS, (state, action) => {
        state.list.unshift(action.payload);
        state.total += 1;
      })
      .addCase(UPDATE_BUY_REQUEST_SUCCESS, (state, action) => {
        const idx = state.list.findIndex(item => item.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.detail && state.detail.id === action.payload.id) {
          state.detail = action.payload;
        }
      })
      .addCase(DELETE_BUY_REQUEST_SUCCESS, (state, action) => {
        state.list = state.list.filter(item => item.id !== action.payload);
        state.total -= 1;
        if (state.detail && state.detail.id === action.payload) {
          state.detail = null;
        }
      })
      .addCase(FETCH_BUY_REQUEST_COMMENTS_SUCCESS, (state, action) => {
        const { buyRequestId, list, pageNum, pageSize, totalElements, append } = action.payload;
        if (!state.comments[buyRequestId] || !append) {
          state.comments[buyRequestId] = {
            list: list || [],
            pageNum: pageNum || 0,
            pageSize: pageSize || 10,
            total: totalElements || 0
          };
        } else {
          // 加载更多时合并
          state.comments[buyRequestId].list = [
            ...state.comments[buyRequestId].list,
            ...(list || [])
          ];
          state.comments[buyRequestId].pageNum = pageNum || 0;
          state.comments[buyRequestId].pageSize = pageSize || 10;
          state.comments[buyRequestId].total = totalElements || 0;
        }
      })
      .addCase(CREATE_BUY_REQUEST_COMMENT_SUCCESS, (state, action) => {
        const comment = action.payload;
        const buyRequestId = comment.buyRequestId;
        if (state.comments[buyRequestId]) {
          state.comments[buyRequestId].list.unshift(comment);
          state.comments[buyRequestId].total += 1;
        }
      })
      .addCase(DELETE_BUY_REQUEST_COMMENT_SUCCESS, (state, action) => {
        Object.values(state.comments).forEach(c => {
          c.list = c.list.filter(item => item.id !== action.payload);
          c.total = Math.max(0, c.total - 1);
        });
      });
  }
});

export default buyRequestSlice.reducer; 