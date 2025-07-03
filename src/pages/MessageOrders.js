import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Tooltip
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
  FileSearchOutlined
} from '@ant-design/icons';
import { format, formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import axios from '../utils/axios';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Step } = Steps;

const MessageOrders = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderMessages, setOrderMessages] = useState([]);
  const [filter, setFilter] = useState('all');
  const [keyword, setKeyword] = useState('');
  
  // 模拟获取订单消息
  useEffect(() => {
    const fetchOrderMessages = async () => {
      setLoading(true);
      try {
        // 模拟数据
        const mockOrderMessages = [
          {
            id: 1,
            type: 'order_created',
            orderId: 301,
            itemId: 103,
            itemName: '大学教材',
            itemImage: 'https://via.placeholder.com/50',
            price: 45,
            status: 'created',
            statusText: '已创建',
            statusDescription: '订单已创建，等待支付',
            step: 0,
            buyerName: '张三',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
            read: false
          },
          {
            id: 2,
            type: 'order_paid',
            orderId: 302,
            itemId: 104,
            itemName: '篮球鞋',
            itemImage: 'https://via.placeholder.com/50',
            price: 120,
            status: 'paid',
            statusText: '已支付',
            statusDescription: '买家已支付，请准备发货',
            step: 1,
            buyerName: '李四',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
            read: true
          },
          {
            id: 3,
            type: 'order_shipping',
            orderId: 303,
            itemId: 105,
            itemName: '耳机',
            itemImage: 'https://via.placeholder.com/50',
            price: 89,
            status: 'shipping',
            statusText: '运送中',
            statusDescription: '物品正在配送中',
            step: 2,
            buyerName: '王五',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
            read: false
          },
          {
            id: 4,
            type: 'order_completed',
            orderId: 304,
            itemId: 106,
            itemName: '键盘',
            itemImage: 'https://via.placeholder.com/50',
            price: 199,
            status: 'completed',
            statusText: '已完成',
            statusDescription: '交易已完成',
            step: 3,
            buyerName: '赵六',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
            read: true
          }
        ];
        
        setOrderMessages(mockOrderMessages);
      } catch (error) {
        console.error('获取订单消息失败:', error);
        message.error('获取订单消息失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderMessages();
  }, []);
  
  // 标记为已读
  const markAsRead = async (id) => {
    try {
      // 实际应该调用API
      console.log(`标记消息 ${id} 为已读`);
      
      // 更新本地状态
      setOrderMessages(prev => 
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
      filtered = filtered.filter(msg => msg.status === 'paid');
    } else if (filter === 'shipping') {
      filtered = filtered.filter(msg => msg.status === 'shipping');
    } else if (filter === 'completed') {
      filtered = filtered.filter(msg => msg.status === 'completed');
    }
    
    // 按关键词搜索
    if (keyword) {
      filtered = filtered.filter(
        msg => 
          msg.itemName.includes(keyword) ||
          msg.buyerName.includes(keyword) ||
          msg.orderId.toString().includes(keyword)
      );
    }
    
    // 按时间排序
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };
  
  const filteredMessages = getFilteredMessages();
  const unreadCount = orderMessages.filter(msg => !msg.read).length;
  
  // 获取状态图标
  const getStatusIcon = (status) => {
    switch (status) {
      case 'created':
        return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
      case 'paid':
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
      case 'paid':
        return '#52c41a';
      case 'shipping':
        return '#faad14';
      case 'completed':
        return '#52c41a';
      default:
        return '#1890ff';
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
      
      <div className="message-detail-filter">
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
            renderItem={item => (
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
                      {item.statusText}
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
                    <img src={item.itemImage} alt={item.itemName} className="order-message-image" />
                    <div className="order-message-item-details">
                      <Text strong ellipsis style={{ maxWidth: '100%' }}>{item.itemName}</Text>
                      <div className="order-message-item-meta">
                        <Text type="danger">¥{item.price}</Text>
                        <Text type="secondary" style={{ marginLeft: '10px' }}>
                          买家: {item.buyerName}
                        </Text>
                      </div>
                    </div>
                  </div>
                  
                  <div className="order-message-status">
                    <Text className="order-message-status-text">
                      {getStatusIcon(item.status)}
                      <span style={{ marginLeft: '8px' }}>{item.statusDescription}</span>
                    </Text>
                    
                    <div className="order-message-steps">
                      <Steps 
                        current={item.step}
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
                          navigate(`/orders/${item.orderId}`);
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
            )}
          />
        ) : (
          <Empty description="暂无订单消息" />
        )}
      </div>
    </div>
  );
};

export default MessageOrders; 