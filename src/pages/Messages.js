import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Badge, 
  Avatar, 
  Empty,
  Button,
  Tag,
  Spin,
  message,
  Divider,
  Statistic
} from 'antd';
import {
  CommentOutlined,
  HeartOutlined,
  ShoppingOutlined,
  MessageOutlined,
  UserOutlined,
  RightOutlined,
  BellOutlined,
  FileTextOutlined,
  TeamOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { selectUser } from '../store/slices/authSlice';
import { format, formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const { Title, Text, Paragraph } = Typography;

const Messages = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [commentMessages, setCommentMessages] = useState([]);
  const [favoriteMessages, setFavoriteMessages] = useState([]);
  const [orderMessages, setOrderMessages] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const user = useSelector(selectUser);

  // 模拟获取消息数据
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        // 实际项目中这里应该调用API获取真实数据
        // 这里只是模拟数据，实际使用时请替换为真实API调用
        
        // 模拟评论消息
        const mockCommentMessages = [
          {
            id: 1,
            type: 'comment',
            itemId: 101,
            itemName: 'iPhone 13 128G',
            itemImage: 'https://via.placeholder.com/50',
            content: '这个手机怎么样，用着好吗？',
            fromUser: {
              id: 201,
              username: '张三',
              avatar: 'https://via.placeholder.com/40'
            },
            createdAt: new Date(Date.now() - 1000 * 60 * 30),
            read: false
          },
          {
            id: 2,
            type: 'comment',
            itemId: 102,
            itemName: '二手自行车',
            itemImage: 'https://via.placeholder.com/50',
            content: '还能便宜一点吗？',
            fromUser: {
              id: 202,
              username: '李四',
              avatar: 'https://via.placeholder.com/40'
            },
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
            read: true
          }
        ];
        
        // 模拟收藏消息
        const mockFavoriteMessages = [
          {
            id: 3,
            type: 'favorite',
            itemId: 101,
            itemName: 'iPhone 13 128G',
            itemImage: 'https://via.placeholder.com/50',
            fromUser: {
              id: 203,
              username: '王五',
              avatar: 'https://via.placeholder.com/40'
            },
            createdAt: new Date(Date.now() - 1000 * 60 * 60),
            read: false
          }
        ];
        
        // 模拟订单消息
        const mockOrderMessages = [
          {
            id: 4,
            type: 'order_created',
            orderId: 301,
            itemId: 103,
            itemName: '大学教材',
            itemImage: 'https://via.placeholder.com/50',
            price: 45,
            status: 'created',
            statusText: '已创建',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
            read: false
          },
          {
            id: 5,
            type: 'order_paid',
            orderId: 302,
            itemId: 104,
            itemName: '篮球鞋',
            itemImage: 'https://via.placeholder.com/50',
            price: 120,
            status: 'paid',
            statusText: '已支付',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
            read: true
          }
        ];
        
        // 模拟私聊消息
        const mockChatMessages = [
          {
            id: 7,
            type: 'chat',
            chatId: 401,
            lastMessage: '这个物品还在吗？',
            fromUser: {
              id: 204,
              username: '赵六',
              avatar: 'https://via.placeholder.com/40'
            },
            unreadCount: 2,
            createdAt: new Date(Date.now() - 1000 * 60 * 20),
            itemId: 106,
            itemName: '键盘',
            itemImage: 'https://via.placeholder.com/50'
          },
          {
            id: 8,
            type: 'chat',
            chatId: 402,
            lastMessage: '好的，我明天来取',
            fromUser: {
              id: 205,
              username: '孙七',
              avatar: 'https://via.placeholder.com/40'
            },
            unreadCount: 0,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
            itemId: 107,
            itemName: '显示器',
            itemImage: 'https://via.placeholder.com/50'
          }
        ];
        
        // 设置消息数据
        setCommentMessages(mockCommentMessages);
        setFavoriteMessages(mockFavoriteMessages);
        setOrderMessages(mockOrderMessages);
        setChatMessages(mockChatMessages);
      } catch (error) {
        console.error('获取消息失败:', error);
        message.error('获取消息失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, []);
  
  // 格式化时间
  const formatTime = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: zhCN });
    } catch (error) {
      // 如果date-fns报错，使用简单的日期格式化
      const d = new Date(date);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
    }
  };
  
  // 获取最新一条消息
  const getLatestMessage = (messages) => {
    if (!messages || messages.length === 0) return null;
    return messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  };
  
  // 计算未读消息数
  const unreadCommentCount = commentMessages.filter(msg => !msg.read).length;
  const unreadFavoriteCount = favoriteMessages.filter(msg => !msg.read).length;
  const unreadOrderCount = orderMessages.filter(msg => !msg.read).length;
  const unreadChatCount = chatMessages.reduce((sum, msg) => sum + msg.unreadCount, 0);
  
  // 消息区块渲染
  const renderMessageBlock = (title, icon, count, color, latestMessage, onClick) => {
    return (
      <Card 
        className="message-block-card" 
        onClick={onClick}
        hoverable
      >
        <div className="message-block-header">
          <div className="message-block-title">
            {React.cloneElement(icon, { style: { fontSize: '24px', color } })}
            <Title level={4} style={{ margin: '0 0 0 10px' }}>{title}</Title>
          </div>
          {count > 0 && (
            <Badge count={count} style={{ backgroundColor: color }} />
          )}
        </div>
        
        <Divider style={{ margin: '12px 0' }} />
        
        <div className="message-block-content">
          {latestMessage ? (
            <div className="message-block-latest">
              <div className="message-block-user">
                {latestMessage.fromUser && (
                  <Avatar src={latestMessage.fromUser.avatar} size="small" style={{ marginRight: '8px' }} />
                )}
                <Text strong>
                  {latestMessage.fromUser ? latestMessage.fromUser.username : '系统消息'}
                </Text>
                <Text type="secondary" style={{ marginLeft: '10px', fontSize: '12px' }}>
                  {formatTime(latestMessage.createdAt)}
                </Text>
              </div>
              
              <div className="message-block-text">
                {latestMessage.type === 'comment' && (
                  <Text>"{latestMessage.content}"</Text>
                )}
                {latestMessage.type === 'favorite' && (
                  <Text>收藏了你的物品 "{latestMessage.itemName}"</Text>
                )}
                {latestMessage.type.startsWith('order_') && (
                  <Text>
                    订单 #{latestMessage.orderId} {latestMessage.statusText}
                    <Tag color={latestMessage.status === 'created' ? 'blue' : latestMessage.status === 'paid' ? 'green' : 'cyan'} style={{ marginLeft: '5px' }}>
                      ¥{latestMessage.price}
                    </Tag>
                  </Text>
                )}
                {latestMessage.type === 'chat' && (
                  <Text>"{latestMessage.lastMessage}"</Text>
                )}
              </div>
              
              {latestMessage.itemImage && (
                <div className="message-block-item">
                  <img src={latestMessage.itemImage} alt={latestMessage.itemName} className="message-item-thumbnail" />
                  <Text ellipsis style={{ maxWidth: '120px' }}>{latestMessage.itemName}</Text>
                </div>
              )}
            </div>
          ) : (
            <Empty description="暂无消息" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>
        
        <div className="message-block-footer">
          <Button type="primary" shape="round" icon={<RightOutlined />}>查看全部</Button>
        </div>
      </Card>
    );
  };
  
  return (
    <div className="messages-page">
      <div className="page-header">
        <Title level={2}>
          <BellOutlined /> 我的消息
          <Text type="secondary" style={{ fontSize: '16px', marginLeft: '10px' }}>
            ({unreadCommentCount + unreadFavoriteCount + unreadOrderCount + unreadChatCount})
          </Text>
        </Title>
      </div>
      
      {loading ? (
        <div className="messages-loading">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={24} md={12} lg={12}>
            {renderMessageBlock(
              '评论消息', 
              <CommentOutlined />, 
              unreadCommentCount, 
              '#1890ff',
              getLatestMessage(commentMessages),
              () => navigate('/my/messages/comments')
            )}
          </Col>
          
          <Col xs={24} sm={24} md={12} lg={12}>
            {renderMessageBlock(
              '收藏消息', 
              <HeartOutlined />, 
              unreadFavoriteCount, 
              '#ff4d4f',
              getLatestMessage(favoriteMessages),
              () => navigate('/my/messages/favorites')
            )}
          </Col>
          
          <Col xs={24} sm={24} md={12} lg={12}>
            {renderMessageBlock(
              '订单消息', 
              <ShoppingOutlined />, 
              unreadOrderCount, 
              '#52c41a',
              getLatestMessage(orderMessages),
              () => navigate('/my/messages/orders')
            )}
          </Col>
          
          <Col xs={24} sm={24} md={12} lg={12}>
            {renderMessageBlock(
              '私聊消息', 
              <MessageOutlined />, 
              unreadChatCount, 
              '#722ed1',
              getLatestMessage(chatMessages),
              () => navigate('/my/messages/chats')
            )}
          </Col>
        </Row>
      )}
      
      <div className="messages-summary">
        <Card className="messages-stats-card">
          <Row gutter={16}>
            <Col span={6}>
              <Statistic 
                title="总消息数" 
                value={commentMessages.length + favoriteMessages.length + orderMessages.length + chatMessages.length} 
                prefix={<FileTextOutlined />} 
              />
            </Col>
            <Col span={6}>
              <Statistic 
                title="未读消息" 
                value={unreadCommentCount + unreadFavoriteCount + unreadOrderCount + unreadChatCount} 
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<BellOutlined />} 
              />
            </Col>
            <Col span={6}>
              <Statistic 
                title="互动用户" 
                value={new Set([
                  ...commentMessages.map(m => m.fromUser?.id),
                  ...favoriteMessages.map(m => m.fromUser?.id),
                  ...chatMessages.map(m => m.fromUser?.id)
                ].filter(Boolean)).size} 
                prefix={<TeamOutlined />} 
              />
            </Col>
            <Col span={6}>
              <Statistic 
                title="涉及物品" 
                value={new Set([
                  ...commentMessages.map(m => m.itemId),
                  ...favoriteMessages.map(m => m.itemId),
                  ...orderMessages.map(m => m.itemId),
                  ...chatMessages.map(m => m.itemId)
                ].filter(Boolean)).size}
                prefix={<ShoppingOutlined />} 
              />
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default Messages; 