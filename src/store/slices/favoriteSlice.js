import { createSlice } from '@reduxjs/toolkit';
import { fetchFavorites, addFavorite, removeFavorite, checkIsFavorite } from '../actions/favoriteActions';

const initialState = {
  favorites: [],
  currentFavorite: null,
  loading: false,
  error: null,
  totalItems: 0,
  totalPages: 0,
  currentPage: 0
};

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavoriteError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 获取收藏列表
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.loading = false;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 添加收藏
      .addCase(addFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.favorites.unshift(action.payload);
        state.currentFavorite = action.payload;
        state.loading = false;
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 移除收藏
      .addCase(removeFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.favorites = state.favorites.filter(favorite => favorite.id !== action.payload);
        if (state.currentFavorite && state.currentFavorite.id === action.payload) {
          state.currentFavorite = null;
        }
        state.loading = false;
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 检查收藏状态
      .addCase(checkIsFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkIsFavorite.fulfilled, (state, action) => {
        state.currentFavorite = action.payload;
        state.loading = false;
      })
      .addCase(checkIsFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearFavoriteError } = favoriteSlice.actions;

// 选择器
export const selectFavorites = (state) => state.favorites.favorites;
export const selectCurrentFavorite = (state) => state.favorites.currentFavorite;
export const selectFavoriteLoading = (state) => state.favorites.loading;
export const selectFavoriteError = (state) => state.favorites.error;
export const selectFavoritePagination = (state) => ({
  total: state.favorites.totalItems,
  current: state.favorites.currentPage + 1, // 后端从0开始，前端从1开始
  pageSize: 10
});

export default favoriteSlice.reducer; 