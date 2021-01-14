import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store';
import {
  appLoadingCompleted,
  appLoadingStarted,
  getUserProfile,
  getUserTimezone,
  loginRequested,
} from './features/app/appSlice';
import {
  fetchBirthdayCalendarId,
  fetchBirthdays,
} from './features/birthdays/birthdaysSlice';

const initializeUser = async () => {
  store.dispatch(appLoadingStarted());
  await store.dispatch(loginRequested());
  await store.dispatch(getUserProfile());
  await store.dispatch(getUserTimezone());
  await store.dispatch(fetchBirthdayCalendarId());
  await store.dispatch(fetchBirthdays());
  store.dispatch(appLoadingCompleted());
};

initializeUser();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
