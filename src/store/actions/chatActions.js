import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// 获取用户的所有聊天会话
export const fetchUserChats = createAsyncThunk(
  'chat/fetchUserChats',
  async ({ page = 0, size = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/chats?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '获取聊天会话失败');
    }
  }
);

// 获取特定聊天会话的消息
export const fetchChatMessages = createAsyncThunk(
  'chat/fetchChatMessages',
  async ({ chatId, page = 0, size = 20 } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/chats/${chatId}/messages?page=${page}&size=${size}`);
      return { chatId, messages: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '获取聊天消息失败');
    }
  }
);

// 发送聊天消息
export const sendChatMessage = createAsyncThunk(
  'chat/sendChatMessage',
  async ({ chatId, content }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/chats/${chatId}/messages`, { content });
      return { chatId, message: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '发送消息失败');
    }
  }
);

// 创建新的聊天会话
export const createChat = createAsyncThunk(
  'chat/createChat',
  async ({ otherUserId, itemId, initialMessage }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/chats', {
        otherUserId,
        itemId,
        initialMessage
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '创建聊天会话失败');
    }
  }
);

// 标记聊天消息为已读
export const markChatMessagesAsRead = createAsyncThunk(
  'chat/markChatMessagesAsRead',
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/chats/${chatId}/read`);
      return { chatId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '标记消息已读失败');
    }
  }
);

// 获取聊天会话未读消息数
export const fetchChatUnreadCount = createAsyncThunk(
  'chat/fetchChatUnreadCount',
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/chats/${chatId}/unread`);
      return { chatId, unreadCount: response.data.unreadCount };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '获取未读消息数量失败');
    }
  }
);

// 获取用户所有聊天会话的未读消息总数
export const fetchTotalUnreadCount = createAsyncThunk(
  'chat/fetchTotalUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/chats/unread/total');
      return response.data.totalUnreadCount;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '获取未读消息总数失败');
    }
  }
); 