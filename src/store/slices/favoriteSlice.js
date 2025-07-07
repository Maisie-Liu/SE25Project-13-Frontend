import { createSlice } from '@reduxjs/toolkit';
import { fetchFavorites, addFavorite, removeFavorite, checkIsFavorite, removeFavoriteByItemId } from '../actions/favoriteActions';

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
        if (action.payload) {
          state.favorites.unshift(action.payload);
          state.currentFavorite = action.payload;
        }
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
        const favoriteId = action.payload;
        if (favoriteId) {
          state.favorites = state.favorites.filter(favorite => favorite.id !== favoriteId);
          if (state.currentFavorite && state.currentFavorite.id === favoriteId) {
            state.currentFavorite = null;
          }
        }
        state.loading = false;
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 根据物品ID移除收藏
      .addCase(removeFavoriteByItemId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFavoriteByItemId.fulfilled, (state, action) => {
        const itemId = action.payload;
        if (itemId) {
          state.favorites = state.favorites.filter(favorite => {
            const favoriteItemId = favorite.item ? favorite.item.id : favorite.id;
            return favoriteItemId !== itemId;
          });
          if (state.currentFavorite) {
            const currentItemId = state.currentFavorite.item ? 
              state.currentFavorite.item.id : 
              state.currentFavorite.itemId || state.currentFavorite.id;
            
            if (currentItemId === itemId) {
              state.currentFavorite = null;
            }
          }
        }
        state.loading = false;
      })
      .addCase(removeFavoriteByItemId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 检查收藏状态
      .addCase(checkIsFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkIsFavorite.fulfilled, (state, action) => {
        console.log("checkIsFavorite.fulfilled - payload:", action.payload);
        state.currentFavorite = action.payload || null;
        state.loading = false;
      })
      .addCase(checkIsFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentFavorite = null;
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