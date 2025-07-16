import axios from 'axios';
import store from "../store";
import { logout } from '../store/actions/authActions';

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
    
    // 日志输出请求信息
    console.log('[Axios Request]', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });
    
    console.log('请求token:', token, config.url);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRedirecting = false; // 防止多次跳转

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 日志输出响应信息
    console.log('[Axios Response]', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    if (error.response) {
      const url = error.config?.url || '';
      const isLoginApi = url.includes('/auth/login');
      const isRegisterApi = url.includes('/auth/register');
      if ((error.response.status === 401 || error.response.status === 403) && !isLoginApi && !isRegisterApi) {
        if (!isRedirecting) {
          isRedirecting = true;
          store.dispatch(logout());
          localStorage.removeItem('token');
          window.location.href = '/login';
          setTimeout(() => { isRedirecting = false; }, 2000); // 2秒后允许再次跳转
        }
      }
      // 日志输出错误响应
      console.log('[Axios Error Response]', {
        url: error.config?.url,
        status: error.response.status,
        data: error.response.data
      });
    } else {
      // 日志输出网络错误
      console.log('[Axios Network Error]', error);
    }
    return Promise.reject(error);
  }
);

export default instance; 