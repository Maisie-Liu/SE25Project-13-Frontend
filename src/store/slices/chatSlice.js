import { createSlice } from '@reduxjs/toolkit';
import {
  fetchUserChats,
  fetchChatMessages,
  sendChatMessage,
  createChat,
  markChatMessagesAsRead,
  fetchChatUnreadCount,
  fetchTotalUnreadCount
} from '../actions/chatActions';

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
    // 设置当前聊天会话
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    
    // 清空聊天状态
    clearChatState: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      // 获取用户的所有聊天会话
      .addCase(fetchUserChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload.content || [];
        state.pagination = {
          page: action.payload.page || 0,
          size: action.payload.size || 10,
          totalElements: action.payload.totalElements || 0
        };
        
        // 计算总未读消息数
        let totalUnread = 0;
        state.chats.forEach(chat => {
          totalUnread += chat.unreadCount || 0;
        });
        state.totalUnreadCount = totalUnread;
      })
      .addCase(fetchUserChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 获取特定聊天会话的消息
      .addCase(fetchChatMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        state.loading = false;
        const { chatId, messages } = action.payload;
        
        // 保存消息到对应的聊天会话
        state.messages[chatId] = messages.content || [];
        
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
      })
      .addCase(fetchChatMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 发送聊天消息
      .addCase(sendChatMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.loading = false;
        const { chatId, message } = action.payload;
        
        // 将新消息添加到对应的聊天会话
        if (state.messages[chatId]) {
          state.messages[chatId] = [...state.messages[chatId], message];
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
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 创建新的聊天会话
      .addCase(createChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChat.fulfilled, (state, action) => {
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
      })
      .addCase(createChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 标记聊天消息为已读
      .addCase(markChatMessagesAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markChatMessagesAsRead.fulfilled, (state, action) => {
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
      })
      .addCase(markChatMessagesAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 获取聊天会话未读消息数
      .addCase(fetchChatUnreadCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatUnreadCount.fulfilled, (state, action) => {
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
      })
      .addCase(fetchChatUnreadCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 获取用户所有聊天会话的未读消息总数
      .addCase(fetchTotalUnreadCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalUnreadCount.fulfilled, (state, action) => {
        state.loading = false;
        state.totalUnreadCount = action.payload;
      })
      .addCase(fetchTotalUnreadCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setCurrentChat,
  clearChatState
} = chatSlice.actions;

export const selectChats = state => state.chat.chats || [];
export const selectCurrentChat = state => state.chat.currentChat;
export const selectChatMessages = (state, chatId) => state.chat.messages[chatId] || [];
export const selectTotalUnreadCount = state => state.chat.totalUnreadCount;
export const selectChatLoading = state => state.chat.loading;
export const selectChatError = state => state.chat.error;

export default chatSlice.reducer; 