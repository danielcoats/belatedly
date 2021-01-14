import { User } from '@microsoft/microsoft-graph-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getProfileTokenPopup, login, logout } from '../../services/auth';
import { getMailboxSettings, getUserDetails } from '../../services/graph';
import { AppThunk, RootState } from '../../store';

interface AppState {
  isLoggedIn: boolean;
  error: string;
  user: User | null;
  timezone: string;
  loading: boolean;
}

const initialState: AppState = {
  isLoggedIn: false,
  error: '',
  user: null,
  timezone: '',
  loading: true,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    userLoggedIn: (state) => {
      state.isLoggedIn = true;
    },
    userLoggedOut: (state) => {
      state.isLoggedIn = true;
      state.error = '';
    },
    loginFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    getUserProfileFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    userProfileSet: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    userTimezoneSet: (state, action: PayloadAction<string>) => {
      state.timezone = action.payload;
    },
    httpRequestFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    appLoadingStarted: (state) => {
      state.loading = true;
    },
    appLoadingCompleted: (state) => {
      state.loading = false;
    },
  },
});

export const {
  userLoggedIn,
  userLoggedOut,
  userProfileSet,
  userTimezoneSet: timezoneSet,
  httpRequestFailed,
  appLoadingStarted,
  appLoadingCompleted,
} = appSlice.actions;

export default appSlice.reducer;

export const loginRequested = (): AppThunk => async (dispatch) => {
  try {
    await login();
    dispatch(userLoggedIn());
  } catch (err) {
    dispatch(httpRequestFailed(err.toString()));
  }
};

export const logoutRequested = (): AppThunk => async (dispatch) => {
  try {
    await logout();
    dispatch(userLoggedOut());
  } catch (err) {
    dispatch(httpRequestFailed(err.toString()));
  }
};

export const getUserProfile = (): AppThunk => async (dispatch) => {
  try {
    const token = await getProfileTokenPopup();
    const user = await getUserDetails(token);
    dispatch(userProfileSet(user));
  } catch (err) {
    dispatch(httpRequestFailed(err.toString()));
  }
};

export const getUserTimezone = (): AppThunk => async (dispatch) => {
  try {
    const token = await getProfileTokenPopup();
    const settings = await getMailboxSettings(token);
    if (settings.timeZone) dispatch(timezoneSet(settings.timeZone));
  } catch (err) {
    dispatch(httpRequestFailed(err.toString()));
  }
};

export const selectTimezone = (state: RootState) => state.app.timezone;
