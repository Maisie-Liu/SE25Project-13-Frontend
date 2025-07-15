import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
  markChatMessagesAsRead,
  fetchUserChats,
  fetchTotalUnreadCount,
  createChat
} from '../store/actions/chatActions';
import { 
  selectChatMessages, 
  selectChatLoading, 
  selectChatError,
  selectChats
} from '../store/slices/chatSlice';
import { fetchUnreadMessagesByTypeCount } from '../store/actions/messageActions';

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
  const chats = useSelector(selectChats);
  
  const [sending, setSending] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [chatInfo, setChatInfo] = useState(null);
  const [loadingChats, setLoadingChats] = useState(true);
  const messagesEndRef = useRef(null);
  
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userId = params.get('userId');
  const itemId = params.get('itemId');
  
  // 获取所有聊天会话
  useEffect(() => {
    const fetchChats = async () => {
      setLoadingChats(true);
      try {
        await dispatch(fetchUserChats()).unwrap();
      } catch (error) {
        console.error('获取聊天列表失败:', error);
        message.error('获取聊天列表失败');
      } finally {
        setLoadingChats(false);
      }
    };
    
    if (currentUser) {
      fetchChats();
    }
  }, [currentUser, dispatch]);
  
  // 获取聊天数据
  useEffect(() => {
    const fetchChatData = async () => {
      if (!chatId) return;
      try {
        // 获取聊天消息
        const messagesData = await dispatch(fetchChatMessages({ chatId: parseInt(chatId) })).unwrap();
        
        // 标记消息为已读，添加重试逻辑
        let retryCount = 0;
        const maxRetries = 2;
        let markReadSuccess = false;
        
        while (!markReadSuccess && retryCount <= maxRetries) {
          try {
            await dispatch(markChatMessagesAsRead(parseInt(chatId))).unwrap();
            markReadSuccess = true;
          } catch (error) {
            retryCount++;
            console.error(`标记聊天 ${chatId} 已读失败 (${retryCount}/${maxRetries}):`, error);
            if (retryCount > maxRetries) break;
            // 等待短暂时间后重试
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
        
        // 无论标记已读是否成功，都更新未读消息数量
        await dispatch(fetchTotalUnreadCount());
        await dispatch(fetchUnreadMessagesByTypeCount('CHAT'));
        
        // 从消息中提取聊天信息
        if (messagesData.messages && messagesData.messages.content && messagesData.messages.content.length > 0) {
          const firstMessage = messagesData.messages.content[0];
          const otherUser = firstMessage.sender.id !== currentUser.id ? 
            firstMessage.sender : 
            (messagesData.messages.content.find(m => m.sender.id !== currentUser.id)?.sender || null);
          
          setChatInfo({
            chatId: parseInt(chatId),
            itemId: firstMessage.itemId,
            itemName: firstMessage.itemName,
            itemImage: firstMessage.itemImage,
            itemPrice: firstMessage.itemPrice,
            otherUser: otherUser
          });
        } else {
          // 没有消息时，从 chats 列表中查找当前会话
          const chat = chats.find(c => String(c.id) === String(chatId));
          if (chat) {
            setChatInfo({
              chatId: chat.id,
              itemId: chat.itemId,
              itemName: chat.itemName,
              itemImage: chat.itemImage,
              itemPrice: chat.itemPrice,
              otherUser: chat.otherUser,
            });
          }
        }
      } catch (error) {
        console.error('获取聊天数据失败:', error);
        message.error('获取聊天数据失败');
      }
    };
    if (chatId && currentUser) {
      fetchChatData();
    }
  }, [chatId, currentUser, dispatch, chats]);

  useEffect(() => {
    if (userId && itemId && currentUser) {
      dispatch(createChat({ otherUserId: userId, itemId }))
        .unwrap()
        .then(chat => {
          if (chat && chat.id) {
            navigate(`/chat/${chat.id}`);
          } else {
            message.error('会话创建失败，未返回chatId');
          }
        })
        .catch(err => {
          message.error('发起私聊失败: ' + err);
        });
    }
  }, [userId, itemId, currentUser, dispatch, navigate]);
  
  // 滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // 发送消息
  const handleSendMessage = async () => {
    if (!messageText.trim() || !chatId) return;
    
    setSending(true);
    try {
      await dispatch(sendChatMessage({ chatId: parseInt(chatId), content: messageText.trim() })).unwrap();
      setMessageText('');
      
      // 重新获取未读消息数量
      await dispatch(fetchTotalUnreadCount());
      await dispatch(fetchUnreadMessagesByTypeCount('CHAT'));
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
  
  // 切换到其他聊天
  const handleChatSelect = (selectedChatId) => {
    navigate(`/chat/${selectedChatId}`);
  };
  
  // 渲染聊天列表
  const renderChatList = () => {
    if (loadingChats) {
      return (
        <div className="loading-container" style={{ height: '100px' }}>
          <Spin size="small" />
        </div>
      );
    }
    
    if (!chats || chats.length === 0) {
      return (
        <div className="chat-empty">
          <Empty description="暂无聊天" />
        </div>
      );
    }
    
    return (
      <List
        className="chat-list"
        itemLayout="horizontal"
        dataSource={chats}
        renderItem={(chat) => {
          const isActive = chat.id === parseInt(chatId);
          const otherUser = chat.otherUser || {};
          return (
            <List.Item 
              className={`chat-list-item ${isActive ? 'active' : ''}`}
              onClick={() => handleChatSelect(chat.id)}
            >
              <List.Item.Meta
                avatar={
                  <Badge dot={chat.unreadCount > 0}>
                    <Avatar src={otherUser.avatarUrl || otherUser.avatarImageId} icon={<UserOutlined />} />
                  </Badge>
                }
                title={<span>{otherUser.username || '未知用户'}</span>}
                description={
                  <div>
                    <div className="chat-list-message">
                      {chat.lastMessage || '暂无消息'}
                    </div>
                    <div className="chat-list-time">
                      {chat.lastMessageTime && formatTime(chat.lastMessageTime)}
                    </div>
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />
    );
  };
  
  // 渲染聊天详情
  const renderChatDetail = () => {
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
    
    if (loading && !chatInfo) {
      return (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      );
    }
    
    if (!chatInfo) {
      return (
        <div className="chat-empty">
          <Empty description="请选择一个聊天" />
        </div>
      );
    }
    
    return (
      <>
        <Card className="chat-header-card">
          <Avatar src={chatInfo?.otherUser?.avatarUrl || chatInfo?.otherUser?.avatarImageId} size="large" />
          <div className="chat-user-info">
            <Title level={4} style={{ margin: 0 }}>
              {chatInfo?.otherUser?.username && String(chatInfo.otherUser.username).trim() !== ''
                ? chatInfo.otherUser.username
                : '未知用户'}
            </Title>
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
    );
  };
  
  return (
    <div className="chat-page">
      <div className="chat-layout">
        <div className="chat-sidebar">
          <Card 
            title="我的聊天" 
            extra={<Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/my/messages/chats')}>返回</Button>}
            style={{ height: '100%' }}
            bodyStyle={{ padding: '0', height: 'calc(100% - 57px)', overflow: 'auto' }}
          >
            {renderChatList()}
          </Card>
        </div>
        <div className="chat-main">
          {renderChatDetail()}
        </div>
      </div>
    </div>
  );
};

export default Chat; 