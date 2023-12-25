import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'app/store';

const selectorSharedFeature = (state: RootState) => state.shared;
export const selectIsLoading = createSelector(selectorSharedFeature, (shared) => shared.isLoading);
