import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: null,
  chats: [],
  currentChat: null,
  messages: {},
  totalUnreadCount: 0,
  pagination: {
    page: 0,
    size: 10,
    totalElements: 0
  }
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // 获取用户的所有聊天会话
    fetchUserChatsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUserChatsSuccess: (state, action) => {
      state.loading = false;
      state.chats = action.payload.content;
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
        totalElements: action.payload.totalElements
      };
      
      // 计算总未读消息数
      let totalUnread = 0;
      state.chats.forEach(chat => {
        totalUnread += chat.unreadCount || 0;
      });
      state.totalUnreadCount = totalUnread;
    },
    fetchUserChatsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // 获取特定聊天会话的消息
    fetchChatMessagesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchChatMessagesSuccess: (state, action) => {
      state.loading = false;
      const { chatId, messages } = action.payload;
      
      // 保存消息到对应的聊天会话
      state.messages[chatId] = messages.content;
      
      // 更新聊天会话的未读消息数
      state.chats = state.chats.map(chat => {
        if (chat.id === chatId) {
          return { ...chat, unreadCount: 0 };
        }
        return chat;
      });
      
      // 重新计算总未读消息数
      let totalUnread = 0;
      state.chats.forEach(chat => {
        totalUnread += chat.unreadCount || 0;
      });
      state.totalUnreadCount = totalUnread;
    },
    fetchChatMessagesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // 发送聊天消息
    sendChatMessageRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    sendChatMessageSuccess: (state, action) => {
      state.loading = false;
      const { chatId, message } = action.payload;
      
      // 将新消息添加到对应的聊天会话
      if (state.messages[chatId]) {
        state.messages[chatId] = [message, ...state.messages[chatId]];
      } else {
        state.messages[chatId] = [message];
      }
      
      // 更新聊天会话的最后一条消息
      state.chats = state.chats.map(chat => {
        if (chat.id === chatId) {
          return { 
            ...chat, 
            lastMessage: message.content,
            updatedAt: message.createdAt
          };
        }
        return chat;
      });
    },
    sendChatMessageFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // 创建新的聊天会话
    createChatRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createChatSuccess: (state, action) => {
      state.loading = false;
      state.currentChat = action.payload;
      
      // 检查是否已存在该聊天会话
      const existingChatIndex = state.chats.findIndex(chat => chat.id === action.payload.id);
      
      if (existingChatIndex === -1) {
        // 如果不存在，添加到聊天列表
        state.chats = [action.payload, ...state.chats];
      } else {
        // 如果已存在，更新该聊天会话
        state.chats[existingChatIndex] = action.payload;
      }
    },
    createChatFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // 标记聊天消息为已读
    markChatMessagesReadRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    markChatMessagesReadSuccess: (state, action) => {
      state.loading = false;
      const { chatId } = action.payload;
      
      // 更新聊天会话的未读消息数
      state.chats = state.chats.map(chat => {
        if (chat.id === chatId) {
          return { ...chat, unreadCount: 0 };
        }
        return chat;
      });
      
      // 重新计算总未读消息数
      let totalUnread = 0;
      state.chats.forEach(chat => {
        totalUnread += chat.unreadCount || 0;
      });
      state.totalUnreadCount = totalUnread;
    },
    markChatMessagesReadFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // 获取聊天会话未读消息数
    fetchChatUnreadCountRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchChatUnreadCountSuccess: (state, action) => {
      state.loading = false;
      const { chatId, unreadCount } = action.payload;
      
      // 更新聊天会话的未读消息数
      state.chats = state.chats.map(chat => {
        if (chat.id === chatId) {
          return { ...chat, unreadCount };
        }
        return chat;
      });
      
      // 重新计算总未读消息数
      let totalUnread = 0;
      state.chats.forEach(chat => {
        totalUnread += chat.unreadCount || 0;
      });
      state.totalUnreadCount = totalUnread;
    },
    fetchChatUnreadCountFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // 获取用户所有聊天会话的未读消息总数
    fetchTotalUnreadCountRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTotalUnreadCountSuccess: (state, action) => {
      state.loading = false;
      state.totalUnreadCount = action.payload;
    },
    fetchTotalUnreadCountFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // 设置当前聊天会话
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    
    // 清空聊天状态
    clearChatState: (state) => {
      return initialState;
    }
  }
});

export const {
  fetchUserChatsRequest,
  fetchUserChatsSuccess,
  fetchUserChatsFailure,
  fetchChatMessagesRequest,
  fetchChatMessagesSuccess,
  fetchChatMessagesFailure,
  sendChatMessageRequest,
  sendChatMessageSuccess,
  sendChatMessageFailure,
  createChatRequest,
  createChatSuccess,
  createChatFailure,
  markChatMessagesReadRequest,
  markChatMessagesReadSuccess,
  markChatMessagesReadFailure,
  fetchChatUnreadCountRequest,
  fetchChatUnreadCountSuccess,
  fetchChatUnreadCountFailure,
  fetchTotalUnreadCountRequest,
  fetchTotalUnreadCountSuccess,
  fetchTotalUnreadCountFailure,
  setCurrentChat,
  clearChatState
} = chatSlice.actions;

export const selectChats = state => state.chat.chats;
export const selectCurrentChat = state => state.chat.currentChat;
export const selectChatMessages = (state, chatId) => state.chat.messages[chatId] || [];
export const selectTotalUnreadCount = state => state.chat.totalUnreadCount;
export const selectChatLoading = state => state.chat.loading;
export const selectChatError = state => state.chat.error;
export const selectChatPagination = state => state.chat.pagination;

export default chatSlice.reducer; 