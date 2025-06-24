import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favorites: [],
  loading: false,
  error: null,
  pagination: {
    total: 0,
    current: 1,
    pageSize: 10
  }
};

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    setFavoriteLoading: (state, action) => {
      state.loading = action.payload;
    },
    setFavoriteError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearFavoriteError: (state) => {
      state.error = null;
    },
    setFavorites: (state, action) => {
      state.favorites = action.payload.favorites;
      state.pagination = {
        ...state.pagination,
        total: action.payload.total || action.payload.favorites.length,
        current: action.payload.current || state.pagination.current
      };
      state.loading = false;
    },
    addFavorite: (state, action) => {
      state.favorites = [action.payload, ...state.favorites];
      state.loading = false;
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(favorite => favorite.id !== action.payload);
      state.loading = false;
    }
  }
});

export const {
  setFavoriteLoading,
  setFavoriteError,
  clearFavoriteError,
  setFavorites,
  addFavorite,
  removeFavorite
} = favoriteSlice.actions;

// Selectors
export const selectFavorites = (state) => state.favorite.favorites;
export const selectFavoriteLoading = (state) => state.favorite.loading;
export const selectFavoriteError = (state) => state.favorite.error;
export const selectFavoritePagination = (state) => state.favorite.pagination;

export default favoriteSlice.reducer; 