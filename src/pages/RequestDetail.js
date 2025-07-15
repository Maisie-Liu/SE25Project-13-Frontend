import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Typography,
  Tag,
  Avatar,
  Button,
  Divider,
  Space,
  Input,
  message,
  Popconfirm
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  UserOutlined
} from '@ant-design/icons';
import {
  fetchBuyRequestDetail,
  deleteBuyRequest,
  fetchBuyRequestComments,
  createBuyRequestComment,
  deleteBuyRequestComment
} from '../store/actions/buyRequestActions';
import { selectCategories } from '../store/slices/categorySlice';
import { fetchCategories } from '../store/actions/categoryActions';
import { selectUser } from '../store/slices/authSlice';
import ConditionTag from "../components/condition/ConditionTag";
import './RequestDetail.css'; // 可选：如需单独样式
const { Title, Paragraph } = Typography;

const RequestDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const userId = user?.id;
  const detail = useSelector(state => state.buyRequest.detail);
  const commentsData = useSelector(state => state.buyRequest.comments[id] || { list: [], pageNum: 0, pageSize: 10, total: 0 });
  const categories = useSelector(selectCategories);
  const [commentInput, setCommentInput] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  // 回复相关
  const [replyTo, setReplyTo] = useState(null); // {commentId, username, replyUserId}
  const [replyInput, setReplyInput] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchBuyRequestDetail(id));
    dispatch(fetchBuyRequestComments(id, 0, 10));
    dispatch(fetchCategories());
  }, [dispatch, id]);

  const handleEdit = () => {
    navigate(`/publish-request/${id}`);
  };

  const handleDelete = async () => {
    await dispatch(deleteBuyRequest(id));
    message.success('删除成功');
    navigate('/requests');
  };

  const handleCommentChange = (e) => {
    setCommentInput(e.target.value);
  };

  const handleCommentSubmit = async () => {
    if (!commentInput) return;
    setCommentLoading(true);
    await dispatch(createBuyRequestComment({ buyRequestId: id, content: commentInput }));
    setCommentInput('');
    dispatch(fetchBuyRequestComments(id, 0, 10));
    setCommentLoading(false);
  };

  // 回复相关
  const handleReplyClick = (comment) => {
    // 如果是主评论
    if (!comment.parentId) {
      setReplyTo({ commentId: comment.id, username: comment.username, parentId: comment.id, replyUserId: comment.userId });
    } else {
      // 二级评论，parentId=主评论id，replyUserId=被回复评论userId
      setReplyTo({ commentId: comment.id, username: comment.username, parentId: comment.parentId, replyUserId: comment.userId });
    }
    setReplyInput('');
  };
  const handleReplyInputChange = (e) => {
    setReplyInput(e.target.value);
  };
  const handleReplySubmit = async () => {
    if (!replyInput || !replyTo) return;
    setReplyLoading(true);
    await dispatch(createBuyRequestComment({ buyRequestId: id, content: replyInput, parentId: replyTo.parentId, replyUserId: replyTo.replyUserId }));
    setReplyInput('');
    setReplyTo(null);
    dispatch(fetchBuyRequestComments(id, 0, commentsData.pageSize));
    setReplyLoading(false);
  };
  const handleCancelReply = () => {
    setReplyTo(null);
    setReplyInput('');
  };

  // 删除逻辑
  const handleDeleteComment = async (commentId, isTopLevel) => {
    if (isTopLevel) {
      // 删除主评论及所有子评论
      const childIds = (commentsData.list || []).filter(c => c.parentId === commentId).map(c => c.id);
      for (const cid of childIds) {
        await dispatch(deleteBuyRequestComment(cid));
      }
      await dispatch(deleteBuyRequestComment(commentId));
    } else {
      // 直接删除二级评论
      await dispatch(deleteBuyRequestComment(commentId));
    }
    message.success('评论已删除');
    dispatch(fetchBuyRequestComments(id, 0, commentsData.pageSize));
  };

  // 加载更多评论
  const handleLoadMore = () => {
    const nextPage = (commentsData.pageNum || 0) + 1;
    dispatch(fetchBuyRequestComments(id, nextPage, commentsData.pageSize, true));
  };

  // 递归渲染评论（只允许二级评论）
  const renderComment = (comment) => {
    // 找到所有二级评论
    const children = (commentsData.list || []).filter(c => c.parentId === comment.id);
    return (
      <div key={comment.id} className="request-detail-comment-item">
        <Space align="start">
          <Avatar src={comment.userAvatar} size={32} icon={<UserOutlined />} />
          <div className="request-detail-comment-content">
            <div className="request-detail-comment-header">
              <span className="request-detail-comment-username">{comment.username}</span>
              <span className="request-detail-comment-time">{comment.createTime?.slice(0, 16).replace('T', ' ')}</span>
              {String(comment.userId) === String(userId) && (
                <Button
                  size="small"
                  type="link"
                  danger
                  onClick={() => handleDeleteComment(comment.id, true)}
                >删除</Button>
              )}
              <Button
                size="small"
                type="link"
                onClick={() => handleReplyClick(comment)}
                style={{ marginLeft: 8 }}
              >回复</Button>
            </div>
            <div className="request-detail-comment-text">{comment.content}</div>
            {/* 回复输入框 */}
            {replyTo && replyTo.commentId === comment.id && (
              <div className="request-detail-reply-box">
                <Input.TextArea
                  value={replyInput}
                  onChange={handleReplyInputChange}
                  placeholder={`回复 @${replyTo.username}`}
                  autoSize={{ minRows: 1, maxRows: 2 }}
                  className="request-detail-comment-input"
                />
                <div style={{ marginTop: 4 }}>
                  <Button
                    type="primary"
                    size="small"
                    loading={replyLoading}
                    onClick={handleReplySubmit}
                    style={{ marginRight: 8 }}
                  >发表回复</Button>
                  <Button size="small" onClick={handleCancelReply}>取消</Button>
                </div>
              </div>
            )}
            {/* 二级评论 */}
            {children.map(reply => (
              <div key={reply.id} className="request-detail-reply-item">
                <Space align="start">
                  <Avatar src={reply.userAvatar} size={28} icon={<UserOutlined />} />
                  <div>
                    <span className="request-detail-comment-username">{reply.username}</span>
                    <span className="request-detail-comment-time" style={{ marginLeft: 8 }}>{reply.createTime?.slice(0, 16).replace('T', ' ')}</span>
                    <span style={{ color: '#888', marginLeft: 8 }}>回复@{comment.username}</span>
                    {String(reply.userId) === String(userId) && (
                      <Button
                        size="small"
                        type="link"
                        danger
                        onClick={() => handleDeleteComment(reply.id, false)}
                      >删除</Button>
                    )}
                    <Button
                      size="small"
                      type="link"
                      onClick={() => handleReplyClick(reply)}
                      style={{ marginLeft: 8 }}
                    >回复</Button>
                    <div className="request-detail-comment-text">{reply.content}</div>
                    {/* 二级回复输入框（只允许二级）*/}
                    {replyTo && replyTo.commentId === reply.id && (
                      <div className="request-detail-reply-box">
                        <Input.TextArea
                          value={replyInput}
                          onChange={handleReplyInputChange}
                          placeholder={`回复 @${replyTo.username}`}
                          autoSize={{ minRows: 1, maxRows: 2 }}
                          className="request-detail-comment-input"
                        />
                        <div style={{ marginTop: 4 }}>
                          <Button
                            type="primary"
                            size="small"
                            loading={replyLoading}
                            onClick={handleReplySubmit}
                            style={{ marginRight: 8 }}
                          >发表回复</Button>
                          <Button size="small" onClick={handleCancelReply}>取消</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Space>
              </div>
            ))}
          </div>
        </Space>
      </div>
    );
  };

  // 渲染主评论
  const topLevelComments = (commentsData.list || []).filter(c => !c.parentId);

  if (!detail) {
    return <div style={{ textAlign: 'center', margin: 40 }}>加载中...</div>;
  }

  return (
    <div className="request-detail-outer">
      <Card bordered={false} className="request-detail-card">
        <div className="request-detail-header">
          <Title level={2} className="request-detail-title">{detail.title}</Title>
          <div className="request-detail-tags">
            <Tag color="blue">{detail.categoryName || '未知分类'}</Tag>
            <ConditionTag condition={detail.condition} />
            <Tag color="purple">期望价格: ¥{detail.expectedPrice}{detail.negotiable ? ' (可议价)' : ''}</Tag>
          </div>
          {/* 更新时间 */}
          <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}>
            更新时间: {detail.updateTime ? new Date(detail.updateTime).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-') : '-'}
          </div>
        </div>
        <Paragraph className="request-detail-desc">{detail.description}</Paragraph>
        <div className="request-detail-userinfo">
          <Avatar src={detail.userAvatar} icon={<UserOutlined />} size={48} className="request-detail-avatar" />
          <div className="request-detail-usertext">
            <span className="request-detail-username">{detail.username}</span>
            <span className="request-detail-contact">联系方式: {detail.contact}</span>
          </div>
        </div>
        {String(detail.userId) === String(userId) && (
          <div className="request-detail-actions">
            <Button icon={<EditOutlined />} onClick={handleEdit} style={{ marginRight: 8 }}>编辑</Button>
            <Popconfirm
              title="确定要删除该求购帖吗？"
              onConfirm={handleDelete}
              okText="删除"
              cancelText="取消"
            >
              <Button icon={<DeleteOutlined />} danger>删除</Button>
            </Popconfirm>
          </div>
        )}
        <Divider />
        <div className="request-detail-comments-section">
          <Title level={4} className="request-detail-comments-title">评论区</Title>
          <div className="request-detail-comment-form">
            <Input.TextArea
              value={commentInput}
              onChange={handleCommentChange}
              placeholder="写下你的评论..."
              autoSize={{ minRows: 1, maxRows: 3 }}
              className="request-detail-comment-input"
            />
            <Button
              type="primary"
              loading={commentLoading}
              onClick={handleCommentSubmit}
              className="request-detail-comment-btn"
            >发表评论</Button>
          </div>
          <div className="request-detail-comment-list">
            {topLevelComments.length === 0 ? (
              <div className="no-comments">暂无评论</div>
            ) : (
              topLevelComments.map(comment => renderComment(comment))
            )}
            {/* 加载更多主评论按钮 */}
            {commentsData.list.filter(c => !c.parentId).length < commentsData.total && (
              <div style={{ textAlign: 'center', margin: '16px 0' }}>
                <Button onClick={handleLoadMore} type="dashed">加载更多评论</Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RequestDetail; 