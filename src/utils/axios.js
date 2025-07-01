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
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
      // 服务器返回错误
      if (error.response.status === 401) {
        // 未授权，可能是token过期
        // 触发登出操作
        store.dispatch(logout());
        console.log('Token已过期或无效，已自动登出');
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