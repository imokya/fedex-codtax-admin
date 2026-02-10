import axios from 'axios';
import { goLogin, showError, clearLoginInfo, showSuccess } from './methods';
import { API_Status } from '@/constants/api';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  // withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || '';
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    if (response.status === 204) {
      return Promise.reject('noData');
    }
    return response.data;
  },
  (error) => {
    const status = error?.response?.data?.status;
    const message = error?.response?.data?.message;
    const code = error?.code;

    // if (code === 'ERR_NETWORK' || code === 'ERR_BAD_RESPONSE') {
    //   clearLoginInfo();
    //   showError('服务出错');
    //   goLogin();
    // }

    if (status === API_Status.TOKEN_INVALID) {
      clearLoginInfo();
      showError('token已过期');
      goLogin();
    } else if (status === API_Status.UNAUTHORIZED) {
      showError('未授权');
      goLogin();
    } else if (status === API_Status.FAILED) {
      showError(message || '接口出错');
    }
    return Promise.reject(error);
  }
);

export default instance;
