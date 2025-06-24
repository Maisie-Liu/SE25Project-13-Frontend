import axios from 'axios';
import { store } from '../store';

// 创建axios实例
const instance = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth?.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 直接返回响应数据
    return response;
  },
  (error) => {
    if (error.response) {
      // 服务器返回错误
      if (error.response.status === 401) {
        // 未授权，可能是token过期
        // 此处可以触发登出操作
        store.dispatch({ type: 'auth/logout' });
      }
    }
    return Promise.reject(error);
  }
);

export default instance; 