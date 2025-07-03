import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import axios from '../utils/axios';
import { selectUser } from '../store/slices/authSlice';
import { format } from 'date-fns';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const Chat = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [chatInfo, setChatInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  
  // 模拟获取聊天数据
  useEffect(() => {
    const fetchChatData = async () => {
      setLoading(true);
      try {
        // 模拟聊天数据 - 实际项目中应该从API获取
        const mockChatInfo = {
          chatId: parseInt(chatId),
          itemId: 106,
          itemName: '键盘',
          itemImage: 'https://via.placeholder.com/100',
          itemPrice: 199,
          otherUser: {
            id: 204,
            username: '赵六',
            avatar: 'https://via.placeholder.com/40'
          }
        };
        
        // 模拟消息数据
        const mockMessages = [
          {
            id: 1,
            senderId: 204,
            receiverId: currentUser.id,
            content: '你好，这个物品还在吗？',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
          },
          {
            id: 2,
            senderId: currentUser.id,
            receiverId: 204,
            content: '在的，有什么问题吗？',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5)
          },
          {
            id: 3,
            senderId: 204,
            receiverId: currentUser.id,
            content: '能便宜一点吗？',
            createdAt: new Date(Date.now() - 1000 * 60 * 60)
          },
          {
            id: 4,
            senderId: currentUser.id,
            receiverId: 204,
            content: '可以的，你想多少钱？',
            createdAt: new Date(Date.now() - 1000 * 60 * 30)
          }
        ];
        
        setChatInfo(mockChatInfo);
        setMessages(mockMessages);
      } catch (error) {
        console.error('获取聊天数据失败:', error);
        message.error('获取聊天数据失败');
      } finally {
        setLoading(false);
      }
    };
    
    if (chatId) {
      fetchChatData();
    }
  }, [chatId, currentUser.id]);
  
  // 滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // 发送消息
  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    
    setSending(true);
    try {
      // 实际项目中这里应该调用API发送消息
      // 这里只是模拟，实际使用时请替换为真实API调用
      
      // 模拟新消息
      const newMessage = {
        id: messages.length + 1,
        senderId: currentUser.id,
        receiverId: chatInfo.otherUser.id,
        content: messageText.trim(),
        createdAt: new Date()
      };
      
      // 更新消息列表
      setMessages([...messages, newMessage]);
      
      // 清空输入框
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
  
  return (
    <div className="chat-page">
      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : chatInfo ? (
        <>
          <Card className="chat-header-card">
            <Button 
              type="link" 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/my/messages')}
              style={{ marginRight: '10px', padding: 0 }}
            >
              返回
            </Button>
            <Avatar src={chatInfo.otherUser.avatar} size="large" />
            <div className="chat-user-info">
              <Title level={4} style={{ margin: 0 }}>{chatInfo.otherUser.username}</Title>
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
                    const isSelf = msg.senderId === currentUser.id;
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
                            <Avatar src={chatInfo.otherUser.avatar} size="small" />
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