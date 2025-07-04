import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Typography, 
  Card, 
  Badge, 
  Avatar, 
  Button, 
  Row, 
  Col, 
  Spin, 
  Empty, 
  message as antMessage
} from 'antd';
import { 
  BellOutlined, 
  CommentOutlined, 
  HeartOutlined, 
  ShoppingOutlined, 
  MessageOutlined, 
  RightOutlined 
} from '@ant-design/icons';
import { format, formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

import { 
  fetchAllMessages, 
  fetchUnreadMessagesByTypeCount 
} from '../store/actions/messageActions';
import { 
  selectUnreadCommentCount,
  selectUnreadFavoriteCount,
  selectUnreadOrderCount,
  selectUnreadChatCount,
  selectMessageLoading
} from '../store/slices/messageSlice';

import './Messages.css';

const { Title, Text } = Typography;

const Messages = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // 从Redux获取状态
  const loading = useSelector(selectMessageLoading);
  const unreadCommentCount = useSelector(selectUnreadCommentCount);
  const unreadFavoriteCount = useSelector(selectUnreadFavoriteCount);
  const unreadOrderCount = useSelector(selectUnreadOrderCount);
  const unreadChatCount = useSelector(selectUnreadChatCount);
  
  const [commentMessages, setCommentMessages] = useState([]);
  const [favoriteMessages, setFavoriteMessages] = useState([]);
  const [orderMessages, setOrderMessages] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log('开始获取消息数据...');
        
        // 获取所有消息
        const result = await dispatch(fetchAllMessages());
        console.log('fetchAllMessages 返回结果:', result);
        
        // 检查返回结果的结构
        const messagesData = result.payload || result;
        console.log('处理后的消息数据:', messagesData);
        
        if (messagesData && messagesData.data && messagesData.data.list) {
          // 后端返回的数据结构是 { code: 200, data: { list: [], total: 0 } }
          const messages = messagesData.data.list;
          console.log('消息列表:', messages);
          
          // 获取各类型未读消息数量
          await dispatch(fetchUnreadMessagesByTypeCount('COMMENT'));
          await dispatch(fetchUnreadMessagesByTypeCount('FAVORITE'));
          await dispatch(fetchUnreadMessagesByTypeCount('ORDER'));
          await dispatch(fetchUnreadMessagesByTypeCount('CHAT'));
          
          // 按类型分类消息
          const comments = messages.filter(msg => msg.messageType === 'COMMENT');
          const favorites = messages.filter(msg => msg.messageType === 'FAVORITE');
          const orders = messages.filter(msg => msg.messageType === 'ORDER');
          const chats = messages.filter(msg => msg.messageType === 'CHAT');
          
          console.log('分类后的消息:', {
            comments: comments.length,
            favorites: favorites.length,
            orders: orders.length,
            chats: chats.length
          });
          
          setCommentMessages(comments);
          setFavoriteMessages(favorites);
          setOrderMessages(orders);
          setChatMessages(chats);
        } else if (messagesData && messagesData.list) {
          // 兼容旧的数据结构
          const messages = messagesData.list;
          console.log('使用旧数据结构，消息列表:', messages);
          
          // 获取各类型未读消息数量
          await dispatch(fetchUnreadMessagesByTypeCount('COMMENT'));
          await dispatch(fetchUnreadMessagesByTypeCount('FAVORITE'));
          await dispatch(fetchUnreadMessagesByTypeCount('ORDER'));
          await dispatch(fetchUnreadMessagesByTypeCount('CHAT'));
          
          // 按类型分类消息
          const comments = messages.filter(msg => msg.messageType === 'COMMENT');
          const favorites = messages.filter(msg => msg.messageType === 'FAVORITE');
          const orders = messages.filter(msg => msg.messageType === 'ORDER');
          const chats = messages.filter(msg => msg.messageType === 'CHAT');
          
          setCommentMessages(comments);
          setFavoriteMessages(favorites);
          setOrderMessages(orders);
          setChatMessages(chats);
        } else {
          console.log('没有找到消息数据，使用空数组');
          setCommentMessages([]);
          setFavoriteMessages([]);
          setOrderMessages([]);
          setChatMessages([]);
        }
      } catch (error) {
        console.error('获取消息失败:', error);
        antMessage.error('获取消息失败');
        // 设置空数组，避免页面崩溃
        setCommentMessages([]);
        setFavoriteMessages([]);
        setOrderMessages([]);
        setChatMessages([]);
      }
    };
    
    fetchMessages();
  }, [dispatch]);
  
  // 获取最新消息
  const getLatestMessage = (messages) => {
    if (!messages || messages.length === 0) return null;
    return messages[0];
  };
  
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
  
  // 渲染消息块
  const renderMessageBlock = (title, icon, unreadCount, color, latestMessage, onClick) => {
    return (
      <Card 
        className="message-block" 
        onClick={onClick}
        hoverable
      >
        <div className="message-block-header">
          <div className="message-block-title">
            <Badge count={unreadCount > 0 ? unreadCount : null} overflowCount={99} offset={[5, 0]}>
              <div className="message-icon" style={{ backgroundColor: color }}>
                {icon}
              </div>
            </Badge>
            <Title level={4}>{title}</Title>
          </div>
        </div>
        
        <div className="message-block-content">
          {latestMessage ? (
            <div className="message-block-latest">
              <div className="message-block-user">
                {latestMessage.sender && (
                  <Avatar src={latestMessage.sender.avatarUrl} size="small" style={{ marginRight: '8px' }} />
                )}
                <Text strong>
                  {latestMessage.sender ? latestMessage.sender.username : '系统消息'}
                </Text>
                <Text type="secondary" style={{ marginLeft: '10px', fontSize: '12px' }}>
                  {latestMessage.createdAt ? formatTime(latestMessage.createdAt) : ''}
                </Text>
              </div>
              
              <div className="message-block-text">
                {latestMessage.messageType === 'COMMENT' && (
                  <Text>
                    评论了您的物品
                    {latestMessage.itemName ? `「${latestMessage.itemName}」` : ''}
                    {latestMessage.content ? `: “${latestMessage.content}”` : ''}
                  </Text>
                )}
                {latestMessage.messageType === 'FAVORITE' && (
                  <Text>
                    收藏了您的物品
                    {latestMessage.itemName ? `「${latestMessage.itemName}」` : ''}
                  </Text>
                )}
                {latestMessage.messageType === 'ORDER' && (
                  <Text>
                    订单{latestMessage.orderId ? ` #${latestMessage.orderId}` : ''} {latestMessage.statusText || ''}
                  </Text>
                )}
                {latestMessage.messageType === 'CHAT' && (
                  <Text>
                    关于物品{latestMessage.itemName ? `「${latestMessage.itemName}」` : ''}
                    {latestMessage.content ? `: “${latestMessage.content}”` : ''}
                  </Text>
                )}
              </div>
              
              {latestMessage.itemImage && (
                <div className="message-block-item">
                  <img src={latestMessage.itemImage} alt={latestMessage.itemName || '物品图片'} className="message-item-thumbnail" />
                  <Text ellipsis style={{ maxWidth: '120px' }}>{latestMessage.itemName || '未命名物品'}</Text>
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
    </div>
  );
};

export default Messages; 