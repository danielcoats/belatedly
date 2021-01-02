import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';

import birthdaysSlice from '../features/birthdays/birthdaysSlice';

export const rootReducer = combineReducers({ birthdays: birthdaysSlice });

export type RootState = ReturnType<typeof rootReducer>;

export default configureStore({
  reducer: rootReducer,
});
