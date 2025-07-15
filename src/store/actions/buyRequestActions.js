import axios from '../../utils/axios';

// Action Types
export const FETCH_BUY_REQUESTS_REQUEST = 'FETCH_BUY_REQUESTS_REQUEST';
export const FETCH_BUY_REQUESTS_SUCCESS = 'FETCH_BUY_REQUESTS_SUCCESS';
export const FETCH_BUY_REQUESTS_FAILURE = 'FETCH_BUY_REQUESTS_FAILURE';

export const FETCH_BUY_REQUEST_DETAIL_SUCCESS = 'FETCH_BUY_REQUEST_DETAIL_SUCCESS';

export const CREATE_BUY_REQUEST_SUCCESS = 'CREATE_BUY_REQUEST_SUCCESS';
export const UPDATE_BUY_REQUEST_SUCCESS = 'UPDATE_BUY_REQUEST_SUCCESS';
export const DELETE_BUY_REQUEST_SUCCESS = 'DELETE_BUY_REQUEST_SUCCESS';

export const FETCH_BUY_REQUEST_COMMENTS_SUCCESS = 'FETCH_BUY_REQUEST_COMMENTS_SUCCESS';
export const CREATE_BUY_REQUEST_COMMENT_SUCCESS = 'CREATE_BUY_REQUEST_COMMENT_SUCCESS';
export const DELETE_BUY_REQUEST_COMMENT_SUCCESS = 'DELETE_BUY_REQUEST_COMMENT_SUCCESS';

// 分页获取求购帖
export const fetchBuyRequests = (params) => async dispatch => {
  dispatch({ type: FETCH_BUY_REQUESTS_REQUEST });
  try {
    const res = await axios.get('/buy-requests', { params });
    dispatch({ type: FETCH_BUY_REQUESTS_SUCCESS, payload: res.data.data });
  } catch (err) {
    dispatch({ type: FETCH_BUY_REQUESTS_FAILURE, error: err });
  }
};

// 获取求购帖详情
export const fetchBuyRequestDetail = (id) => async dispatch => {
  const res = await axios.get(`/buy-requests/${id}`);
  dispatch({ type: FETCH_BUY_REQUEST_DETAIL_SUCCESS, payload: res.data.data });
};

// 发布求购帖
export const createBuyRequest = (data) => async dispatch => {
  const res = await axios.post('/buy-requests', data);
  dispatch({ type: CREATE_BUY_REQUEST_SUCCESS, payload: res.data.data });
};

// 编辑求购帖
export const updateBuyRequest = (id, data) => async dispatch => {
  const res = await axios.put(`/buy-requests/${id}`, data);
  dispatch({ type: UPDATE_BUY_REQUEST_SUCCESS, payload: res.data.data });
};

// 删除求购帖
export const deleteBuyRequest = (id) => async dispatch => {
  await axios.delete(`/buy-requests/${id}`);
  dispatch({ type: DELETE_BUY_REQUEST_SUCCESS, payload: id });
};

// 获取评论（分页）
export const fetchBuyRequestComments = (buyRequestId, pageNum = 0, pageSize = 10, append = false) => async dispatch => {
  const res = await axios.get('/buy-request-comments', { params: { buyRequestId, pageNum, pageSize } });
  dispatch({ type: FETCH_BUY_REQUEST_COMMENTS_SUCCESS, payload: { buyRequestId, ...res.data.data, append } });
};

// 发布评论/回复
export const createBuyRequestComment = (data) => async dispatch => {
  // data: { buyRequestId, content, parentId, replyUserId }
  const res = await axios.post('/buy-request-comments', data);
  dispatch({ type: CREATE_BUY_REQUEST_COMMENT_SUCCESS, payload: res.data.data });
};

// 删除评论
export const deleteBuyRequestComment = (id) => async dispatch => {
  await axios.delete(`/buy-request-comments/${id}`);
  dispatch({ type: DELETE_BUY_REQUEST_COMMENT_SUCCESS, payload: id });
}; 