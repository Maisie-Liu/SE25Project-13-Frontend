import React from 'react';
import { List, Avatar, Button, Input, message } from 'antd';
import { Comment as AntdComment } from '@ant-design/compatible';

const { TextArea } = Input;

export default function CommentList({ comments, onReply, submitting, replyContent, onChangeReply, onSubmitReply, replyingId }) {
  return (
    <List
      dataSource={comments}
      header={<div>{comments.length} 条评论</div>}
      itemLayout="horizontal"
      renderItem={item => (
        <AntdComment
          author={item.username}
          avatar={<Avatar src={item.userAvatar} alt={item.username} />}
          content={<span>{item.content}</span>}
          datetime={item.createTime && new Date(item.createTime).toLocaleString('zh-CN')}
          actions={[
            <span key="reply" onClick={() => onReply(item.id, item.userId, item.username)} style={{color:'#00b8a9', cursor:'pointer'}}>回复</span>
          ]}
        >
          {/* 回复列表 */}
          {item.replies && item.replies.length > 0 && (
            <List
              dataSource={item.replies}
              itemLayout="horizontal"
              renderItem={reply => (
                <AntdComment
                  author={reply.username + (reply.replyUsername ? ` 回复 ${reply.replyUsername}` : '')}
                  avatar={<Avatar src={reply.userAvatar} alt={reply.username} />}
                  content={<span>{reply.content}</span>}
                  datetime={reply.createTime && new Date(reply.createTime).toLocaleString('zh-CN')}
                />
              )}
            />
          )}
          {/* 回复输入框 */}
          {replyingId === item.id && (
            <div style={{marginTop:8}}>
              <TextArea
                rows={2}
                value={replyContent}
                onChange={e => onChangeReply(e.target.value)}
                placeholder={`回复 @${item.username}`}
                maxLength={300}
              />
              <Button
                type="primary"
                size="small"
                loading={submitting}
                style={{marginTop:4}}
                onClick={() => onSubmitReply(item)}
              >提交回复</Button>
            </div>
          )}
        </AntdComment>
      )}
    />
  );
} 