import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Button, 
  Empty, 
  Spin, 
  Card, 
  Avatar, 
  List,
  Badge,
  Tag,
  Space,
  Input,
  message,
  Tooltip,
  Divider
} from 'antd';
import { 
  ArrowLeftOutlined, 
  MessageOutlined,
  CommentOutlined,
  EyeOutlined,
  SearchOutlined,
  UserOutlined,
  ShopOutlined
} from '@ant-design/icons';
import { format, formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import axios from '../utils/axios';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const MessageChats = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [keyword, setKeyword] = useState('');
  
  // 模拟获取聊天消息
  useEffect(() => {
    const fetchChatMessages = async () => {
      setLoading(true);
      try {
        // 模拟数据
        const mockChatMessages = [
          {
            id: 1,
            type: 'chat',
            chatId: 401,
            lastMessage: '这个物品还在吗？',
            fromUser: {
              id: 201,
              username: '赵六',
              avatar: 'https://via.placeholder.com/40'
            },
            unreadCount: 2,
            createdAt: new Date(Date.now() - 1000 * 60 * 20),
            itemId: 106,
            itemName: '键盘',
            itemImage: 'https://via.placeholder.com/50',
            itemPrice: 199
          },
          {
            id: 2,
            type: 'chat',
            chatId: 402,
            lastMessage: '好的，我明天来取',
            fromUser: {
              id: 202,
              username: '孙七',
              avatar: 'https://via.placeholder.com/40'
            },
            unreadCount: 0,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
            itemId: 107,
            itemName: '显示器',
            itemImage: 'https://via.placeholder.com/50',
            itemPrice: 599
          },
          {
            id: 3,
            type: 'chat',
            chatId: 403,
            lastMessage: '可以便宜一点吗？',
            fromUser: {
              id: 203,
              username: '王五',
              avatar: 'https://via.placeholder.com/40'
            },
            unreadCount: 1,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
            itemId: 108,
            itemName: '自行车',
            itemImage: 'https://via.placeholder.com/50',
            itemPrice: 350
          },
          {
            id: 4,
            type: 'chat',
            chatId: 404,
            lastMessage: '谢谢，已收到',
            fromUser: {
              id: 204,
              username: '李四',
              avatar: 'https://via.placeholder.com/40'
            },
            unreadCount: 0,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
            itemId: 109,
            itemName: '手机壳',
            itemImage: 'https://via.placeholder.com/50',
            itemPrice: 25
          }
        ];
        
        setChatMessages(mockChatMessages);
      } catch (error) {
        console.error('获取聊天消息失败:', error);
        message.error('获取聊天消息失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchChatMessages();
  }, []);
  
  // 标记为已读
  const markAsRead = async (id) => {
    try {
      // 实际应该调用API
      console.log(`标记消息 ${id} 为已读`);
      
      // 更新本地状态
      setChatMessages(prev => 
        prev.map(msg => msg.id === id ? {...msg, unreadCount: 0} : msg)
      );
    } catch (error) {
      console.error('标记已读失败:', error);
      message.error('标记已读失败');
    }
  };
  
  // 格式化时间
  const formatTime = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: zhCN });
    } catch (error) {
      const d = new Date(date);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
    }
  };
  
  // 过滤消息
  const getFilteredMessages = () => {
    let filtered = [...chatMessages];
    
    // 按关键词搜索
    if (keyword) {
      filtered = filtered.filter(
        msg => 
          msg.lastMessage.includes(keyword) ||
          msg.itemName.includes(keyword) ||
          msg.fromUser.username.includes(keyword)
      );
    }
    
    // 按时间排序
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };
  
  const filteredMessages = getFilteredMessages();
  const totalUnreadCount = chatMessages.reduce((total, msg) => total + msg.unreadCount, 0);
  
  return (
    <div className="message-detail-page">
      <div className="message-detail-header">
        <Button 
          type="link" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/my/messages')}
          style={{ padding: 0 }}
        />
        <Title level={3} className="message-detail-title">
          <MessageOutlined /> 私聊消息
          {totalUnreadCount > 0 && (
            <Badge count={totalUnreadCount} style={{ marginLeft: '10px', backgroundColor: '#722ed1' }} />
          )}
        </Title>
      </div>
      
      <div className="message-detail-filter">
        <div className="chat-filter-left">
          <Button 
            type="primary" 
            icon={<MessageOutlined />}
            disabled={totalUnreadCount === 0}
            onClick={() => {
              // 标记所有为已读
              chatMessages.forEach(msg => {
                if (msg.unreadCount > 0) {
                  markAsRead(msg.id);
                }
              });
              message.success('已将所有消息标记为已读');
            }}
          >
            全部标为已读
          </Button>
        </div>
        
        <Search 
          placeholder="搜索消息内容、物品或用户" 
          allowClear 
          onSearch={value => setKeyword(value)} 
          style={{ width: 250 }} 
        />
      </div>
      
      <div className="message-detail-list chat-message-list">
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : filteredMessages.length > 0 ? (
          <List
            dataSource={filteredMessages}
            renderItem={item => (
              <Card 
                className="chat-message-card"
                key={item.id}
                hoverable
                onClick={() => navigate(`/chat/${item.chatId}`)}
              >
                <div className="chat-message-header">
                  <div className="chat-message-user">
                    <Badge count={item.unreadCount} offset={[-5, 5]}>
                      <Avatar 
                        src={item.fromUser.avatar} 
                        icon={<UserOutlined />} 
                        size={50}
                      />
                    </Badge>
                    <div className="chat-message-user-info">
                      <Text strong>{item.fromUser.username}</Text>
                      <Text type="secondary" className="chat-message-time">{formatTime(item.createdAt)}</Text>
                    </div>
                  </div>
                </div>
                
                <div className="chat-message-content">
                  <div className="chat-message-bubble">
                    <Text>{item.lastMessage}</Text>
                  </div>
                  
                  <Divider style={{ margin: '12px 0' }} />
                  
                  <div className="chat-message-item-info">
                    <img src={item.itemImage} alt={item.itemName} className="chat-message-image" />
                    <div className="chat-message-item-details">
                      <Text strong ellipsis style={{ maxWidth: '100%' }}>{item.itemName}</Text>
                      <Text type="danger">¥{item.itemPrice}</Text>
                    </div>
                  </div>
                </div>
                
                <div className="chat-message-footer">
                  <Space>
                    {item.unreadCount > 0 && (
                      <Tooltip title="标记为已读">
                        <Button 
                          icon={<EyeOutlined />} 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(item.id);
                          }}
                        >
                          标记已读
                        </Button>
                      </Tooltip>
                    )}
                    <Tooltip title="回复消息">
                      <Button 
                        type="primary" 
                        icon={<CommentOutlined />}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/chat/${item.chatId}`);
                        }}
                      >
                        回复
                      </Button>
                    </Tooltip>
                    <Tooltip title="查看物品">
                      <Button 
                        icon={<ShopOutlined />}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/items/${item.itemId}`);
                        }}
                      >
                        查看物品
                      </Button>
                    </Tooltip>
                  </Space>
                </div>
              </Card>
            )}
          />
        ) : (
          <Empty description="暂无聊天消息" />
        )}
      </div>
    </div>
  );
};

export default MessageChats; 