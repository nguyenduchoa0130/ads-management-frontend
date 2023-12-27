import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import { sharedReducer } from '@slices/shared.slice';

export const store = configureStore({
  reducer: {
    shared: sharedReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
