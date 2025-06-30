import React from 'react';
import { Button, Input } from 'antd';

const { TextArea } = Input;

export default function CommentForm({ value, onChange, onSubmit, submitting }) {
  return (
    <div style={{marginBottom:16}}>
      <TextArea
        rows={3}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="说点什么吧..."
        maxLength={300}
      />
      <Button
        type="primary"
        style={{marginTop:8}}
        loading={submitting}
        onClick={onSubmit}
      >发表评论</Button>
    </div>
  );
} 