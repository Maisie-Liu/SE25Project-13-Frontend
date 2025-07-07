import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
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
import { 
  fetchCommentMessages, 
  markMessageAsRead, 
  markAllMessagesByTypeAsRead,
  fetchUnreadMessagesByTypeCount
} from '../store/actions/messageActions';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const MessageComments = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [commentMessages, setCommentMessages] = useState([]);
  const [filter, setFilter] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [unreadCount, setUnreadCount] = useState(0);
  
  // 获取评论消息
  useEffect(() => {
    const loadCommentMessages = async () => {
      setLoading(true);
      try {
        console.log('开始获取评论消息，页码:', pagination.current - 1, '每页数量:', pagination.pageSize);
        const result = await dispatch(fetchCommentMessages(pagination.current - 1, pagination.pageSize));
        console.log('fetchCommentMessages返回结果:', result);
        const response = result.payload || result;
        console.log('处理后的响应数据:', response);
        
        // 处理嵌套的响应格式
        if (response && response.code === 200 && response.data) {
          console.log('评论消息内容:', response.data);
          // 使用response.data中的数据
          setCommentMessages(response.data.list || []);
          setPagination({
            ...pagination,
            total: response.data.total || 0
          });
          console.log('更新分页信息，总数:', response.data.total);
        } else {
          console.error('响应数据格式不正确:', response);
          message.error('获取数据格式错误');
        }
        
        // 获取未读消息数量
        const unreadResult = await dispatch(fetchUnreadMessagesByTypeCount('COMMENT'));
        const unreadResponse = unreadResult.payload || unreadResult;
        if (unreadResponse && unreadResponse.data !== undefined) {
          setUnreadCount(unreadResponse.data);
        }
      } catch (error) {
        console.error('获取评论消息失败:', error);
        message.error('获取评论消息失败');
      } finally {
        setLoading(false);
      }
    };
    
    loadCommentMessages();
  }, [dispatch, pagination.current, pagination.pageSize]);
  
  // 标记为已读
  const markAsRead = async (messageId) => {
    try {
      await dispatch(markMessageAsRead(messageId));
      
      // 更新本地状态
      setCommentMessages(prev => 
        prev.map(msg => msg.id === messageId ? {...msg, read: true} : msg)
      );
      
      // 更新未读数量
      setUnreadCount(prev => Math.max(0, prev - 1));
      
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
          (msg.content && msg.content.includes(keyword)) || 
          (msg.itemName && msg.itemName.includes(keyword)) ||
          (msg.sender && msg.sender.username && msg.sender.username.includes(keyword))
      );
    }
    
    // 按时间排序
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };
  
  const filteredMessages = getFilteredMessages();
  const readCount = commentMessages.filter(msg => msg.read).length;
  const totalCount = commentMessages.length;
  
  // 所有评论消息标为已读
  const markAllAsRead = async () => {
    if (unreadCount === 0) return;
    
    try {
      await dispatch(markAllMessagesByTypeAsRead('COMMENT'));
      
      // 更新本地状态
      setCommentMessages(prev => 
        prev.map(msg => ({...msg, read: true}))
      );
      setUnreadCount(0);
      
      message.success('已将所有评论消息标记为已读');
    } catch (error) {
      console.error('标记全部已读失败:', error);
      message.error('标记全部已读失败');
    }
  };
  
  // 查看物品详情
  const viewItemDetail = (itemId) => {
    if (itemId) {
      navigate(`/items/${itemId}`);
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
                          src={item.sender?.avatarUrl} 
                          icon={<UserOutlined />} 
                          size="large"
                        />
                        <div className="comment-message-user-info">
                          <Text strong>{item.sender?.username || '未知用户'}</Text>
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
                        onClick={() => viewItemDetail(item.itemId)}
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
                          src={item.itemImage || 'https://via.placeholder.com/60?text=No+Image'} 
                          alt={item.itemName || '物品'} 
                          className="comment-message-image"
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                        <div className="comment-message-item-details">
                          <Text strong ellipsis style={{ maxWidth: '100%' }}>{item.itemName || '未命名物品'}</Text>
                          <Text type="danger">¥{item.itemPrice || '暂无价格'}</Text>
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