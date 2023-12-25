import { createSlice } from '@reduxjs/toolkit';

interface SharedState {
  isLoading?: boolean;
}

const initialState: SharedState = {
  isLoading: false,
};

const sharedSlice = createSlice({
  name: 'shared',
  initialState,
  reducers: {
    showLoading: (state) => {
      state.isLoading = true;
    },
    hideLoading: (state) => {
      state.isLoading = false;
    },
  },
});
export const sharedReducer = sharedSlice.reducer;
export const { actions: sharedActions } = sharedSlice;
