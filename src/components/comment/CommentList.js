import React from 'react';
import { List, Avatar, Button, Input, message, Typography, Tooltip } from 'antd';
import { Comment as AntdComment } from '@ant-design/compatible';
import { MessageOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const { Text } = Typography;

export default function CommentList({ comments, onReply, submitting, replyContent, onChangeReply, onSubmitReply, replyingId }) {
  const navigate = useNavigate();
  // 格式化时间
  const formatTime = (time) => {
    if (!time) return '';
    const date = new Date(time);
    
    // 如果是今天
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    
    // 如果是昨天
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `昨天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    
    // 其他日期
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="comment-list-container">
      <div className="comment-list-header">
        共 {comments.length} 条评论
      </div>
      
      {comments.length === 0 ? (
        <div className="no-comments">
          还没有评论，快来说点什么吧~
        </div>
      ) : (
        <List
          dataSource={comments}
          itemLayout="horizontal"
          className="comment-items"
          renderItem={item => (
            <div className="comment-item">
              <div className="comment-avatar" onClick={() => navigate(`/users/${item.userId}`)} style={{ cursor: 'pointer' }}>
                <Avatar src={item.userAvatar} icon={<UserOutlined />} alt={item.username} />
              </div>
              <div className="comment-content">
                <div className="comment-author">
                  <Text strong onClick={() => navigate(`/users/${item.userId}`)} style={{ cursor: 'pointer' }}>{item.username}</Text>
                  <Tooltip title={formatTime(item.createTime)}>
                    <Text type="secondary" className="comment-time">
                      <ClockCircleOutlined /> {formatTime(item.createTime)}
                    </Text>
                  </Tooltip>
                </div>
                <div className="comment-text">
                  {item.content}
                </div>
                <div className="comment-actions">
                  <Button 
                    type="link" 
                    icon={<MessageOutlined />} 
                    size="small"
                    onClick={() => onReply(item.id, item.userId, item.username)}
                  >
                    回复
                  </Button>
                </div>
                
                {/* 回复列表 */}
                {item.replies && item.replies.length > 0 && (
                  <div className="comment-replies">
                    {item.replies.map(reply => (
                      <div key={reply.id} className="reply-item">
                        <div className="reply-avatar" onClick={() => navigate(`/users/${reply.userId}`)} style={{ cursor: 'pointer' }}>
                          <Avatar src={reply.userAvatar} icon={<UserOutlined />} size="small" alt={reply.username} />
                        </div>
                        <div className="reply-content">
                          <div className="reply-author">
                            <Text strong onClick={() => navigate(`/users/${reply.userId}`)} style={{ cursor: 'pointer' }}>{reply.username}</Text>
                            {reply.replyUsername && (
                              <>
                                <Text type="secondary" className="reply-to"> 回复 </Text>
                                <Text strong onClick={() => navigate(`/users/${reply.replyUserId}`)} style={{ cursor: 'pointer' }}>{reply.replyUsername}</Text>
                              </>
                            )}
                          </div>
                          <div className="reply-text">
                            {reply.content}
                          </div>
                          <div className="reply-time">
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {formatTime(reply.createTime)}
                            </Text>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* 回复输入框 */}
                {replyingId === item.id && (
                  <div className="reply-form">
                    <div className="reply-input">
                      <TextArea
                        rows={2}
                        value={replyContent}
                        onChange={e => onChangeReply(e.target.value)}
                        placeholder={`回复 @${item.username}`}
                        maxLength={300}
                        autoFocus
                      />
                    </div>
                    <div className="reply-actions">
                      <Button
                        type="text"
                        size="small"
                        onClick={() => onReply(null)}
                      >
                        取消
                      </Button>
                      <Button
                        type="primary"
                        size="small"
                        loading={submitting}
                        onClick={() => onSubmitReply(item)}
                      >
                        提交回复
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        />
      )}
    </div>
  );
} 