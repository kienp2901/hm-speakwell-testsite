import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

import { authSlice } from './slice/auth';
import { examInfoSlice } from './slice/examInfo';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['examInfo'],
};

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  examInfo: examInfoSlice.reducer,
});

const pReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: pReducer,
  middleware: [thunk],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);

