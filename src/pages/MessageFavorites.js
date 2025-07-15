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
import { fetchFavoriteMessages, markMessageAsRead } from '../store/actions/messageActions';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const MessageFavorites = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [favoriteMessages, setFavoriteMessages] = useState([]);
  const [filter, setFilter] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  
  // 获取收藏消息
  useEffect(() => {
    const loadFavoriteMessages = async () => {
      setLoading(true);
      try {
        console.log('开始获取收藏消息，页码:', pagination.current - 1, '每页数量:', pagination.pageSize);
        const result = await dispatch(fetchFavoriteMessages(pagination.current - 1, pagination.pageSize));
        console.log('fetchFavoriteMessages返回结果:', result);
        const response = result.payload || result;
        console.log('处理后的响应数据:', response);
        
        // 处理嵌套的响应格式
        if (response && response.code === 200 && response.data) {
          console.log('收藏消息内容:', response.data);
          // 使用response.data中的数据
          setFavoriteMessages(response.data.list || []);
          setPagination({
            ...pagination,
            total: response.data.total || 0
          });
          console.log('更新分页信息，总数:', response.data.total);
        } else {
          console.error('响应数据格式不正确:', response);
          message.error('获取数据格式错误');
        }
      } catch (error) {
        console.error('获取收藏消息失败:', error);
        message.error('获取收藏消息失败');
      } finally {
        setLoading(false);
      }
    };
    
    loadFavoriteMessages();
  }, [dispatch, pagination.current, pagination.pageSize]);
  
  // 标记为已读
  const handleMarkAsRead = async (messageId) => {
    try {
      await dispatch(markMessageAsRead(messageId));
      
      // 更新本地状态
      setFavoriteMessages(prev => 
        prev.map(msg => msg.id === messageId ? {...msg, read: true} : msg)
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
          (msg.itemName && msg.itemName.includes(keyword)) ||
          (msg.sender && msg.sender.username && msg.sender.username.includes(keyword))
      );
    }
    
    // 按时间排序
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };
  
  const filteredMessages = getFilteredMessages();
  const unreadCount = favoriteMessages.filter(msg => !msg.read).length;
  
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
                  onClick={() => !item.read && handleMarkAsRead(item.id)}
                >
                  <div className="favorite-message-header">
                    <div className="favorite-message-user">
                      <Avatar src={item.sender?.avatarUrl} icon={<UserOutlined />} />
                      <div className="favorite-message-user-info">
                        <Text strong>{item.sender?.nickname || item.sender?.username || '未知用户'}</Text>
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
                      <Text style={{ marginLeft: '8px' }}>收藏了您的物品</Text>
                    </div>
                    
                    <div className="favorite-message-item-info">
                      <img 
                        src={item.itemImage || 'https://via.placeholder.com/50?text=No+Image'} 
                        alt={item.itemName || '物品'} 
                        className="favorite-message-image" 
                      />
                      <div className="favorite-message-item-details">
                        <Text strong ellipsis>{item.itemName || '未命名物品'}</Text>
                        <Text type="danger">¥{item.itemPrice || '暂无价格'}</Text>
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
                            handleMarkAsRead(item.id);
                          }}
                        >
                          标记已读
                        </Button>
                      </Tooltip>
                    )}
                    
                    <Tooltip title="查看物品">
                      <Button 
                        icon={<ShopOutlined />} 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          viewItemDetail(item.itemId);
                        }}
                      >
                        查看物品
                      </Button>
                    </Tooltip>
                  </div>
                </Card>
              </List.Item>
            )}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: (page, pageSize) => {
                setPagination({
                  ...pagination,
                  current: page,
                  pageSize: pageSize
                });
              },
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条消息`
            }}
          />
        ) : (
          <Empty 
            description="暂无收藏消息" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </div>
    </div>
  );
};

export default MessageFavorites;