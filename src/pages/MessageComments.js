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
  Tooltip,
  Divider,
  Row,
  Col,
  Statistic
} from 'antd';
import { 
  ArrowLeftOutlined, 
  CommentOutlined,
  EyeOutlined,
  SearchOutlined,
  UserOutlined,
  ShopOutlined,
  MessageOutlined,
  UnorderedListOutlined,
  FieldTimeOutlined
} from '@ant-design/icons';
import { format, formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import axios from '../utils/axios';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const MessageComments = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [commentMessages, setCommentMessages] = useState([]);
  const [filter, setFilter] = useState('all');
  const [keyword, setKeyword] = useState('');
  
  // 模拟获取评论消息
  useEffect(() => {
    const fetchCommentMessages = async () => {
      setLoading(true);
      try {
        // 模拟数据
        const mockCommentMessages = [
          {
            id: 1,
            type: 'comment',
            itemId: 101,
            itemName: 'iPhone 13 128G',
            itemImage: 'https://via.placeholder.com/50',
            itemPrice: 4999,
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
            itemPrice: 350,
            content: '还能便宜一点吗？',
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
            type: 'comment',
            itemId: 103,
            itemName: '大学教材',
            itemImage: 'https://via.placeholder.com/50',
            itemPrice: 45,
            content: '这本书是哪个版本的？',
            fromUser: {
              id: 203,
              username: '王五',
              avatar: 'https://via.placeholder.com/40'
            },
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
            read: true
          },
          {
            id: 4,
            type: 'comment',
            itemId: 104,
            itemName: '耳机',
            itemImage: 'https://via.placeholder.com/50',
            itemPrice: 89,
            content: '音质怎么样？适合听什么类型的音乐？',
            fromUser: {
              id: 204,
              username: '赵六',
              avatar: 'https://via.placeholder.com/40'
            },
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
            read: false
          }
        ];
        
        setCommentMessages(mockCommentMessages);
      } catch (error) {
        console.error('获取评论消息失败:', error);
        message.error('获取评论消息失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCommentMessages();
  }, []);
  
  // 标记为已读
  const markAsRead = async (id) => {
    try {
      // 实际应该调用API
      console.log(`标记消息 ${id} 为已读`);
      
      // 更新本地状态
      setCommentMessages(prev => 
        prev.map(msg => msg.id === id ? {...msg, read: true} : msg)
      );
      message.success('已标记为已读');
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
  
  const formatDate = (date) => {
    try {
      return format(new Date(date), 'yyyy-MM-dd HH:mm');
    } catch (error) {
      const d = new Date(date);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
    }
  };
  
  // 过滤消息
  const getFilteredMessages = () => {
    let filtered = [...commentMessages];
    
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
          msg.content.includes(keyword) || 
          msg.itemName.includes(keyword) ||
          msg.fromUser.username.includes(keyword)
      );
    }
    
    // 按时间排序
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };
  
  const filteredMessages = getFilteredMessages();
  const unreadCount = commentMessages.filter(msg => !msg.read).length;
  const readCount = commentMessages.filter(msg => msg.read).length;
  const totalCount = commentMessages.length;
  
  // 所有评论消息标为已读
  const markAllAsRead = () => {
    if (unreadCount === 0) return;
    
    try {
      // 更新本地状态
      setCommentMessages(prev => 
        prev.map(msg => ({...msg, read: true}))
      );
      message.success('已将所有评论消息标记为已读');
    } catch (error) {
      console.error('标记全部已读失败:', error);
      message.error('标记全部已读失败');
    }
  };
  
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
          <CommentOutlined /> 评论消息
          {unreadCount > 0 && (
            <Badge count={unreadCount} style={{ marginLeft: '10px', backgroundColor: '#1890ff' }} />
          )}
        </Title>
      </div>
      
      {/* 消息统计面板 */}
      <Card className="message-statistics-card" style={{ marginBottom: '20px' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="总评论数"
              value={totalCount}
              prefix={<UnorderedListOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="未读评论"
              value={unreadCount}
              valueStyle={{ color: unreadCount > 0 ? '#ff4d4f' : '#1890ff' }}
              prefix={<CommentOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="最近评论"
              value={totalCount > 0 ? formatTime(commentMessages[0]?.createdAt) : '无'}
              prefix={<FieldTimeOutlined />}
            />
          </Col>
        </Row>
      </Card>
      
      <div className="message-detail-filter">
        <div className="filter-left">
          <Radio.Group value={filter} onChange={e => setFilter(e.target.value)}>
            <Radio.Button value="all">全部</Radio.Button>
            <Radio.Button value="unread">未读</Radio.Button>
            <Radio.Button value="read">已读</Radio.Button>
          </Radio.Group>
          
          <Tooltip title="将所有消息标记为已读">
            <Button 
              type="primary" 
              style={{ marginLeft: '10px' }}
              disabled={unreadCount === 0}
              onClick={markAllAsRead}
            >
              全部标为已读
            </Button>
          </Tooltip>
        </div>
        
        <Search 
          placeholder="搜索评论内容、物品或用户" 
          allowClear 
          onSearch={value => setKeyword(value)} 
          style={{ width: 250 }} 
          prefix={<SearchOutlined />}
        />
      </div>
      
      <div className="message-detail-list comment-message-list">
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
              md: 1, 
              lg: 1, 
              xl: 2, 
              xxl: 2 
            }}
            dataSource={filteredMessages}
            renderItem={item => (
              <List.Item>
                <Card 
                  className={`comment-message-card ${!item.read ? 'unread' : ''}`}
                  hoverable
                  title={
                    <div className="comment-message-header">
                      <div className="comment-message-user">
                        <Avatar 
                          src={item.fromUser.avatar} 
                          icon={<UserOutlined />} 
                          size="large"
                        />
                        <div className="comment-message-user-info">
                          <Text strong>{item.fromUser.username}</Text>
                          <Text type="secondary">{formatTime(item.createdAt)}</Text>
                        </div>
                      </div>
                      {!item.read && (
                        <Badge 
                          status="processing" 
                          color="#1890ff" 
                          text="未读" 
                        />
                      )}
                    </div>
                  }
                  extra={
                    <Tag color="blue">评论</Tag>
                  }
                  actions={[
                    !item.read ? (
                      <Tooltip title="标记为已读">
                        <Button 
                          type="text" 
                          icon={<EyeOutlined />} 
                          onClick={() => markAsRead(item.id)}
                        >
                          标记已读
                        </Button>
                      </Tooltip>
                    ) : (
                      <Text type="secondary">
                        <EyeOutlined /> 已读
                      </Text>
                    ),
                    <Tooltip title="回复评论">
                      <Button 
                        type="text" 
                        icon={<MessageOutlined />} 
                        onClick={() => navigate(`/comments/reply/${item.id}`)}
                      >
                        回复
                      </Button>
                    </Tooltip>,
                    <Tooltip title="查看物品">
                      <Button 
                        type="text" 
                        icon={<ShopOutlined />} 
                        onClick={() => navigate(`/items/${item.itemId}`)}
                      >
                        查看物品
                      </Button>
                    </Tooltip>
                  ]}
                >
                  <div className="comment-message-content">
                    <div className="comment-message-bubble">
                      <Paragraph 
                        style={{ 
                          fontSize: '16px', 
                          background: 'rgba(24, 144, 255, 0.1)', 
                          padding: '15px', 
                          borderRadius: '12px',
                          margin: 0,
                          boxShadow: !item.read ? '0 0 5px rgba(24, 144, 255, 0.3)' : 'none'
                        }}
                      >
                        {item.content}
                      </Paragraph>
                    </div>
                    
                    <Divider style={{ margin: '15px 0' }} />
                    
                    <div className="comment-message-item">
                      <div className="comment-message-item-info">
                        <img 
                          src={item.itemImage} 
                          alt={item.itemName} 
                          className="comment-message-image"
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                        <div className="comment-message-item-details">
                          <Text strong ellipsis style={{ maxWidth: '100%' }}>{item.itemName}</Text>
                          <Text type="danger">¥{item.itemPrice}</Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        ) : (
          <Empty 
            description="暂无评论消息" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </div>
    </div>
  );
};

export default MessageComments; 