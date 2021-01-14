import { combineReducers } from 'redux';
import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';

import birthdaysSlice from './features/birthdays/birthdaysSlice';
import appSlice from './features/app/appSlice';

export const rootReducer = combineReducers({
  birthdays: birthdaysSlice,
  app: appSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

export default configureStore({
  reducer: rootReducer,
});

export type AppThunk = ThunkAction<
  Promise<void>,
  RootState,
  unknown,
  Action<string>
>;
