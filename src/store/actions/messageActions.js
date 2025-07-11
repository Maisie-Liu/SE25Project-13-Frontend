import axios from '../../utils/axios';

// 获取所有消息
export const fetchAllMessages = (page = 0, size = 10) => async (dispatch) => {
  dispatch({ type: 'FETCH_MESSAGES_REQUEST' });
  
  try {
    const response = await axios.get(`/messages?page=${page}&size=${size}`);
    dispatch({
      type: 'FETCH_MESSAGES_SUCCESS',
      payload: response.data
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: 'FETCH_MESSAGES_FAILURE',
      payload: error.response?.data?.message || '获取消息失败'
    });
    throw error;
  }
};

// 获取评论消息
export const fetchCommentMessages = (page = 0, size = 10) => async (dispatch) => {
  dispatch({ type: 'FETCH_COMMENT_MESSAGES_REQUEST' });
  
  try {
    const response = await axios.get(`/messages/comments?page=${page}&size=${size}`);
    dispatch({
      type: 'FETCH_COMMENT_MESSAGES_SUCCESS',
      payload: response.data
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: 'FETCH_COMMENT_MESSAGES_FAILURE',
      payload: error.response?.data?.message || '获取评论消息失败'
    });
    throw error;
  }
};

// 获取收藏消息
export const fetchFavoriteMessages = (page = 0, size = 10) => async (dispatch) => {
  dispatch({ type: 'FETCH_FAVORITE_MESSAGES_REQUEST' });
  console.log('fetchFavoriteMessages - 请求参数:', { page, size });
  console.log('fetchFavoriteMessages - 请求URL:', `/messages/favorites?page=${page}&size=${size}`);
  
  try {
    const response = await axios.get(`/messages/favorites?page=${page}&size=${size}`);
    console.log('fetchFavoriteMessages - 响应数据结构:', {
      code: response.data.code,
      message: response.data.message,
      dataKeys: response.data.data ? Object.keys(response.data.data) : 'no data'
    });
    console.log('fetchFavoriteMessages - 完整响应数据:', response.data);
    
    dispatch({
      type: 'FETCH_FAVORITE_MESSAGES_SUCCESS',
      payload: response.data
    });
    return response.data;
  } catch (error) {
    console.error('fetchFavoriteMessages - 错误详情:', error);
    console.error('fetchFavoriteMessages - 错误响应:', error.response);
    dispatch({
      type: 'FETCH_FAVORITE_MESSAGES_FAILURE',
      payload: error.response?.data?.message || '获取收藏消息失败'
    });
    throw error;
  }
};

// 获取订单消息
export const fetchOrderMessages = (page = 0, size = 10) => async (dispatch) => {
  dispatch({ type: 'FETCH_ORDER_MESSAGES_REQUEST' });
  
  try {
    const response = await axios.get(`/messages/orders?page=${page}&size=${size}`);
    dispatch({
      type: 'FETCH_ORDER_MESSAGES_SUCCESS',
      payload: response.data
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: 'FETCH_ORDER_MESSAGES_FAILURE',
      payload: error.response?.data?.message || '获取订单消息失败'
    });
    throw error;
  }
};

// 获取聊天消息
export const fetchChatMessages = (page = 0, size = 10) => async (dispatch) => {
  dispatch({ type: 'FETCH_CHAT_MESSAGES_REQUEST' });
  
  try {
    const response = await axios.get(`/messages/chats?page=${page}&size=${size}`);
    dispatch({
      type: 'FETCH_CHAT_MESSAGES_SUCCESS',
      payload: response.data
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

// 获取用户作为发送者或接收者的所有聊天消息
export const fetchAllUserChatMessages = (page = 0, size = 10) => async (dispatch) => {
  dispatch({ type: 'FETCH_ALL_USER_CHAT_MESSAGES_REQUEST' });
  
  try {
    const response = await axios.get(`/messages/chats/all?page=${page}&size=${size}`);
    dispatch({
      type: 'FETCH_ALL_USER_CHAT_MESSAGES_SUCCESS',
      payload: response.data
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: 'FETCH_ALL_USER_CHAT_MESSAGES_FAILURE',
      payload: error.response?.data?.message || '获取所有聊天消息失败'
    });
    throw error;
  }
};

// 标记消息为已读
export const markMessageAsRead = (messageId) => async (dispatch) => {
  dispatch({ type: 'MARK_MESSAGE_READ_REQUEST' });
  
  try {
    console.log(`尝试标记消息 ${messageId} 为已读`);
    const response = await axios.put(`/messages/${messageId}/read`);
    console.log(`标记消息 ${messageId} 为已读成功:`, response.data);
    
    dispatch({
      type: 'MARK_MESSAGE_READ_SUCCESS',
      payload: { messageId }
    });
    return response.data;
  } catch (error) {
    console.error(`标记消息 ${messageId} 为已读失败:`, error);
    console.error('错误详情:', error.response?.data || error.message);
    
    dispatch({
      type: 'MARK_MESSAGE_READ_FAILURE',
      payload: error.response?.data?.message || '标记消息已读失败'
    });
    
    // 即使API调用失败，也在Redux中更新状态
    dispatch({
      type: 'MARK_MESSAGE_READ_SUCCESS',
      payload: { messageId }
    });
    
    throw error;
  }
};

// 标记所有消息为已读
export const markAllMessagesAsRead = () => async (dispatch) => {
  dispatch({ type: 'MARK_ALL_MESSAGES_READ_REQUEST' });
  
  try {
    const response = await axios.put('/messages/read/all');
    dispatch({
      type: 'MARK_ALL_MESSAGES_READ_SUCCESS'
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: 'MARK_ALL_MESSAGES_READ_FAILURE',
      payload: error.response?.data?.message || '标记所有消息已读失败'
    });
    throw error;
  }
};

// 标记特定类型的所有消息为已读
export const markAllMessagesByTypeAsRead = (messageType) => async (dispatch) => {
  dispatch({ type: 'MARK_ALL_MESSAGES_BY_TYPE_READ_REQUEST' });
  
  try {
    const response = await axios.put(`/messages/read/type/${messageType}`);
    dispatch({
      type: 'MARK_ALL_MESSAGES_BY_TYPE_READ_SUCCESS',
      payload: { messageType }
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: 'MARK_ALL_MESSAGES_BY_TYPE_READ_FAILURE',
      payload: error.response?.data?.message || '标记消息已读失败'
    });
    throw error;
  }
};

// 获取未读消息数量
export const fetchUnreadMessagesCount = () => async (dispatch) => {
  dispatch({ type: 'FETCH_UNREAD_MESSAGES_COUNT_REQUEST' });
  
  try {
    const response = await axios.get('/messages/unread/count');
    dispatch({
      type: 'FETCH_UNREAD_MESSAGES_COUNT_SUCCESS',
      payload: response.data
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: 'FETCH_UNREAD_MESSAGES_COUNT_FAILURE',
      payload: error.response?.data?.message || '获取未读消息数量失败'
    });
    throw error;
  }
};

// 获取特定类型的未读消息数量
export const fetchUnreadMessagesByTypeCount = (messageType) => async (dispatch) => {
  dispatch({ type: 'FETCH_UNREAD_MESSAGES_BY_TYPE_COUNT_REQUEST' });
  
  try {
    const response = await axios.get(`/messages/unread/count/${messageType}`);
    console.log(`fetchUnreadMessagesByTypeCount - ${messageType} 响应:`, response.data);
    
    // 确保data是数字
    let count = 0;
    if (response.data) {
      if (response.data.data !== undefined) {
        count = typeof response.data.data === 'number' ? response.data.data : parseInt(response.data.data, 10) || 0;
      } else if (typeof response.data === 'number') {
        count = response.data;
      } else if (response.data.count !== undefined) {
        count = typeof response.data.count === 'number' ? response.data.count : parseInt(response.data.count, 10) || 0;
      }
    }
    
    dispatch({
      type: 'FETCH_UNREAD_MESSAGES_BY_TYPE_COUNT_SUCCESS',
      payload: {
        messageType,
        data: count
      }
    });
    return response.data;
  } catch (error) {
    console.error(`fetchUnreadMessagesByTypeCount - ${messageType} 错误:`, error);
    dispatch({
      type: 'FETCH_UNREAD_MESSAGES_BY_TYPE_COUNT_FAILURE',
      payload: error.response?.data?.message || '获取未读消息数量失败'
    });
    throw error;
  }
}; 