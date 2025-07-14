import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Typography, 
  Tabs, 
  Card, 
  Avatar, 
  Rate, 
  Tag, 
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
  const { loading, data: profile } = useSelector(state => state.userPublicProfile);
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
    if (profile && profile.user) {
      const user = profile.user;
      const items = profile.items || [];
      const ratings = profile.ratings || [];
      const sellerRatings = ratings.filter(rating => rating.role === 'SELLER');
      const buyerRatings = ratings.filter(rating => rating.role === 'BUYER');
      const availableItems = items.filter(item => item.status === 1);
      const soldItems = items.filter(item => item.status === 3);
      const calculateSellerRating = () => {
        if (sellerRatings.length === 0) return 0;
        const sum = sellerRatings.reduce((acc, curr) => acc + curr.rating, 0);
        return (sum / sellerRatings.length).toFixed(1);
      };
      const calculateBuyerRating = () => {
        if (buyerRatings.length === 0) return 0;
        const sum = buyerRatings.reduce((acc, curr) => acc + curr.rating, 0);
        return (sum / buyerRatings.length).toFixed(1);
      };
      setStats({
        sellerRating: calculateSellerRating(),
        buyerRating: calculateBuyerRating(),
        totalSold: soldItems.length,
        totalItems: items.length,
        joinDate: user.createTime,
        location: user.location || '未知',
      });
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
  const soldItems = items.filter(item => item.status === 3);
  const sellerRatings = ratings.filter(rating => rating.role === 'SELLER');
  const buyerRatings = ratings.filter(rating => rating.role === 'BUYER');

  return (
    <div className="user-public-profile-container">
      <div className="profile-sidebar">
        <Card className="profile-header-card">
          <div className="avatar-col">
            <Avatar 
              size={160}
              src={user.avatarUrl} 
              icon={<UserOutlined />} 
              className="user-avatar"
            />
            <Title level={3} className="username">{user.username}</Title>
            <Text type="secondary">注册于 {formatDate(stats.joinDate)}</Text>
          </div>

          <div className="user-stats">
            <div className="stat-item">
              <ShopOutlined className="stat-icon" />
              <span>卖家评分</span>
              <div className="rating-stars-container">
                <span className="rating-stars">
                  <Rate disabled allowHalf value={parseFloat(stats.sellerRating)} style={{ fontSize: 16 }} />
                </span>
                <span className="rating-value">{stats.sellerRating}</span>
              </div>
            </div>
            <div className="stat-item">
              <ShoppingOutlined className="stat-icon" />
              <span>买家评分</span>
              <div className="rating-stars-container">
                <span className="rating-stars">
                  <Rate disabled allowHalf value={parseFloat(stats.buyerRating)} style={{ fontSize: 16 }} />
                </span>
                <span className="rating-value">{stats.buyerRating}</span>
              </div>
            </div>
            <div className="stat-item">
              <CheckCircleOutlined className="stat-icon" />
              <span>已售出商品</span>
              <div className="rating-stars-container">
                <span className="rating-value">{stats.totalSold} 件</span>
              </div>
            </div>
            <div className="stat-item">
              <EnvironmentOutlined className="stat-icon" />
              <span>交易地点</span>
              <div className="rating-stars-container">
                <span className="rating-value">{stats.location}</span>
              </div>
            </div>
          </div>

          {user.bio && (
            <div className="user-bio">
              <Title level={5}>个人简介</Title>
              <Paragraph>{user.bio}</Paragraph>
            </div>
          )}
        </Card>
      </div>

      <div className="profile-main">
        <Card className="profile-content-card">
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane 
              tab={
                <span>
                  <ShopOutlined />
                  在售商品 ({availableItems.length})
                </span>
              } 
              key="items"
            >
              <div className="items-grid">
                {availableItems.map(item => (
                  <div className="item-wrapper" key={item.id}>
                    <Link to={`/items/${item.id}`}>
                      <Card
                        hoverable
                        className="item-card"
                        cover={
                          <div className="item-image-container">
                            <img alt={item.title} src={item.images?.[0] || 'https://via.placeholder.com/300'} />
                          </div>
                        }
                      >
                        <Card.Meta
                          title={item.title}
                          description={
                            <div className="item-info">
                              <span className="item-price">¥{item.price.toFixed(2)}</span>
                              <div className="item-tags">
                                {item.tags?.map(tag => (
                                  <Tag key={tag}>{tag}</Tag>
                                ))}
                              </div>
                              <span className="item-time">
                                <ClockCircleOutlined /> {formatDate(item.createTime)}
                              </span>
                            </div>
                          }
                        />
                      </Card>
                    </Link>
                  </div>
                ))}
              </div>
            </TabPane>

            <TabPane 
              tab={
                <span>
                  <CheckCircleOutlined />
                  已售商品 ({soldItems.length})
                </span>
              } 
              key="sold"
            >
              <div className="items-grid">
                {soldItems.map(item => (
                  <div className="item-wrapper" key={item.id}>
                    <Link to={`/items/${item.id}`}>
                      <Card
                        hoverable
                        className="item-card"
                        cover={
                          <div className="item-image-container sold-item">
                            <img alt={item.title} src={item.images?.[0] || 'https://via.placeholder.com/300'} />
                            <div className="sold-overlay">已售出</div>
                          </div>
                        }
                      >
                        <Card.Meta
                          title={item.title}
                          description={
                            <div className="item-info">
                              <span className="item-price">¥{item.price.toFixed(2)}</span>
                              <div className="item-tags">
                                {item.tags?.map(tag => (
                                  <Tag key={tag}>{tag}</Tag>
                                ))}
                              </div>
                              <span className="item-time">
                                <ClockCircleOutlined /> {formatDate(item.createTime)}
                              </span>
                            </div>
                          }
                        />
                      </Card>
                    </Link>
                  </div>
                ))}
              </div>
            </TabPane>

            <TabPane 
              tab={
                <span>
                  <StarOutlined />
                  收到的评价 ({ratings.length})
                </span>
              } 
              key="ratings"
            >
              <Tabs 
                defaultActiveKey="seller" 
                className="rating-type-tabs"
                tabBarStyle={{ textAlign: 'center' }}
              >
                <TabPane
                  tab={
                    <span>
                      <ShopOutlined />
                      作为卖家的评价 ({sellerRatings.length})
                    </span>
                  }
                  key="seller"
                >
                  <Card className="rating-stats-card">
                    <div className="stats-header">卖家评价统计</div>
                    <div className="stats-content">
                      <div className="stats-item">
                        <div className="stats-item-value">{stats.sellerRating}</div>
                        <div className="stats-item-title">平均评分</div>
                        <div className="stars-container">
                          <Rate disabled allowHalf value={parseFloat(stats.sellerRating)} />
                        </div>
                      </div>
                      <div className="stats-item">
                        <div className="stats-item-value">{sellerRatings.length}</div>
                        <div className="stats-item-title">总评价数</div>
                      </div>
                      <div className="stats-item">
                        <div className="stats-item-value">
                          {sellerRatings.length > 0 ? 
                            Math.round(sellerRatings.filter(r => r.rating >= 4).length / sellerRatings.length * 100) : 0}%
                        </div>
                        <div className="stats-item-title">好评率</div>
                      </div>
                    </div>
                  </Card>
                  
                  <Row gutter={[16, 16]}>
                    {sellerRatings.map(rating => (
                      <Col xs={24} sm={24} md={12} lg={12} xl={12} key={rating.id}>
                        <Card className="rating-card">
                          <div className="rating-header">
                            <div className="rater-info">
                              <Avatar size="small" src={rating.raterAvatar} icon={<UserOutlined />} />
                              <Text strong>{rating.raterName}</Text>
                            </div>
                            <div className="rating-stars">
                              <Rate disabled defaultValue={rating.rating} />
                              <Text type="secondary">{ratingDescriptions[Math.floor(rating.rating) - 1]}</Text>
                            </div>
                          </div>
                          <div className="rating-content">
                            <Paragraph>{rating.comment}</Paragraph>
                            {rating.itemId && (
                              <div className="rating-item-info">
                                <Link to={`/items/${rating.itemId}`} className="rating-item-link">
                                  <img 
                                    className="rating-item-image" 
                                    src={rating.itemImage || 'https://via.placeholder.com/60'} 
                                    alt={rating.itemTitle} 
                                  />
                                  <div className="rating-item-details">
                                    <Text strong>{rating.itemTitle}</Text>
                                    <Text type="secondary">交易时间：{formatDate(rating.createTime)}</Text>
                                  </div>
                                </Link>
                              </div>
                            )}
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <ShoppingOutlined />
                      作为买家的评价 ({buyerRatings.length})
                    </span>
                  }
                  key="buyer"
                >
                  <Card className="rating-stats-card">
                    <div className="stats-header">买家评价统计</div>
                    <div className="stats-content">
                      <div className="stats-item">
                        <div className="stats-item-value">{stats.buyerRating}</div>
                        <div className="stats-item-title">平均评分</div>
                        <div className="stars-container">
                          <Rate disabled allowHalf value={parseFloat(stats.buyerRating)} />
                        </div>
                      </div>
                      <div className="stats-item">
                        <div className="stats-item-value">{buyerRatings.length}</div>
                        <div className="stats-item-title">总评价数</div>
                      </div>
                      <div className="stats-item">
                        <div className="stats-item-value">
                          {buyerRatings.length > 0 ? 
                            Math.round(buyerRatings.filter(r => r.rating >= 4).length / buyerRatings.length * 100) : 0}%
                        </div>
                        <div className="stats-item-title">好评率</div>
                      </div>
                    </div>
                  </Card>
                  
                  <Row gutter={[16, 16]}>
                    {buyerRatings.map(rating => (
                      <Col xs={24} sm={24} md={12} lg={12} xl={12} key={rating.id}>
                        <Card className="rating-card">
                          <div className="rating-header">
                            <div className="rater-info">
                              <Avatar size="small" src={rating.raterAvatar} icon={<UserOutlined />} />
                              <Text strong>{rating.raterName}</Text>
                            </div>
                            <div className="rating-stars">
                              <Rate disabled defaultValue={rating.rating} />
                              <Text type="secondary">{ratingDescriptions[Math.floor(rating.rating) - 1]}</Text>
                            </div>
                          </div>
                          <div className="rating-content">
                            <Paragraph>{rating.comment}</Paragraph>
                            {rating.itemId && (
                              <div className="rating-item-info">
                                <Link to={`/items/${rating.itemId}`} className="rating-item-link">
                                  <img 
                                    className="rating-item-image" 
                                    src={rating.itemImage || 'https://via.placeholder.com/60'} 
                                    alt={rating.itemTitle} 
                                  />
                                  <div className="rating-item-details">
                                    <Text strong>{rating.itemTitle}</Text>
                                    <Text type="secondary">交易时间：{formatDate(rating.createTime)}</Text>
                                  </div>
                                </Link>
                              </div>
                            )}
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </TabPane>
              </Tabs>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default UserPublicProfile; 