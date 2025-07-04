import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Card, 
  Input, 
  Button, 
  List, 
  Avatar, 
  Typography, 
  Divider,
  Badge,
  Space,
  Empty,
  message,
  Spin
} from 'antd';
import { 
  SendOutlined, 
  UserOutlined, 
  ShoppingOutlined,
  ArrowLeftOutlined,
  InfoCircleOutlined,
  PictureOutlined
} from '@ant-design/icons';
import { format } from 'date-fns';

import { selectUser } from '../store/slices/authSlice';
import { 
  fetchChatMessages, 
  sendChatMessage, 
  markChatMessagesAsRead 
} from '../store/actions/chatActions';
import { 
  selectChatMessages, 
  selectChatLoading, 
  selectChatError 
} from '../store/slices/chatSlice';

import './Chat.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const Chat = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);
  const messages = useSelector(state => selectChatMessages(state, parseInt(chatId)));
  const loading = useSelector(selectChatLoading);
  const error = useSelector(selectChatError);
  
  const [sending, setSending] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [chatInfo, setChatInfo] = useState(null);
  const messagesEndRef = useRef(null);
  
  // 获取聊天数据
  useEffect(() => {
    const fetchChatData = async () => {
      if (!chatId) return;
      
      try {
        // 获取聊天消息
        const messagesData = await dispatch(fetchChatMessages(parseInt(chatId))).unwrap();
        
        // 标记消息为已读
        await dispatch(markChatMessagesAsRead(parseInt(chatId))).unwrap();
        
        // 从消息中提取聊天信息
        if (messagesData.content && messagesData.content.length > 0) {
          const firstMessage = messagesData.content[0];
          const otherUser = firstMessage.sender.id !== currentUser.id ? 
            firstMessage.sender : 
            (messagesData.content.find(m => m.sender.id !== currentUser.id)?.sender || null);
          
          setChatInfo({
            chatId: parseInt(chatId),
            itemId: firstMessage.itemId,
            itemName: firstMessage.itemName,
            itemImage: firstMessage.itemImage,
            itemPrice: firstMessage.itemPrice,
            otherUser: otherUser
          });
        }
      } catch (error) {
        console.error('获取聊天数据失败:', error);
        message.error('获取聊天数据失败');
      }
    };
    
    if (chatId && currentUser) {
      fetchChatData();
    }
  }, [chatId, currentUser, dispatch]);
  
  // 滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // 发送消息
  const handleSendMessage = async () => {
    if (!messageText.trim() || !chatId) return;
    
    setSending(true);
    try {
      await dispatch(sendChatMessage(parseInt(chatId), messageText.trim())).unwrap();
      setMessageText('');
    } catch (error) {
      console.error('发送消息失败:', error);
      message.error('发送消息失败');
    } finally {
      setSending(false);
    }
  };
  
  // 格式化时间
  const formatTime = (date) => {
    try {
      return format(new Date(date), 'HH:mm');
    } catch (error) {
      const d = new Date(date);
      return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    }
  };
  
  // 格式化日期
  const formatDate = (date) => {
    try {
      return format(new Date(date), 'yyyy-MM-dd');
    } catch (error) {
      const d = new Date(date);
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
    }
  };
  
  if (error) {
    return (
      <div className="chat-error">
        <Empty 
          description={
            <span>
              加载聊天失败: {error}
              <Button type="link" onClick={() => navigate('/my/messages/chats')}>
                返回消息列表
              </Button>
            </span>
          } 
        />
      </div>
    );
  }
  
  return (
    <div className="chat-page">
      {loading && !chatInfo ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : chatInfo ? (
        <>
          <Card className="chat-header-card">
            <Button 
              type="link" 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/my/messages/chats')}
              style={{ marginRight: '10px', padding: 0 }}
            >
              返回
            </Button>
            <Avatar src={chatInfo.otherUser?.avatarImageId} size="large" />
            <div className="chat-user-info">
              <Title level={4} style={{ margin: 0 }}>{chatInfo.otherUser?.username}</Title>
            </div>
          </Card>
          
          <div className="chat-container">
            <div className="chat-item-info">
              <Card className="item-card">
                <div className="item-info-content">
                  <img src={chatInfo.itemImage} alt={chatInfo.itemName} className="chat-item-image" />
                  <div className="chat-item-details">
                    <Text strong>{chatInfo.itemName}</Text>
                    <Text type="danger">¥{chatInfo.itemPrice}</Text>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="chat-messages-container">
              {messages.length > 0 ? (
                <>
                  {messages.map((msg, index) => {
                    const isSelf = msg.sender.id === currentUser.id;
                    const showDate = index === 0 || 
                      formatDate(msg.createdAt) !== formatDate(messages[index - 1].createdAt);
                    
                    return (
                      <div key={msg.id}>
                        {showDate && (
                          <div className="chat-date-divider">
                            <span>{formatDate(msg.createdAt)}</span>
                          </div>
                        )}
                        <div className={`chat-message ${isSelf ? 'self' : 'other'}`}>
                          {!isSelf && (
                            <Avatar src={msg.sender.avatarImageId} size="small" />
                          )}
                          <div className="message-bubble">
                            <div className="message-content">{msg.content}</div>
                            <div className="message-time">{formatTime(msg.createdAt)}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <Empty description="暂无消息记录" />
              )}
            </div>
            
            <div className="chat-input-container">
              <Space style={{ marginBottom: '10px' }}>
                <Button icon={<PictureOutlined />} />
              </Space>
              <div className="chat-input">
                <TextArea 
                  placeholder="输入消息..." 
                  autoSize={{ minRows: 2, maxRows: 4 }} 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onPressEnter={(e) => {
                    if (!e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button 
                  type="primary" 
                  icon={<SendOutlined />} 
                  onClick={handleSendMessage}
                  loading={sending}
                  disabled={!messageText.trim()}
                >
                  发送
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Empty description="聊天不存在" />
      )}
    </div>
  );
};

export default Chat; 