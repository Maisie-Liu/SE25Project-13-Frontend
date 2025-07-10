import { createSlice } from '@reduxjs/toolkit';
import { fetchUserPublicProfile } from '../actions/userPublicProfileActions';

const userPublicProfileSlice = createSlice({
  name: 'userPublicProfile',
  initialState: {
    loading: false,
    data: null,
    error: null,
  },
  reducers: {
    clearUserPublicProfile(state) {
      state.loading = false;
      state.data = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPublicProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPublicProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchUserPublicProfile.rejected, (state, action) => {
        state.loading = false;
        state.data = null;
        state.error = action.payload;
      });
  }
});

export const { clearUserPublicProfile } = userPublicProfileSlice.actions;
export default userPublicProfileSlice.reducer; 