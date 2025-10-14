import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { store } from '@/store';
import { setDataSignature } from '@/store/slice/auth';
import { getRuntimeTenantCode } from './tenantDomains';
import { Notify } from '@/ultils/notify';

interface BaseConfig {
  baseURL?: string;
  headers: {
    Accept: string;
    'Content-Type': string;
    // 'Access-Control-Allow-Origin': string;
    // 'Access-Control-Allow-Credentials': string;
  };
}

export const createService = (baseURL?: string, contentType = 'application/json'): AxiosInstance => {
  return interceptAuth(baseConfig(baseURL, contentType));
};

const baseConfig = (baseURL?: string, contentType = 'application/json'): BaseConfig => {
  return {
    baseURL: baseURL ?? process.env.BASE_URL,
    headers: {
      Accept: 'application/json, text/*, */*',
      'Content-Type': contentType,
      // 'Access-Control-Allow-Origin': '*',
      // 'Access-Control-Allow-Credentials': 'true',
    },
  };
};

const interceptAuth = (config: BaseConfig): AxiosInstance => {
  const instance = axios.create(config);

  instance.interceptors.request.use((cf: AxiosRequestConfig) => {
    const dataSignature = store.getState().auth.dataSignature;
    const accessToken = store.getState().auth.accessToken;
    const emsToken = store.getState().auth.emsToken;
    const tenantCode = getRuntimeTenantCode();

    if (cf?.headers) {
      // Add x-api-key from environment or EMS token
      if (emsToken && emsToken !== '') {
        cf.headers['x-api-key'] = emsToken;
        console.log('Adding EMS token as x-api-key');
      } else if (process.env.API_KEY_EXAM) {
        cf.headers['x-api-key'] = process.env.API_KEY_EXAM;
      }
      
      // Add Bearer token if available (from create-user API)
      if (accessToken && accessToken !== '') {
        cf.headers['Authorization'] = `Bearer ${accessToken}`;
        console.log('Adding Bearer token to request');
      }
      
      if (dataSignature !== '') {
        cf.headers['x-signature'] = dataSignature;
        cf.headers['x-href'] = 'https://speakwell.hocmai.vn/';
      }
      
      // Add tenant code if available
      if (tenantCode) {
        cf.headers['x-tenant-code'] = tenantCode;
        console.log('Adding tenant code to request:', tenantCode);
      }
    }
    cf.params = cf.params || {};
    return cf;
  });

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      if (response.status === 401) {
        store.dispatch(setDataSignature(''));
        // store.dispatch(removeDataUser());
        Notify({ type: 'error', message: 'Có lỗi xảy ra vui lòng thử lại!' });
      }
      return response;
    },
    (error: any) => {
      if (error?.response?.status === 401) {
        store.dispatch(setDataSignature(''));
        // store.dispatch(removeDataUser());
        Notify({ type: 'error', message: 'Có lỗi xảy ra vui lòng thử lại!' });
      }
      return Promise.reject(error);
    },
  );
  
  return instance;
};

