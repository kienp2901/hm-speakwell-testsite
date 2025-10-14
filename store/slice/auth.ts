import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from '@/types';

const initialState: AuthState = {
  userToken: '',
  dataSignature: '',
  accessToken: '', // Bearer token from create-user API
  emsToken: '', // x-api-key from validate_token API
  emsRefreshToken: '', // x-api-key-refresh from validate_token API
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserToken(state, action: PayloadAction<string>) {
      state.userToken = action.payload;
    },
    setDataSignature(state, action: PayloadAction<string>) {
      state.dataSignature = action.payload;
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    setEmsToken(state, action: PayloadAction<string>) {
      state.emsToken = action.payload;
    },
    setEmsRefreshToken(state, action: PayloadAction<string>) {
      state.emsRefreshToken = action.payload;
    },
  },
});

export const { 
  setUserToken, 
  setDataSignature, 
  setAccessToken, 
  setEmsToken, 
  setEmsRefreshToken 
} = authSlice.actions;

