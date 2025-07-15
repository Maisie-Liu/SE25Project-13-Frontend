import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Typography, 
  Tabs, 
  Card, 
  Avatar, 
  Rate, 
  Divider, 
  List, 
  Tag, 
  Statistic, 
  Row, 
  Col, 
  Empty, 
  Spin, 
  Button, 
  message,
  Alert
} from 'antd';
import { 
  UserOutlined, 
  ShopOutlined, 
  StarOutlined, 
  ClockCircleOutlined, 
  LikeOutlined, 
  DislikeOutlined, 
  MessageOutlined,
  ShoppingOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  BugOutlined
} from '@ant-design/icons';
import axios from 'axios';
import './UserPublicProfile.css';
import { useDispatch, useSelector } from 'react-redux';
import {fetchUserPublicProfile} from '../store/actions/userPublicProfileActions';
import {clearUserPublicProfile} from '../store/slices/userPublicProfileSlice';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// 添加调试拦截器
axios.interceptors.request.use(request => {
  console.log('[请求拦截]', request);
  return request;
});

axios.interceptors.response.use(
  response => {
    console.log('[响应拦截成功]', response);
    return response;
  },
  error => {
    console.error('[响应拦截错误]', error.response || error);
    return Promise.reject(error);
  }
);

const UserPublicProfile = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { loading, data: profile, error } = useSelector(state => state.userPublicProfile);
  const [activeTab, setActiveTab] = useState('items');
  const [debugInfo, setDebugInfo] = useState(null);
  const [stats, setStats] = useState({
    sellerRating: 0,
    buyerRating: 0,
    totalSold: 0,
    totalItems: 0,
    joinDate: null,
    location: '未知',
  });

  // 调试函数
  const checkDebugAccess = async () => {
    try {
      const response = await axios.get('/api/users/debug/access');
      console.log('调试接口访问结果:', response.data);
      setDebugInfo({
        success: true,
        message: '调试接口可以访问',
        data: response.data
      });
    } catch (error) {
      console.error('调试接口访问失败:', error);
      setDebugInfo({
        success: false,
        message: '调试接口无法访问: ' + (error.response?.status || error.message),
        error: error.response?.data || error.message
      });
    }
  };

  useEffect(() => {
    checkDebugAccess();
    dispatch(fetchUserPublicProfile(userId));
    return () => {
      dispatch(clearUserPublicProfile());
    };
  }, [userId, dispatch]);

  // 统计数据逻辑：profile 变化时重新计算
  useEffect(() => {
    if (profile && profile.stats) {
      setStats(profile.stats);
    }
  }, [profile]);

  // 评价等级描述
  const ratingDescriptions = ['差', '一般', '良好', '很好', '优秀'];
  
  // 格式化时间函数
  const formatDate = (dateString) => {
    if (!dateString) return '未知';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
  };

  const renderRating = (rating) => {
    if (rating === null || rating === undefined) return '暂无评分';
    return Number(rating).toFixed(1) + ' 分';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <p>加载用户信息中...</p>
        {debugInfo && (
          <div style={{ marginTop: 20 }}>
            <Alert 
              message="调试信息" 
              description={
                <div>
                  <p>调试接口状态: {debugInfo.success ? '可访问' : '不可访问'}</p>
                  <p>消息: {debugInfo.message}</p>
                  {debugInfo.error && <p>错误: {JSON.stringify(debugInfo.error)}</p>}
                </div>
              }
              type={debugInfo.success ? "info" : "warning"}
              showIcon
            />
          </div>
        )}
      </div>
    );
  }

  if (!profile || !profile.user) {
    return (
      <div className="not-found-container">
        <Empty 
          description="找不到该用户" 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
        />
        <Button type="primary" style={{ marginTop: 16 }}>
          <Link to="/">返回首页</Link>
        </Button>
        
        {debugInfo && (
          <Card title="调试信息" style={{ marginTop: 20 }} extra={<BugOutlined />}>
            <div>
              <p>调试接口状态: {debugInfo.success ? '可访问' : '不可访问'}</p>
              <p>消息: {debugInfo.message}</p>
              {debugInfo.error && (
                <>
                  <p>错误: {typeof debugInfo.error === 'string' ? debugInfo.error : JSON.stringify(debugInfo.error)}</p>
                  <p>状态码: {debugInfo.error.status || '未知'}</p>
                </>
              )}
              <p>用户ID: {userId}</p>
              <p>请求路径: {`/api/users/${userId}`}</p>
              <p>浏览器信息: {navigator.userAgent}</p>
              <p>时间戳: {new Date().toLocaleString()}</p>
              <Button type="dashed" onClick={checkDebugAccess}>重新检查调试接口</Button>
              <Button 
                type="primary" 
                danger 
                style={{ marginLeft: 8 }} 
                onClick={() => {
                  // 尝试直接获取用户信息
                  fetch(`/api/users/${userId}`)
                    .then(res => {
                      console.log('直接获取用户信息结果:', res);
                      if (!res.ok) {
                        throw new Error(`HTTP错误! 状态: ${res.status}`);
                      }
                      return res.json();
                    })
                    .then(data => {
                      console.log('获取用户信息成功:', data);
                      message.success('直接获取用户信息成功');
                    })
                    .catch(err => {
                      console.error('直接获取用户信息失败:', err);
                      message.error(`直接获取用户信息失败: ${err.message}`);
                    });
                }}
              >
                尝试直接获取
              </Button>
            </div>
          </Card>
        )}
      </div>
    );
  }

  const { user, items = [], ratings = [] } = profile;
  const availableItems = items.filter(item => item.status === 1);
  const soldItems = items.filter(item => item.status !== 1);
  const sellerRatings = ratings.filter(rating => rating.role === 'SELLER');
  const buyerRatings = ratings.filter(rating => rating.role === 'BUYER');
  const orders = profile.orders || [];
  const userIdNum = Number(user.id);
  // 作为卖家收到的评价
  const sellerComments = orders.filter(
    o => o.sellerComment && Number(o.sellerId) === userIdNum
  );
  // 作为买家收到的评价
  const buyerComments = orders.filter(
    o => o.buyerComment && Number(o.buyerId) === userIdNum
  );

  const totalSold = stats.totalSold ?? soldItems.length;

  return (
    <div className="user-public-profile-container">
      <Card className="profile-header-card">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} sm={8} md={6} className="avatar-col">
            <Avatar 
              size={120} 
              src={user.avatarUrl} 
              icon={<UserOutlined />} 
              className="user-avatar"
            />
            <Title level={3} className="username">{user.username}</Title>
            <Text type="secondary">注册于 {formatDate(stats.joinDate)}</Text>
          </Col>
          
          <Col xs={24} sm={16} md={18}>
            <div className="user-info">
              <Row gutter={[24, 16]}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Card className="stat-card">
                    <Statistic 
                      title="卖家评分" 
                      value={renderRating(stats.sellerRating)} 
                      suffix={
                        <Rate 
                          disabled 
                          allowHalf 
                          value={stats.sellerRating || 0} 
                          style={{ fontSize: 14, marginLeft: 8 }} 
                        />
                      }
                      valueStyle={{ color: '#fa8c16' }}
                      prefix={<ShopOutlined />}
                    />
                    <Text type="secondary">{sellerRatings.length} 个评价</Text>
                  </Card>
                </Col>
                
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Card className="stat-card">
                    <Statistic 
                      title="买家评分" 
                      value={renderRating(stats.buyerRating)} 
                      suffix={
                        <Rate 
                          disabled 
                          allowHalf 
                          value={stats.buyerRating || 0} 
                          style={{ fontSize: 14, marginLeft: 8 }} 
                        />
                      }
                      valueStyle={{ color: '#52c41a' }}
                      prefix={<ShoppingOutlined />}
                    />
                    <Text type="secondary">{buyerRatings.length} 个评价</Text>
                  </Card>
                </Col>
                
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Card className="stat-card">
                    <Statistic 
                      title="售出物品" 
                      value={totalSold} 
                      prefix={<CheckCircleOutlined />}
                      valueStyle={{ color: '#1890ff' }}
                    />
                    <Text type="secondary">共发布 {stats.totalItems} 个</Text>
                  </Card>
                </Col>
                
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Card className="stat-card">
                    <Statistic 
                      title="所在地区" 
                      value={stats.location} 
                      prefix={<EnvironmentOutlined />}
                      valueStyle={{ color: '#722ed1' }}
                    />
                    <Text type="secondary">交易地点</Text>
                  </Card>
                </Col>
              </Row>
              
              {user.bio && (
                <div className="user-bio">
                  <Title level={5}>个人简介</Title>
                  <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: '更多' }}>
                    {user.bio}
                  </Paragraph>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Card>
      
      <Card className="profile-content-card">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane 
            tab={
              <span>
                <ShopOutlined />
                物品列表
              </span>
            } 
            key="items"
          >
            <Tabs defaultActiveKey="available" className="items-tabs">
              <TabPane tab="在售物品" key="available">
                {availableItems.length > 0 ? (
                  <List
                    grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 5 }}
                    dataSource={availableItems}
                    renderItem={item => (
                      <List.Item>
                        <Link to={`/items/${item.id}`}>
                          <Card
                            hoverable
                            cover={
                              <div className="item-image-container">
                                <img 
                                  alt={item.name} 
                                  src={item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/150'}
                                />
                              </div>
                            }
                            className="item-card"
                          >
                            <Card.Meta
                              title={item.name}
                              description={
                                <div className="item-info">
                                  <Text className="item-price">¥{item.price}</Text>
                                  <div className="item-tags">
                                    <Tag color="green">在售</Tag>
                                    <Tag color="blue">{item.categoryName || '未分类'}</Tag>
                                  </div>
                                  <Text type="secondary" className="item-time">
                                    <ClockCircleOutlined /> {formatDate(item.createTime)}
                                  </Text>
                                </div>
                              }
                            />
                          </Card>
                        </Link>
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty description="暂无在售物品" />
                )}
              </TabPane>
              <TabPane tab="已售物品" key="sold">
                {soldItems.length > 0 ? (
                  <List
                    grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 5 }}
                    dataSource={soldItems}
                    renderItem={item => (
                      <List.Item>
                        <Link to={`/items/${item.id}`}>
                          <Card
                            hoverable
                            cover={
                              <div className="item-image-container sold-item">
                                <img 
                                  alt={item.name} 
                                  src={item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/150'}
                                />
                                <div className="sold-overlay">已售出</div>
                              </div>
                            }
                            className="item-card"
                          >
                            <Card.Meta
                              title={item.name}
                              description={
                                <div className="item-info">
                                  <Text className="item-price">¥{item.price}</Text>
                                  <div className="item-tags">
                                    <Tag color="red">已售</Tag>
                                    <Tag color="blue">{item.categoryName || '未分类'}</Tag>
                                  </div>
                                  <Text type="secondary" className="item-time">
                                    <ClockCircleOutlined /> {formatDate(item.updateTime || item.createTime)}
                                  </Text>
                                </div>
                              }
                            />
                          </Card>
                        </Link>
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty description="暂无已售物品" />
                )}
              </TabPane>
            </Tabs>
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <StarOutlined />
                用户评价
              </span>
            } 
            key="ratings"
          >
            <Tabs defaultActiveKey="seller" className="order-comments-tabs">
              <TabPane tab="作为卖家收到的评价" key="seller">
                {sellerComments.length > 0 ? (
                  <List
                    itemLayout="vertical"
                    dataSource={sellerComments}
                    renderItem={order => (
                      <List.Item>
                        <div>
                          <span>买家：{order.buyerName}</span>
                          <span style={{ marginLeft: 16 }}>物品：{order.itemName || (order.item && order.item.name)}</span>
                          <span style={{ marginLeft: 16 }}>金额：¥{order.itemPrice || order.amount}</span>
                        </div>
                        <div style={{ marginTop: 8 }}>
                          <Tag color="orange">买家评价</Tag>
                          <span>{order.sellerComment}</span>
                        </div>
                        <div style={{ color: '#888', marginTop: 4 }}>
                          {order.updateTime ? new Date(order.updateTime).toLocaleString() : ''}
                        </div>
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty description="暂无买家评价" />
                )}
              </TabPane>
              <TabPane tab="作为买家收到的评价" key="buyer">
                {buyerComments.length > 0 ? (
                  <List
                    itemLayout="vertical"
                    dataSource={buyerComments}
                    renderItem={order => (
                      <List.Item>
                        <div>
                          <span>卖家：{order.sellerName}</span>
                          <span style={{ marginLeft: 16 }}>物品：{order.itemName || (order.item && order.item.name)}</span>
                          <span style={{ marginLeft: 16 }}>金额：¥{order.itemPrice || order.amount}</span>
                        </div>
                        <div style={{ marginTop: 8 }}>
                          <Tag color="blue">卖家评价</Tag>
                          <span>{order.buyerComment}</span>
                        </div>
                        <div style={{ color: '#888', marginTop: 4 }}>
                          {order.updateTime ? new Date(order.updateTime).toLocaleString() : ''}
                        </div>
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty description="暂无卖家评价" />
                )}
              </TabPane>
            </Tabs>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default UserPublicProfile; 