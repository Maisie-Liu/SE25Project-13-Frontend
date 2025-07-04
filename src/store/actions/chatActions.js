import axios from '../../utils/axios';

// 获取用户的所有聊天会话
export const fetchUserChats = (page = 0, size = 10) => async (dispatch) => {
  dispatch({ type: 'FETCH_USER_CHATS_REQUEST' });
  
  try {
    const response = await axios.get(`/api/chats?page=${page}&size=${size}`);
    dispatch({
      type: 'FETCH_USER_CHATS_SUCCESS',
      payload: response.data
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: 'FETCH_USER_CHATS_FAILURE',
      payload: error.response?.data?.message || '获取聊天会话失败'
    });
    throw error;
  }
};

// 获取特定聊天会话的消息
export const fetchChatMessages = (chatId, page = 0, size = 20) => async (dispatch) => {
  dispatch({ type: 'FETCH_CHAT_MESSAGES_REQUEST' });
  
  try {
    const response = await axios.get(`/api/chats/${chatId}/messages?page=${page}&size=${size}`);
    dispatch({
      type: 'FETCH_CHAT_MESSAGES_SUCCESS',
      payload: {
        chatId,
        messages: response.data
      }
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: 'FETCH_CHAT_MESSAGES_FAILURE',
      payload: error.response?.data?.message || '获取聊天消息失败'
    });
    throw error;
  }
};

// 发送聊天消息
export const sendChatMessage = (chatId, content) => async (dispatch) => {
  dispatch({ type: 'SEND_CHAT_MESSAGE_REQUEST' });
  
  try {
    const response = await axios.post(`/api/chats/${chatId}/messages`, { content });
    dispatch({
      type: 'SEND_CHAT_MESSAGE_SUCCESS',
      payload: {
        chatId,
        message: response.data
      }
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: 'SEND_CHAT_MESSAGE_FAILURE',
      payload: error.response?.data?.message || '发送消息失败'
    });
    throw error;
  }
};

// 创建新的聊天会话
export const createChat = (otherUserId, itemId, initialMessage) => async (dispatch) => {
  dispatch({ type: 'CREATE_CHAT_REQUEST' });
  
  try {
    const response = await axios.post('/api/chats', {
      otherUserId,
      itemId,
      initialMessage
    });
    dispatch({
      type: 'CREATE_CHAT_SUCCESS',
      payload: response.data
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: 'CREATE_CHAT_FAILURE',
      payload: error.response?.data?.message || '创建聊天会话失败'
    });
    throw error;
  }
};

// 标记聊天消息为已读
export const markChatMessagesAsRead = (chatId) => async (dispatch) => {
  dispatch({ type: 'MARK_CHAT_MESSAGES_READ_REQUEST' });
  
  try {
    const response = await axios.put(`/api/chats/${chatId}/read`);
    dispatch({
      type: 'MARK_CHAT_MESSAGES_READ_SUCCESS',
      payload: { chatId }
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: 'MARK_CHAT_MESSAGES_READ_FAILURE',
      payload: error.response?.data?.message || '标记消息已读失败'
    });
    throw error;
  }
};

// 获取聊天会话未读消息数
export const fetchChatUnreadCount = (chatId) => async (dispatch) => {
  dispatch({ type: 'FETCH_CHAT_UNREAD_COUNT_REQUEST' });
  
  try {
    const response = await axios.get(`/api/chats/${chatId}/unread`);
    dispatch({
      type: 'FETCH_CHAT_UNREAD_COUNT_SUCCESS',
      payload: {
        chatId,
        unreadCount: response.data.unreadCount
      }
    });
    return response.data.unreadCount;
  } catch (error) {
    dispatch({
      type: 'FETCH_CHAT_UNREAD_COUNT_FAILURE',
      payload: error.response?.data?.message || '获取未读消息数量失败'
    });
    throw error;
  }
};

// 获取用户所有聊天会话的未读消息总数
export const fetchTotalUnreadCount = () => async (dispatch) => {
  dispatch({ type: 'FETCH_TOTAL_UNREAD_COUNT_REQUEST' });
  
  try {
    const response = await axios.get('/api/chats/unread/total');
    dispatch({
      type: 'FETCH_TOTAL_UNREAD_COUNT_SUCCESS',
      payload: response.data.totalUnreadCount
    });
    return response.data.totalUnreadCount;
  } catch (error) {
    dispatch({
      type: 'FETCH_TOTAL_UNREAD_COUNT_FAILURE',
      payload: error.response?.data?.message || '获取未读消息总数失败'
    });
    throw error;
  }
}; 