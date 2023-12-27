import { createSlice } from '@reduxjs/toolkit';

interface SharedState {
  isLoading?: boolean;
  currentUser?: any;
}

const initialState: SharedState = {
  isLoading: false,
};

const sharedSlice = createSlice({
  name: 'shared',
  initialState,
  reducers: {
    setCurrentUser: (state, payload) => {},
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
