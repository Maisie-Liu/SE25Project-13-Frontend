import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [],
  loading: false,
  error: null
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategoryLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCategoryError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearCategoryError: (state) => {
      state.error = null;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
      state.loading = false;
    }
  }
});

export const {
  setCategoryLoading,
  setCategoryError,
  clearCategoryError,
  setCategories
} = categorySlice.actions;

// Selectors
export const selectCategories = (state) => state.category.categories;
export const selectCategoryLoading = (state) => state.category.loading;
export const selectCategoryError = (state) => state.category.error;

export default categorySlice.reducer; 