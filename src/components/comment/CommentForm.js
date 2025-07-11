import React from 'react';
import { Button, Input, Avatar } from 'antd';
import { CommentOutlined, UserOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';

const { TextArea } = Input;

export default function CommentForm({ value, onChange, onSubmit, submitting }) {
  const user = useSelector(selectUser);
  
  return (
    <div className="comment-form-container">
      <div className="comment-form-header">
        <Avatar 
          src={user?.avatar} 
          icon={<UserOutlined />} 
          size="small"
          className="comment-form-avatar"
        />
        <div className="comment-form-input">
          <TextArea
            rows={3}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="说点什么吧..."
            maxLength={300}
            className="comment-input"
          />
        </div>
      </div>
      <div className="comment-form-footer">
        <Button
          type="primary"
          loading={submitting}
          onClick={onSubmit}
          icon={<CommentOutlined />}
        >
          发表评论
        </Button>
      </div>
    </div>
  );
} 