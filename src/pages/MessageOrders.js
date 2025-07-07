import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  Typography, 
  Button, 
  Empty, 
  Spin, 
  Card, 
  Steps, 
  List,
  Badge,
  Tag,
  Space,
  Radio,
  Input,
  message,
  Timeline,
  Tooltip,
  Row,
  Col,
  Statistic
} from 'antd';
import { 
  ArrowLeftOutlined, 
  ShoppingOutlined,
  EyeOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  CarOutlined,
  ShopOutlined,
  FileSearchOutlined,
  UnorderedListOutlined,
  FieldTimeOutlined
} from '@ant-design/icons';
import { format, formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { 
  fetchOrderMessages, 
  markMessageAsRead, 
  markAllMessagesByTypeAsRead,
  fetchUnreadMessagesByTypeCount
} from '../store/actions/messageActions';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Step } = Steps;

const MessageOrders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [orderMessages, setOrderMessages] = useState([]);
  const [filter, setFilter] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [unreadCount, setUnreadCount] = useState(0);
  
  // 获取订单消息
  useEffect(() => {
    const loadOrderMessages = async () => {
      setLoading(true);
      try {
        console.log('开始获取订单消息，页码:', pagination.current - 1, '每页数量:', pagination.pageSize);
        const result = await dispatch(fetchOrderMessages(pagination.current - 1, pagination.pageSize));
        console.log('fetchOrderMessages返回结果:', result);
        const response = result.payload || result;
        console.log('处理后的响应数据:', response);
        
        // 处理嵌套的响应格式
        if (response && response.code === 200 && response.data) {
          console.log('订单消息内容:', response.data);
          setOrderMessages(response.data.list || []);
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
        const unreadResult = await dispatch(fetchUnreadMessagesByTypeCount('ORDER'));
        const unreadResponse = unreadResult.payload || unreadResult;
        if (unreadResponse && unreadResponse.data !== undefined) {
          setUnreadCount(unreadResponse.data);
        }
      } catch (error) {
        console.error('获取订单消息失败:', error);
        message.error('获取订单消息失败');
      } finally {
        setLoading(false);
      }
    };
    
    loadOrderMessages();
  }, [dispatch, pagination.current, pagination.pageSize]);
  
  // 标记为已读
  const markAsRead = async (messageId) => {
    try {
      await dispatch(markMessageAsRead(messageId));
      
      // 更新本地状态
      setOrderMessages(prev => 
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
    let filtered = [...orderMessages];
    
    // 按已读/未读筛选
    if (filter === 'unread') {
      filtered = filtered.filter(msg => !msg.read);
    } else if (filter === 'read') {
      filtered = filtered.filter(msg => msg.read);
    }
    
    // 按状态筛选
    if (filter === 'created') {
      filtered = filtered.filter(msg => msg.status === 'created');
    } else if (filter === 'paid') {
      filtered = filtered.filter(msg => msg.status === 'confirmed');
    } else if (filter === 'shipping') {
      filtered = filtered.filter(msg => msg.status === 'shipping');
    } else if (filter === 'completed') {
      filtered = filtered.filter(msg => msg.status === 'completed');
    }
    
    // 按关键词搜索
    if (keyword) {
      filtered = filtered.filter(
        msg => 
          (msg.itemName && msg.itemName.includes(keyword)) ||
          (msg.buyerName && msg.buyerName.includes(keyword)) ||
          (msg.orderId && msg.orderId.toString().includes(keyword))
      );
    }
    
    // 按时间排序
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };
  
  const filteredMessages = getFilteredMessages();
  const readCount = orderMessages.filter(msg => msg.read).length;
  const totalCount = orderMessages.length;
  
  // 获取状态图标
  const getStatusIcon = (status) => {
    switch (status) {
      case 'created':
        return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
      case 'confirmed':
        return <DollarCircleOutlined style={{ color: '#52c41a' }} />;
      case 'shipping':
        return <CarOutlined style={{ color: '#faad14' }} />;
      case 'completed':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      default:
        return <ClockCircleOutlined />;
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'created':
        return '#1890ff';
      case 'confirmed':
        return '#52c41a';
      case 'shipping':
        return '#faad14';
      case 'completed':
        return '#52c41a';
      default:
        return '#1890ff';
    }
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'created':
        return '已创建';
      case 'confirmed':
        return '已支付';
      case 'shipping':
        return '运送中';
      case 'completed':
        return '已完成';
      default:
        return '未知状态';
    }
  };
  
  const getStatusDescription = (status) => {
    switch (status) {
      case 'created':
        return '订单已创建，等待支付';
      case 'confirmed':
        return '买家已支付，请准备发货';
      case 'shipping':
        return '物品正在配送中';
      case 'completed':
        return '交易已完成';
      default:
        return '订单状态未知';
    }
  };
  
  const getStepNumber = (status) => {
    switch (status) {
      case 'created':
        return 0;
      case 'confirmed':
        return 1;
      case 'shipping':
        return 2;
      case 'completed':
        return 3;
      default:
        return 0;
    }
  };
  
  // 所有订单消息标为已读
  const markAllAsRead = async () => {
    if (unreadCount === 0) return;
    
    try {
      await dispatch(markAllMessagesByTypeAsRead('ORDER'));
      
      // 更新本地状态
      setOrderMessages(prev => 
        prev.map(msg => ({...msg, read: true}))
      );
      setUnreadCount(0);
      
      message.success('已将所有订单消息标记为已读');
    } catch (error) {
      console.error('标记全部已读失败:', error);
      message.error('标记全部已读失败');
    }
  };
  
  // 查看订单详情
  const viewOrderDetail = (orderId) => {
    if (orderId) {
      navigate(`/orders/${orderId}`);
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
          <ShoppingOutlined /> 订单消息
          {unreadCount > 0 && (
            <Badge count={unreadCount} style={{ marginLeft: '10px', backgroundColor: '#52c41a' }} />
          )}
        </Title>
      </div>
      
      {/* 消息统计面板 */}
      <Card className="message-statistics-card" style={{ marginBottom: '20px' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="总订单数"
              value={totalCount}
              prefix={<UnorderedListOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="未读订单"
              value={unreadCount}
              valueStyle={{ color: unreadCount > 0 ? '#ff4d4f' : '#1890ff' }}
              prefix={<ShoppingOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="最近订单"
              value={totalCount > 0 ? formatTime(orderMessages[0]?.createdAt) : '无'}
              prefix={<FieldTimeOutlined />}
            />
          </Col>
        </Row>
      </Card>
      
      <div className="message-detail-filter">
        <div className="filter-left">
          <Space wrap>
            <Radio.Group value={filter} onChange={e => setFilter(e.target.value)}>
              <Radio.Button value="all">全部</Radio.Button>
              <Radio.Button value="unread">未读</Radio.Button>
              <Radio.Button value="read">已读</Radio.Button>
              <Radio.Button value="created">待支付</Radio.Button>
              <Radio.Button value="paid">已支付</Radio.Button>
              <Radio.Button value="shipping">运送中</Radio.Button>
              <Radio.Button value="completed">已完成</Radio.Button>
            </Radio.Group>
          </Space>
          
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
          placeholder="搜索订单号、物品或买家" 
          allowClear 
          onSearch={value => setKeyword(value)} 
          style={{ width: 250 }} 
        />
      </div>
      
      <div className="message-detail-list order-message-list">
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : filteredMessages.length > 0 ? (
          <List
            dataSource={filteredMessages}
            renderItem={item => {
              console.log('订单消息项详细数据:', JSON.stringify(item, null, 2));
              return (
                <Card 
                  className={`order-message-card ${!item.read ? 'unread' : ''}`}
                  key={item.id}
                  hoverable
                  onClick={() => !item.read && markAsRead(item.id)}
                >
                  <div className="order-message-header">
                    <div className="order-message-title">
                      <Badge 
                        status="processing" 
                        color={getStatusColor(item.status)} 
                        style={{ marginRight: '8px' }} 
                      />
                      <Text strong>订单 #{item.orderId}</Text>
                      <Tag 
                        color={getStatusColor(item.status)}
                        style={{ marginLeft: '10px' }}
                      >
                        {getStatusText(item.status)}
                      </Tag>
                      {!item.read && (
                        <Badge 
                          count="新" 
                          style={{ 
                            backgroundColor: '#ff4d4f',
                            marginLeft: '10px' 
                          }} 
                        />
                      )}
                    </div>
                    <Text type="secondary" className="order-message-time">
                      {formatTime(item.createdAt)}
                    </Text>
                  </div>
                  
                  <div className="order-message-content">
                    <div className="order-message-item-info">
                      <img 
                        src={item.itemImage || 'https://via.placeholder.com/60?text=No+Image'} 
                        alt={item.itemName || '物品'} 
                        className="order-message-image" 
                      />
                      <div className="order-message-item-details">
                        <Text strong ellipsis style={{ maxWidth: '100%' }}>{item.itemName || '未命名物品'}</Text>
                        <div className="order-message-item-meta">
                          <Text type="danger">¥{item.price || '暂无价格'}</Text>
                          <Text type="secondary" style={{ marginLeft: '10px' }}>
                            买家: {item.buyerName || '未知买家'}
                          </Text>
                        </div>
                      </div>
                    </div>
                    
                    <div className="order-message-status">
                      <Text className="order-message-status-text">
                        {getStatusIcon(item.status)}
                        <span style={{ marginLeft: '8px' }}>{item.statusDescription || getStatusDescription(item.status)}</span>
                      </Text>
                      
                      <div className="order-message-steps">
                        <Steps 
                          current={item.step !== undefined ? item.step : getStepNumber(item.status)}
                          size="small"
                          labelPlacement="vertical"
                        >
                          <Step title="创建订单" />
                          <Step title="买家付款" />
                          <Step title="运送中" />
                          <Step title="交易完成" />
                        </Steps>
                      </div>
                    </div>
                  </div>
                  
                  <div className="order-message-footer">
                    <Space>
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
                      <Tooltip title="查看订单详情">
                        <Button 
                          type="primary" 
                          icon={<FileSearchOutlined />}
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewOrderDetail(item.orderId);
                          }}
                        >
                          查看订单
                        </Button>
                      </Tooltip>
                    </Space>
                    
                    <div className="order-message-date">
                      <Text type="secondary">{formatDate(item.createdAt)}</Text>
                    </div>
                  </div>
                </Card>
              );
            }}
          />
        ) : (
          <Empty description="暂无订单消息" />
        )}
      </div>
    </div>
  );
};

export default MessageOrders; 