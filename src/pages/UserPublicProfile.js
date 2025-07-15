import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  Alert,
  Badge,
  Image,
  Tooltip,
  Statistic,
  List
} from 'antd';
import { 
  UserOutlined, 
  ShopOutlined, 
  StarOutlined, 
  ClockCircleOutlined, 
  ShoppingOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  BugOutlined,
  HeartOutlined,
  EditOutlined,
  CommentOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  FileImageOutlined,
  AppstoreOutlined,
  TeamOutlined,
  EyeOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  LikeOutlined
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, data: profile, error } = useSelector(state => state.userPublicProfile);
  const [debugInfo, setDebugInfo] = useState(null);
  const [stats, setStats] = useState({
    sellerRating: 0,
    buyerRating: 0,
    totalSold: 0,
    totalItems: 0,
    joinDate: null,
    location: '未知',
  });
  
  // 控制展示数量
  const [showAllAvailable, setShowAllAvailable] = useState(false);
  const [showAllSold, setShowAllSold] = useState(false);
  const [showAllSellerRatings, setShowAllSellerRatings] = useState(false);
  const [showAllBuyerRatings, setShowAllBuyerRatings] = useState(false);
  
  // 每个区域展示的数量限制
  const ITEMS_LIMIT = 4;
  const RATINGS_LIMIT = 2;
  
  // 随机封面图，采用莫兰迪色调
  const coverImages = [
    'https://img.alicdn.com/imgextra/i3/O1CN01cFrqAl1vDfGLLLVYs_!!6000000006140-0-tps-2880-800.jpg', 
    'https://img.alicdn.com/imgextra/i1/O1CN01EJeEUG1Zn4e2xDcIN_!!6000000003238-0-tps-2880-800.jpg', 
    'https://img.alicdn.com/imgextra/i2/O1CN01DHQzLS1tgJroGPdZm_!!6000000005930-0-tps-2880-800.jpg'
  ];
  const [coverImage] = useState(coverImages[Math.floor(Math.random() * coverImages.length)]);

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
  
  // 格式化时间带星期
  const formatDateWithDay = (dateString) => {
    if (!dateString) return '未知';
    const date = new Date(dateString);
    const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return `${date.toLocaleDateString('zh-CN')} ${days[date.getDay()]}`;
  };
  
  // 获取用户等级
  const getUserLevel = (user) => {
    if (!user) return 1;
    
    const registrationDate = new Date(user.createTime);
    const now = new Date();
    const monthsRegistered = (now.getFullYear() - registrationDate.getFullYear()) * 12 + 
                             now.getMonth() - registrationDate.getMonth();
    
    // 根据注册时长和活跃度计算等级
    return Math.min(9, Math.max(1, Math.floor(monthsRegistered / 3) + 1));
  };

  // 处理返回按钮点击
  const handleGoBack = () => {
    navigate(-1); // 返回到上一页
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
  const userLevel = getUserLevel(user);
  
  // 限制显示数量
  const displayedAvailableItems = showAllAvailable ? availableItems : availableItems.slice(0, ITEMS_LIMIT);
  const displayedSoldItems = showAllSold ? soldItems : soldItems.slice(0, ITEMS_LIMIT);
  const displayedSellerRatings = showAllSellerRatings ? sellerRatings : sellerRatings.slice(0, RATINGS_LIMIT);
  const displayedBuyerRatings = showAllBuyerRatings ? buyerRatings : buyerRatings.slice(0, RATINGS_LIMIT);
  
  // 模拟访问量数据
  const visitCount = Math.floor(Math.random() * 10000) + 100;
  const todayVisits = Math.floor(Math.random() * 50) + 1;

  // 渲染物品卡片函数
  const renderItemCard = (item, isSold = false) => (
    <Link to={`/items/${item.id}`} key={item.id}>
      <Card
        hoverable
        cover={
          <div className={`item-image-container ${isSold ? 'sold-item' : ''}`}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}>
              <Image
                alt={item.name}
                src={item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/150'}
                preview={false}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              {isSold && <div className="sold-overlay">已售出</div>}
            </div>
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
                <Tag color={isSold ? "#b89795" : "#7d989b"}>{isSold ? '已售' : '在售'}</Tag>
                <Tag color="#a69b8a">{item.categoryName || '未分类'}</Tag>
              </div>
              <Text type="secondary" className="item-time">
                <ClockCircleOutlined /> {formatDate(isSold ? (item.updateTime || item.createTime) : item.createTime)}
              </Text>
            </div>
          }
        />
      </Card>
    </Link>
  );

  return (
    <div className="user-public-profile-container">
      {/* 返回按钮 */}
      <Button 
        type="primary"
        icon={<ArrowLeftOutlined />}
        className="back-button"
        onClick={handleGoBack}
      >
        返回
      </Button>

      {/* 背景元素 */}
      <div className="profile-background">
        <div className="profile-decoration"></div>
      </div>
      
      {/* 头部个人资料卡片 */}
      <Card className="profile-header-card">
        {/* 封面图 */}
        <div 
          className="profile-cover"
          style={{ backgroundImage: `url(${coverImage})` }}
        ></div>
        
        <div className="profile-info-wrapper">
          <Row align="middle">
            <Col xs={24} sm={8} md={6} className="avatar-col">
              <div className="avatar-wrapper">
                <Avatar 
                  size={120} 
                  src={user.avatarUrl} 
                  icon={<UserOutlined />} 
                  className="user-avatar"
                />
                <div className="avatar-frame"></div>
                <div className="avatar-decoration avatar-decoration-top">
                  <StarOutlined />
                </div>
                <div className="avatar-decoration avatar-decoration-right">
                  <HeartOutlined />
                </div>
                <div className="avatar-decoration avatar-decoration-bottom">
                  <CheckCircleOutlined />
                </div>
                <div className="avatar-decoration avatar-decoration-left">
                  <ShopOutlined />
                </div>
              </div>
              <div className="avatar-badge" title={`等级 ${userLevel}`}>
                <span>{userLevel}</span>
              </div>
              <Title level={3} className="username">
                {user.username}
                {user.isVip && (
                  <Tooltip title="认证用户">
                    <Badge dot status="processing" style={{ marginLeft: 8 }} />
                  </Tooltip>
                )}
              </Title>
              <Text className="user-joindate">
                <CalendarOutlined /> 注册于 {formatDate(stats.joinDate)}
              </Text>
              
              <div className="user-status">
                <CheckCircleOutlined /> 交易活跃用户
              </div>
            </Col>
          </Row>
        </div>
      </Card>
      
      {/* 主体内容 - 左右布局 */}
      <div className="profile-layout">
        {/* 左侧边栏 */}
        <div className="profile-sidebar">
          {/* 用户信息卡片 */}
          <Card className="sidebar-card">
            <div className="sidebar-card-title">
              <UserOutlined />
              个人信息
            </div>
            <div className="sidebar-card-body">
              {/* 卖家评分 */}
              <Card className="stat-card">
                <div className="stat-icon seller-icon">
                  <ShopOutlined />
                </div>
                <Statistic 
                  title="卖家评分" 
                  value={stats.sellerRating} 
                  suffix={
                    <Rate 
                      disabled 
                      allowHalf 
                      value={stats.sellerRating} 
                      style={{ fontSize: 14, marginLeft: 8 }} 
                    />
                  }
                  valueStyle={{ color: '#7d989b' }}
                />
                <Text type="secondary">{sellerRatings.length} 个评价</Text>
              </Card>
              
              {/* 买家评分 */}
              <Card className="stat-card">
                <div className="stat-icon buyer-icon">
                  <ShoppingOutlined />
                </div>
                <Statistic 
                  title="买家评分" 
                  value={stats.buyerRating} 
                  suffix={
                    <Rate 
                      disabled 
                      allowHalf 
                      value={stats.buyerRating} 
                      style={{ fontSize: 14, marginLeft: 8 }} 
                    />
                  }
                  valueStyle={{ color: '#a69b8a' }}
                />
                <Text type="secondary">{buyerRatings.length} 个评价</Text>
              </Card>
              
              {/* 售出物品 */}
              <Card className="stat-card">
                <div className="stat-icon sold-icon">
                  <CheckCircleOutlined />
                </div>
                <Statistic 
                  title="售出物品" 
                  value={stats.totalSold} 
                  valueStyle={{ color: '#b89795' }}
                />
                <Text type="secondary">共发布 {stats.totalItems} 个</Text>
              </Card>
            </div>
          </Card>
          
          {/* 个人简介卡片 */}
          {user.bio && (
            <Card className="sidebar-card">
              <div className="sidebar-card-title">
                <InfoCircleOutlined />
                个人简介
              </div>
              <div className="sidebar-card-body">
                <div className="user-bio">
                  <Paragraph ellipsis={{ rows: 4, expandable: true, symbol: '更多' }}>
                    {user.bio}
                  </Paragraph>
                  <CommentOutlined className="quote-icon" />
                </div>
              </div>
            </Card>
          )}
        </div>
        
        {/* 右侧内容区 */}
        <div className="profile-content">
          {/* 物品列表卡片 */}
          <Card className="content-card">
            <div className="content-header">
              <span><AppstoreOutlined />物品列表</span>
              <div className="content-header-actions">
                <Tooltip title="共发布物品数">
                  <Badge count={items.length} style={{ backgroundColor: '#7d989b' }} />
                </Tooltip>
              </div>
            </div>
            <div className="content-body">
              <Tabs defaultActiveKey="available" className="content-tabs">
                <TabPane 
                  tab={
                    <span className="tab-with-tag">
                      <span className="tab-tag tab-tag-active"></span>
                      在售物品
                    </span>
                  } 
                  key="available"
                >
                  {availableItems.length > 0 ? (
                    <>
                      <div className={`item-grid ${!showAllAvailable ? 'limited' : ''}`}>
                        {displayedAvailableItems.map(item => renderItemCard(item))}
                      </div>
                      {availableItems.length > ITEMS_LIMIT && (
                        <div className="view-all-button">
                          <Button 
                            type="default" 
                            onClick={() => setShowAllAvailable(!showAllAvailable)}
                            icon={showAllAvailable ? null : <ArrowRightOutlined />}
                          >
                            {showAllAvailable ? '收起' : `查看全部 ${availableItems.length} 件`}
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="empty-container">
                      <Empty 
                        description="暂无在售物品" 
                        image={<FileImageOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
                      />
                    </div>
                  )}
                </TabPane>
                <TabPane 
                  tab={
                    <span className="tab-with-tag">
                      <span className="tab-tag tab-tag-sold"></span>
                      已售物品
                    </span>
                  } 
                  key="sold"
                >
                  {soldItems.length > 0 ? (
                    <>
                      <div className={`item-grid ${!showAllSold ? 'limited' : ''}`}>
                        {displayedSoldItems.map(item => renderItemCard(item, true))}
                      </div>
                      {soldItems.length > ITEMS_LIMIT && (
                        <div className="view-all-button">
                          <Button 
                            type="default" 
                            onClick={() => setShowAllSold(!showAllSold)}
                            icon={showAllSold ? null : <ArrowRightOutlined />}
                          >
                            {showAllSold ? '收起' : `查看全部 ${soldItems.length} 件`}
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="empty-container">
                      <Empty 
                        description="暂无已售物品" 
                        image={<FileImageOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />} 
                      />
                    </div>
                  )}
                </TabPane>
              </Tabs>
            </div>
          </Card>
          
          {/* 用户评价卡片 */}
          <Card className="content-card">
            <div className="content-header">
              <span><StarOutlined />用户评价</span>
              <div className="content-header-actions">
                <Tooltip title="收到的评价数">
                  <Badge count={ratings.length} style={{ backgroundColor: '#93a7a5' }} />
                </Tooltip>
              </div>
            </div>
            <div className="content-body">
              <Tabs defaultActiveKey="seller" className="content-tabs">
                <TabPane 
                  tab={
                    <span className="tab-with-tag">
                      <span className="tab-tag tab-tag-seller"></span>
                      作为卖家的评价
                    </span>
                  } 
                  key="seller"
                >
                  {sellerRatings.length > 0 ? (
                    <>
                      <div className="ratings-list">
                        {displayedSellerRatings.map(rating => (
                          <Card className="rating-card" key={rating.id}>
                            <List.Item>
                              <div className="rating-header">
                                <div className="rater-info">
                                  <Avatar src={rating.rater?.avatarUrl} icon={<UserOutlined />} />
                                  <Text strong>{rating.rater?.username || '匿名用户'}</Text>
                                </div>
                                <div className="rating-stars">
                                  <Rate disabled value={rating.rating} />
                                  <Text type="secondary">{ratingDescriptions[Math.floor(rating.rating) - 1]}</Text>
                                </div>
                              </div>
                              <div className="rating-content">
                                <Paragraph>{rating.comment || '该用户未留下评价内容'}</Paragraph>
                                <div className="rating-item-info">
                                  <Link to={`/items/${rating.item.id}`} className="rating-item-link">
                                    <img 
                                      src={rating.item.images && rating.item.images.length > 0 ? rating.item.images[0] : 'https://via.placeholder.com/50'} 
                                      alt={rating.item.name} 
                                      className="rating-item-image" 
                                    />
                                    <div className="rating-item-details">
                                      <Text strong>{rating.item.name}</Text>
                                      <Text type="secondary">¥{rating.item.price}</Text>
                                    </div>
                                  </Link>
                                </div>
                              </div>
                              <div className="rating-footer">
                                <Text type="secondary">{formatDateWithDay(rating.createTime)}</Text>
                                <div className="rating-actions">
                                  <span className="rating-action-btn">
                                    <LikeOutlined /> 赞同
                                  </span>
                                  <span className="rating-action-btn">
                                    <CommentOutlined /> 回复
                                  </span>
                                </div>
                              </div>
                            </List.Item>
                          </Card>
                        ))}
                      </div>
                      {sellerRatings.length > RATINGS_LIMIT && (
                        <div className="view-all-button">
                          <Button 
                            type="default" 
                            onClick={() => setShowAllSellerRatings(!showAllSellerRatings)}
                            icon={showAllSellerRatings ? null : <ArrowRightOutlined />}
                          >
                            {showAllSellerRatings ? '收起' : `查看全部 ${sellerRatings.length} 条评价`}
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="empty-container">
                      <Empty 
                        description="暂无卖家评价" 
                        image={<StarOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
                      />
                    </div>
                  )}
                </TabPane>
                
                <TabPane 
                  tab={
                    <span className="tab-with-tag">
                      <span className="tab-tag tab-tag-buyer"></span>
                      作为买家的评价
                    </span>
                  } 
                  key="buyer"
                >
                  {buyerRatings.length > 0 ? (
                    <>
                      <div className="ratings-list">
                        {displayedBuyerRatings.map(rating => (
                          <Card className="rating-card" key={rating.id}>
                            <List.Item>
                              <div className="rating-header">
                                <div className="rater-info">
                                  <Avatar src={rating.rater?.avatarUrl} icon={<UserOutlined />} />
                                  <Text strong>{rating.rater?.username || '匿名用户'}</Text>
                                </div>
                                <div className="rating-stars">
                                  <Rate disabled value={rating.rating} />
                                  <Text type="secondary">{ratingDescriptions[Math.floor(rating.rating) - 1]}</Text>
                                </div>
                              </div>
                              <div className="rating-content">
                                <Paragraph>{rating.comment || '该用户未留下评价内容'}</Paragraph>
                                <div className="rating-item-info">
                                  <Link to={`/items/${rating.item.id}`} className="rating-item-link">
                                    <img 
                                      src={rating.item.images && rating.item.images.length > 0 ? rating.item.images[0] : 'https://via.placeholder.com/50'} 
                                      alt={rating.item.name} 
                                      className="rating-item-image" 
                                    />
                                    <div className="rating-item-details">
                                      <Text strong>{rating.item.name}</Text>
                                      <Text type="secondary">¥{rating.item.price}</Text>
                                    </div>
                                  </Link>
                                </div>
                              </div>
                              <div className="rating-footer">
                                <Text type="secondary">{formatDateWithDay(rating.createTime)}</Text>
                                <div className="rating-actions">
                                  <span className="rating-action-btn">
                                    <LikeOutlined /> 赞同
                                  </span>
                                  <span className="rating-action-btn">
                                    <CommentOutlined /> 回复
                                  </span>
                                </div>
                              </div>
                            </List.Item>
                          </Card>
                        ))}
                      </div>
                      {buyerRatings.length > RATINGS_LIMIT && (
                        <div className="view-all-button">
                          <Button 
                            type="default" 
                            onClick={() => setShowAllBuyerRatings(!showAllBuyerRatings)}
                            icon={showAllBuyerRatings ? null : <ArrowRightOutlined />}
                          >
                            {showAllBuyerRatings ? '收起' : `查看全部 ${buyerRatings.length} 条评价`}
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="empty-container">
                      <Empty 
                        description="暂无买家评价" 
                        image={<StarOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
                      />
                    </div>
                  )}
                </TabPane>
              </Tabs>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserPublicProfile; 