import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: null,
  messages: [],
  commentMessages: [],
  favoriteMessages: [],
  orderMessages: [],
  chatMessages: [],
  allUserChatMessages: [], // 新增：用户作为发送者或接收者的所有聊天消息
  unreadCount: 0,
  unreadCountByType: {
    COMMENT: 0,
    FAVORITE: 0,
    ORDER: 0,
    CHAT: 0
  },
  pagination: {
    page: 0,
    size: 10,
    totalElements: 0
  }
};

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    // 获取所有消息
    fetchMessagesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMessagesSuccess: (state, action) => {
      state.loading = false;
      state.messages = action.payload.content;
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
        totalElements: action.payload.totalElements
      };
      state.totalCount = action.payload.totalElements;
    },
    fetchMessagesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // 获取评论消息
    fetchCommentMessagesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCommentMessagesSuccess: (state, action) => {
      state.loading = false;
      state.commentMessages = action.payload.content;
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
        totalElements: action.payload.totalElements
      };
    },
    fetchCommentMessagesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // 获取收藏消息
    fetchFavoriteMessagesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchFavoriteMessagesSuccess: (state, action) => {
      state.loading = false;
      state.favoriteMessages = action.payload.content;
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
        totalElements: action.payload.totalElements
      };
    },
    fetchFavoriteMessagesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // 获取订单消息
    fetchOrderMessagesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchOrderMessagesSuccess: (state, action) => {
      state.loading = false;
      state.orderMessages = action.payload.content;
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
        totalElements: action.payload.totalElements
      };
    },
    fetchOrderMessagesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // 获取聊天消息
    fetchChatMessagesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchChatMessagesSuccess: (state, action) => {
      state.loading = false;
      state.chatMessages = action.payload.content;
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
        totalElements: action.payload.totalElements
      };
    },
    fetchChatMessagesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // 获取用户作为发送者或接收者的所有聊天消息
    fetchAllUserChatMessagesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAllUserChatMessagesSuccess: (state, action) => {
      state.loading = false;
      state.allUserChatMessages = action.payload.content;
      state.pagination = {
        page: action.payload.page,
        size: action.payload.size,
        totalElements: action.payload.totalElements
      };
    },
    fetchAllUserChatMessagesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // 标记消息为已读
    markMessageReadRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    markMessageReadSuccess: (state, action) => {
      state.loading = false;
      const { messageId } = action.payload;
      
      // 更新所有消息列表中的消息状态
      state.messages = state.messages.map(message => 
        message.id === messageId ? { ...message, read: true } : message
      );
      
      // 更新评论消息列表中的消息状态
      state.commentMessages = state.commentMessages.map(message => 
        message.id === messageId ? { ...message, read: true } : message
      );
      
      // 更新收藏消息列表中的消息状态
      state.favoriteMessages = state.favoriteMessages.map(message => 
        message.id === messageId ? { ...message, read: true } : message
      );
      
      // 更新订单消息列表中的消息状态
      state.orderMessages = state.orderMessages.map(message => 
        message.id === messageId ? { ...message, read: true } : message
      );
      
      // 更新聊天消息列表中的消息状态
      state.chatMessages = state.chatMessages.map(message => 
        message.id === messageId ? { ...message, read: true } : message
      );
      
      // 更新未读消息数量
      if (state.unreadCount > 0) {
        state.unreadCount -= 1;
      }
    },
    markMessageReadFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // 标记所有消息为已读
    markAllMessagesReadRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    markAllMessagesReadSuccess: (state) => {
      state.loading = false;
      
      // 更新所有消息列表中的消息状态
      state.messages = state.messages.map(message => ({ ...message, read: true }));
      state.commentMessages = state.commentMessages.map(message => ({ ...message, read: true }));
      state.favoriteMessages = state.favoriteMessages.map(message => ({ ...message, read: true }));
      state.orderMessages = state.orderMessages.map(message => ({ ...message, read: true }));
      state.chatMessages = state.chatMessages.map(message => ({ ...message, read: true }));
      
      // 更新未读消息数量
      state.unreadCount = 0;
      state.unreadCommentCount = 0;
      state.unreadFavoriteCount = 0;
      state.unreadOrderCount = 0;
      state.unreadChatCount = 0;
    },
    markAllMessagesReadFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // 标记特定类型的所有消息为已读
    markAllMessagesByTypeReadRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    markAllMessagesByTypeReadSuccess: (state, action) => {
      state.loading = false;
      const { messageType } = action.payload;
      
      // 根据消息类型更新相应的消息列表
      switch (messageType) {
        case 'COMMENT':
          state.commentMessages = state.commentMessages.map(message => ({ ...message, read: true }));
          state.unreadCommentCount = 0;
          break;
        case 'FAVORITE':
          state.favoriteMessages = state.favoriteMessages.map(message => ({ ...message, read: true }));
          state.unreadFavoriteCount = 0;
          break;
        case 'ORDER':
          state.orderMessages = state.orderMessages.map(message => ({ ...message, read: true }));
          state.unreadOrderCount = 0;
          break;
        case 'CHAT':
          state.chatMessages = state.chatMessages.map(message => ({ ...message, read: true }));
          state.unreadChatCount = 0;
          break;
        default:
          break;
      }
      
      // 更新所有消息列表中相应类型的消息状态
      state.messages = state.messages.map(message => 
        message.messageType === messageType ? { ...message, read: true } : message
      );
      
      // 重新计算总未读消息数
      state.unreadCount = state.unreadCommentCount + state.unreadFavoriteCount + 
                          state.unreadOrderCount + state.unreadChatCount;
    },
    markAllMessagesByTypeReadFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // 获取未读消息数量
    fetchUnreadMessagesCountRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUnreadMessagesCountSuccess: (state, action) => {
      state.loading = false;
      state.unreadCount = action.payload;
    },
    fetchUnreadMessagesCountFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // 获取特定类型的未读消息数量
    fetchUnreadMessagesByTypeCountRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUnreadMessagesByTypeCountSuccess: (state, action) => {
      state.loading = false;
      const { messageType, count } = action.payload;
      
      // 根据消息类型更新相应的未读消息数量
      switch (messageType) {
        case 'COMMENT':
          state.unreadCommentCount = count;
          break;
        case 'FAVORITE':
          state.unreadFavoriteCount = count;
          break;
        case 'ORDER':
          state.unreadOrderCount = count;
          break;
        case 'CHAT':
          state.unreadChatCount = count;
          break;
        default:
          break;
      }
    },
    fetchUnreadMessagesByTypeCountFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // 获取所有消息
      .addCase('FETCH_MESSAGES_REQUEST', (state) => {
        state.loading = true;
      })
      .addCase('FETCH_MESSAGES_SUCCESS', (state, action) => {
        state.loading = false;
        state.messages = action.payload.data?.list || [];
        state.error = null;
      })
      .addCase('FETCH_MESSAGES_FAILURE', (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 获取评论消息
      .addCase('FETCH_COMMENT_MESSAGES_REQUEST', (state) => {
        state.loading = true;
      })
      .addCase('FETCH_COMMENT_MESSAGES_SUCCESS', (state, action) => {
        state.loading = false;
        state.commentMessages = action.payload.data?.list || [];
        state.error = null;
      })
      .addCase('FETCH_COMMENT_MESSAGES_FAILURE', (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 获取收藏消息
      .addCase('FETCH_FAVORITE_MESSAGES_REQUEST', (state) => {
        state.loading = true;
      })
      .addCase('FETCH_FAVORITE_MESSAGES_SUCCESS', (state, action) => {
        state.loading = false;
        state.favoriteMessages = action.payload.data?.list || [];
        state.error = null;
      })
      .addCase('FETCH_FAVORITE_MESSAGES_FAILURE', (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 获取订单消息
      .addCase('FETCH_ORDER_MESSAGES_REQUEST', (state) => {
        state.loading = true;
      })
      .addCase('FETCH_ORDER_MESSAGES_SUCCESS', (state, action) => {
        state.loading = false;
        state.orderMessages = action.payload.data?.list || [];
        state.error = null;
      })
      .addCase('FETCH_ORDER_MESSAGES_FAILURE', (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 获取聊天消息
      .addCase('FETCH_CHAT_MESSAGES_REQUEST', (state) => {
        state.loading = true;
      })
      .addCase('FETCH_CHAT_MESSAGES_SUCCESS', (state, action) => {
        state.loading = false;
        state.chatMessages = action.payload.data?.list || [];
        state.error = null;
      })
      .addCase('FETCH_CHAT_MESSAGES_FAILURE', (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 获取用户作为发送者或接收者的所有聊天消息
      .addCase('FETCH_ALL_USER_CHAT_MESSAGES_REQUEST', (state) => {
        state.loading = true;
      })
      .addCase('FETCH_ALL_USER_CHAT_MESSAGES_SUCCESS', (state, action) => {
        state.loading = false;
        state.allUserChatMessages = action.payload.data?.list || [];
        state.error = null;
      })
      .addCase('FETCH_ALL_USER_CHAT_MESSAGES_FAILURE', (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 标记消息为已读
      .addCase('MARK_MESSAGE_READ_REQUEST', (state) => {
        state.loading = true;
      })
      .addCase('MARK_MESSAGE_READ_SUCCESS', (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase('MARK_MESSAGE_READ_FAILURE', (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 标记所有消息为已读
      .addCase('MARK_ALL_MESSAGES_READ_REQUEST', (state) => {
        state.loading = true;
      })
      .addCase('MARK_ALL_MESSAGES_READ_SUCCESS', (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase('MARK_ALL_MESSAGES_READ_FAILURE', (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 标记特定类型的所有消息为已读
      .addCase('MARK_ALL_MESSAGES_BY_TYPE_READ_REQUEST', (state) => {
        state.loading = true;
      })
      .addCase('MARK_ALL_MESSAGES_BY_TYPE_READ_SUCCESS', (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase('MARK_ALL_MESSAGES_BY_TYPE_READ_FAILURE', (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 获取未读消息数量
      .addCase('FETCH_UNREAD_MESSAGES_COUNT_REQUEST', (state) => {
        state.loading = true;
      })
      .addCase('FETCH_UNREAD_MESSAGES_COUNT_SUCCESS', (state, action) => {
        state.loading = false;
        state.unreadCount = action.payload.data || 0;
        state.error = null;
      })
      .addCase('FETCH_UNREAD_MESSAGES_COUNT_FAILURE', (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 获取特定类型的未读消息数量
      .addCase('FETCH_UNREAD_MESSAGES_BY_TYPE_COUNT_REQUEST', (state) => {
        state.loading = true;
      })
      .addCase('FETCH_UNREAD_MESSAGES_BY_TYPE_COUNT_SUCCESS', (state, action) => {
        state.loading = false;
        const { messageType, data } = action.payload;
        if (messageType && state.unreadCountByType.hasOwnProperty(messageType)) {
          state.unreadCountByType[messageType] = data || 0;
        }
        state.error = null;
      })
      .addCase('FETCH_UNREAD_MESSAGES_BY_TYPE_COUNT_FAILURE', (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  fetchMessagesRequest,
  fetchMessagesSuccess,
  fetchMessagesFailure,
  fetchCommentMessagesRequest,
  fetchCommentMessagesSuccess,
  fetchCommentMessagesFailure,
  fetchFavoriteMessagesRequest,
  fetchFavoriteMessagesSuccess,
  fetchFavoriteMessagesFailure,
  fetchOrderMessagesRequest,
  fetchOrderMessagesSuccess,
  fetchOrderMessagesFailure,
  fetchChatMessagesRequest,
  fetchChatMessagesSuccess,
  fetchChatMessagesFailure,
  markMessageReadRequest,
  markMessageReadSuccess,
  markMessageReadFailure,
  markAllMessagesReadRequest,
  markAllMessagesReadSuccess,
  markAllMessagesReadFailure,
  markAllMessagesByTypeReadRequest,
  markAllMessagesByTypeReadSuccess,
  markAllMessagesByTypeReadFailure,
  fetchUnreadMessagesCountRequest,
  fetchUnreadMessagesCountSuccess,
  fetchUnreadMessagesCountFailure,
  fetchUnreadMessagesByTypeCountRequest,
  fetchUnreadMessagesByTypeCountSuccess,
  fetchUnreadMessagesByTypeCountFailure,
  fetchAllUserChatMessagesRequest,
  fetchAllUserChatMessagesSuccess,
  fetchAllUserChatMessagesFailure
} = messageSlice.actions;

export const selectMessages = state => state.message.messages;
export const selectCommentMessages = state => state.message.commentMessages;
export const selectFavoriteMessages = state => state.message.favoriteMessages;
export const selectOrderMessages = state => state.message.orderMessages;
export const selectChatMessages = state => state.message.chatMessages;
export const selectAllUserChatMessages = state => state.message.allUserChatMessages;
export const selectUnreadCount = state => state.message.unreadCount;
export const selectUnreadCommentCount = state => state.message.unreadCommentCount;
export const selectUnreadFavoriteCount = state => state.message.unreadFavoriteCount;
export const selectUnreadOrderCount = state => state.message.unreadOrderCount;
export const selectUnreadChatCount = state => state.message.unreadChatCount;
export const selectMessageLoading = state => state.message.loading;
export const selectMessageError = state => state.message.error;
export const selectMessagePagination = state => state.message.pagination;

export default messageSlice.reducer; 