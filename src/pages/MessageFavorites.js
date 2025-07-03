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
  Radio,
  Input,
  message,
  Tooltip
} from 'antd';
import { 
  ArrowLeftOutlined, 
  HeartOutlined,
  HeartFilled,
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

const MessageFavorites = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [favoriteMessages, setFavoriteMessages] = useState([]);
  const [filter, setFilter] = useState('all');
  const [keyword, setKeyword] = useState('');
  
  // 模拟获取收藏消息
  useEffect(() => {
    const fetchFavoriteMessages = async () => {
      setLoading(true);
      try {
        // 模拟数据
        const mockFavoriteMessages = [
          {
            id: 1,
            type: 'favorite',
            itemId: 101,
            itemName: 'iPhone 13 128G',
            itemImage: 'https://via.placeholder.com/50',
            itemPrice: 4999,
            fromUser: {
              id: 201,
              username: '王五',
              avatar: 'https://via.placeholder.com/40'
            },
            createdAt: new Date(Date.now() - 1000 * 60 * 30),
            read: false
          },
          {
            id: 2,
            type: 'favorite',
            itemId: 102,
            itemName: '二手自行车',
            itemImage: 'https://via.placeholder.com/50',
            itemPrice: 350,
            fromUser: {
              id: 202,
              username: '李四',
              avatar: 'https://via.placeholder.com/40'
            },
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
            read: true
          },
          {
            id: 3,
            type: 'favorite',
            itemId: 103,
            itemName: '大学教材',
            itemImage: 'https://via.placeholder.com/50',
            itemPrice: 45,
            fromUser: {
              id: 203,
              username: '张三',
              avatar: 'https://via.placeholder.com/40'
            },
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
            read: true
          }
        ];
        
        setFavoriteMessages(mockFavoriteMessages);
      } catch (error) {
        console.error('获取收藏消息失败:', error);
        message.error('获取收藏消息失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFavoriteMessages();
  }, []);
  
  // 标记为已读
  const markAsRead = async (id) => {
    try {
      // 实际应该调用API
      console.log(`标记消息 ${id} 为已读`);
      
      // 更新本地状态
      setFavoriteMessages(prev => 
        prev.map(msg => msg.id === id ? {...msg, read: true} : msg)
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
    let filtered = [...favoriteMessages];
    
    // 按已读/未读筛选
    if (filter === 'unread') {
      filtered = filtered.filter(msg => !msg.read);
    } else if (filter === 'read') {
      filtered = filtered.filter(msg => msg.read);
    }
    
    // 按关键词搜索
    if (keyword) {
      filtered = filtered.filter(
        msg => 
          msg.itemName.includes(keyword) ||
          msg.fromUser.username.includes(keyword)
      );
    }
    
    // 按时间排序
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };
  
  const filteredMessages = getFilteredMessages();
  const unreadCount = favoriteMessages.filter(msg => !msg.read).length;
  
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
          <HeartOutlined /> 收藏消息
          {unreadCount > 0 && (
            <Badge count={unreadCount} style={{ marginLeft: '10px', backgroundColor: '#ff4d4f' }} />
          )}
        </Title>
      </div>
      
      <div className="message-detail-filter">
        <Radio.Group value={filter} onChange={e => setFilter(e.target.value)}>
          <Radio.Button value="all">全部</Radio.Button>
          <Radio.Button value="unread">未读</Radio.Button>
          <Radio.Button value="read">已读</Radio.Button>
        </Radio.Group>
        
        <Search 
          placeholder="搜索物品或用户" 
          allowClear 
          onSearch={value => setKeyword(value)} 
          style={{ width: 250 }} 
        />
      </div>
      
      <div className="message-detail-list favorite-message-list">
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : filteredMessages.length > 0 ? (
          <List
            grid={{ 
              gutter: 16, 
              xs: 1, 
              sm: 1, 
              md: 2, 
              lg: 2, 
              xl: 3, 
              xxl: 3 
            }}
            dataSource={filteredMessages}
            renderItem={item => (
              <List.Item>
                <Card 
                  className={`favorite-message-card ${!item.read ? 'unread' : ''}`}
                  hoverable
                  onClick={() => !item.read && markAsRead(item.id)}
                >
                  <div className="favorite-message-header">
                    <div className="favorite-message-user">
                      <Avatar src={item.fromUser.avatar} icon={<UserOutlined />} />
                      <div className="favorite-message-user-info">
                        <Text strong>{item.fromUser.username}</Text>
                        <Text type="secondary" className="favorite-time">{formatTime(item.createdAt)}</Text>
                      </div>
                    </div>
                    {!item.read && (
                      <Badge status="processing" color="#ff4d4f" />
                    )}
                  </div>
                  
                  <div className="favorite-message-content">
                    <div className="favorite-message-action">
                      <HeartFilled style={{ color: '#ff4d4f', fontSize: '22px' }} />
                      <Text style={{ marginLeft: '8px' }}>收藏了你的物品</Text>
                    </div>
                    
                    <div className="favorite-message-item-info">
                      <img src={item.itemImage} alt={item.itemName} className="favorite-message-image" />
                      <div className="favorite-message-item-details">
                        <Text strong ellipsis>{item.itemName}</Text>
                        <Text type="danger">¥{item.itemPrice}</Text>
                      </div>
                    </div>
                  </div>
                  
                  <div className="favorite-message-footer">
                    {!item.read && (
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
                    <Tooltip title="查看物品详情">
                      <Button 
                        type="primary" 
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
                  </div>
                </Card>
              </List.Item>
            )}
          />
        ) : (
          <Empty description="暂无收藏消息" />
        )}
      </div>
    </div>
  );
};

export default MessageFavorites;