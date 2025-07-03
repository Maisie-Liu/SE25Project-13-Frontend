import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Button, 
  Input, 
  Carousel, 
  Divider,
  Spin,
  Empty,
  Tag,
  Avatar,
  Statistic,
  Badge,
  List,
  Space,
  message,
  Select
} from 'antd';
import { 
  SearchOutlined, 
  FireOutlined, 
  ClockCircleOutlined,
  ShoppingOutlined,
  RightOutlined,
  MobileOutlined,
  BookOutlined,
  HomeOutlined,
  SkinOutlined,
  TrophyOutlined,
  GiftOutlined,
  UserOutlined,
  HeartOutlined,
  SafetyCertificateOutlined,
  RocketOutlined,
  StarOutlined,
  NotificationOutlined,
  QuestionCircleOutlined,
  TeamOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  MessageOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { fetchItems, fetchRecommendedItems, fetchHotItems } from '../store/actions/itemActions';
import { 
  selectItems, 
  selectRecommendedItems, 
  selectItemLoading 
} from '../store/slices/itemSlice';
import { formatPrice, DEFAULT_IMAGE } from '../utils/helpers';
import axios from '../utils/axios';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Meta } = Card;

// 模拟公告数据
const announcements = [
  { id: 1, title: '平台使用指南', link: '/help' },
  { id: 2, title: '关于禁止发布违禁物品的通知', link: '/notice/1' },
  { id: 3, title: '交易安全须知', link: '/safety' },
  { id: 4, title: '五一假期客服安排', link: '/notice/2' },
  { id: 5, title: '新版本功能介绍', link: '/news/1' }
];

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectItems);
  const recommendedItems = useSelector(selectRecommendedItems);
  const loading = useSelector(selectItemLoading);
  const [showPublishMenu, setShowPublishMenu] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);
  const [hotItems, setHotItems] = useState([]);
  const [hotItemsLoading, setHotItemsLoading] = useState(false);
  const [statistics, setStatistics] = useState({
    totalItems: 0,
    completedOrders: 0,
    totalUsers: 0
  });

  // 加载最新物品和推荐物品
  useEffect(() => {
    dispatch(fetchItems({ pageNum: 1, pageSize: 8, sort: 'createTime', order: 'desc' }));
    dispatch(fetchRecommendedItems({ pageNum: 1, pageSize: 4 }));
  }, [dispatch]);

  useEffect(() => {
    const loadHotItems = async () => {
      setHotItemsLoading(true);
      try {
        const items = await dispatch(fetchHotItems());
        setHotItems(items);
      } finally {
        setHotItemsLoading(false);
      }
    };
    loadHotItems();
  }, [dispatch]);

  // 获取平台统计数据
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        console.log('开始获取统计数据...');
        const response = await axios.get('/items/statistics');
        console.log('获取到的统计数据:', response.data);
        if (response.data.code === 200) {
          setStatistics(response.data.data);
          console.log('设置后的统计数据:', response.data.data);
        }
      } catch (error) {
        console.error('获取平台统计数据失败:', error);
        message.error('获取平台统计数据失败');
      }
    };

    fetchStatistics();
  }, []);

  // 处理点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showPublishMenu && 
        menuRef.current && 
        !menuRef.current.contains(event.target) &&
        btnRef.current &&
        !btnRef.current.contains(event.target)
      ) {
        setShowPublishMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPublishMenu]);

  // 处理搜索
  const handleSearch = (value) => {
    navigate(`/items?keyword=${encodeURIComponent(value)}`);
  };

  // 悬浮按钮相关函数
  const togglePublishMenu = () => {
    setShowPublishMenu(!showPublishMenu);
  };
  
  const handlePublishItem = () => {
    navigate('/items/publish');
    setShowPublishMenu(false);
  };
  
  const handleRequestItem = () => {
    navigate('/requests/publish');
    setShowPublishMenu(false);
  };

  // 渲染物品卡片
  const renderItemCard = (item) => (
    <Col xs={12} sm={12} md={12} lg={8} key={item.id} style={{ marginBottom: 16 }}>
      <Link to={`/items/${item.id}`}>
        <Card
          hoverable
          className="item-card xianyu-card"
          cover={
            <div className="xianyu-card-image-container">
              <img
                alt={item.name}
                src={item.images && item.images.length > 0 ? item.images[0] : DEFAULT_IMAGE}
                className="xianyu-card-image"
              />
              {item.isNew && (
                <div className="xianyu-badge">新上架</div>
              )}
            </div>
          }
          styles={{ body: { padding: '12px' } }}
        >
          <Meta
            title={
              <div className="text-ellipsis xianyu-card-title">{item.name}</div>
            }
            description={
              <>
                <div className="xianyu-price-tag">{item.price ? `¥${item.price}` : '面议'}</div>
                <div className="flex-between" style={{ marginTop: '8px' }}>
                  <div className="xianyu-tags">
                    {item.condition === 1 && <Tag color="green" className="xianyu-tag">全新</Tag>}
                    {item.condition > 1 && item.condition <= 3 && <Tag color="cyan" className="xianyu-tag">几乎全新</Tag>}
                    {item.condition > 3 && item.condition <= 6 && <Tag color="blue" className="xianyu-tag">轻度使用</Tag>}
                    {item.condition > 6 && item.condition <= 9 && <Tag color="orange" className="xianyu-tag">中度使用</Tag>}
                    {item.condition === 10 && <Tag color="red" className="xianyu-tag">重度使用</Tag>}
                  </div>
                  <div className="xianyu-user">
                    <Avatar size="small" icon={<UserOutlined />} src={item.userAvatar} className="xianyu-avatar" />
                    <span className="xianyu-username">
                      {item.username}
                    </span>
                  </div>
                </div>
              </>
            }
          />
        </Card>
      </Link>
    </Col>
  );

  return (
    <>
      {/* 背景遮罩 */}
      <div className={`overlay ${showPublishMenu ? 'active' : ''}`} onClick={() => setShowPublishMenu(false)}></div>
      
      {/* 悬浮发布按钮 */}
      <div className="floating-publish-wrapper">
        <button 
          ref={btnRef}
          className={`floating-publish-btn ${showPublishMenu ? 'active' : ''}`} 
          onClick={togglePublishMenu}
        >
          <PlusOutlined />
        </button>
        <div 
          ref={menuRef}
          className={`floating-publish-menu ${showPublishMenu ? 'active' : ''}`}
        >
          <div className="floating-menu-item" onClick={handlePublishItem}>
            <div className="floating-menu-circle">
              <ShoppingOutlined className="icon" />
            </div>
            <span className="text">发布闲置</span>
          </div>
          <div className="floating-menu-item" onClick={handleRequestItem}>
            <div className="floating-menu-circle">
              <MessageOutlined className="icon" />
            </div>
            <span className="text">发布求购</span>
          </div>
        </div>
      </div>

      {/* 主体内容区 - 咸鱼风格布局 */}
      <div className="container">
        <Row gutter={[16, 24]}>
          {/* 左侧分类导航 */}
          <Col xs={24} md={6} lg={5} xl={4}>
            <div className="xianyu-sidebar">
              <div className="xianyu-category-menu">
                <div className="xianyu-category-title">
                  物品分类
                </div>
                <div className="xianyu-category-list">
                  <div className="xianyu-category-item">
                    <MobileOutlined className="xianyu-category-icon" />
                    <span className="xianyu-category-text">电子产品</span>
                    <span className="xianyu-category-count">328</span>
                  </div>
                  <div className="xianyu-category-item">
                    <BookOutlined className="xianyu-category-icon" />
                    <span className="xianyu-category-text">图书教材</span>
                    <span className="xianyu-category-count">215</span>
                  </div>
                  <div className="xianyu-category-item">
                    <HomeOutlined className="xianyu-category-icon" />
                    <span className="xianyu-category-text">生活用品</span>
                    <span className="xianyu-category-count">189</span>
                  </div>
                  <div className="xianyu-category-item">
                    <SkinOutlined className="xianyu-category-icon" />
                    <span className="xianyu-category-text">服装鞋帽</span>
                    <span className="xianyu-category-count">156</span>
                  </div>
                  <div className="xianyu-category-item">
                    <TrophyOutlined className="xianyu-category-icon" />
                    <span className="xianyu-category-text">运动户外</span>
                    <span className="xianyu-category-count">98</span>
                  </div>
                  <div className="xianyu-category-item">
                    <GiftOutlined className="xianyu-category-icon" />
                    <span className="xianyu-category-text">其他物品</span>
                    <span className="xianyu-category-count">76</span>
                  </div>
                </div>
              </div>
              
              {/* 平台数据 */}
              <Card className="xianyu-stats-card">
                <Statistic 
                  title="平台商品" 
                  value={statistics.totalItems} 
                  prefix={<ShoppingOutlined />} 
                  valueStyle={{ color: 'var(--primary-color)' }}
                />
                <Divider style={{ margin: '12px 0' }} />
                <Statistic 
                  title="成交订单" 
                  value={statistics.completedOrders} 
                  prefix={<SafetyCertificateOutlined />} 
                  valueStyle={{ color: 'var(--primary-color)' }}
                />
                <Divider style={{ margin: '12px 0' }} />
                <Statistic 
                  title="注册用户" 
                  value={statistics.totalUsers} 
                  prefix={<UserOutlined />} 
                  valueStyle={{ color: 'var(--primary-color)' }}
                />
              </Card>
            </div>
          </Col>

          {/* 中间主内容区域 */}
          <Col xs={24} md={18} lg={14} xl={15}>
            {/* 轮播图 */}
            <Carousel autoplay className="xianyu-carousel">
              <div>
                <div className="xianyu-carousel-item">
                  <div className="xianyu-carousel-content">
                    <Title level={2} className="xianyu-carousel-title">发布闲置物品</Title>
                    <Paragraph className="xianyu-carousel-desc">一键发布，快速售出</Paragraph>
                    <Button type="primary" size="large" onClick={() => navigate('/items/publish')} className="xianyu-carousel-btn">
                      立即发布
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                <div className="xianyu-carousel-item">
                  <div className="xianyu-carousel-content">
                    <Title level={2} className="xianyu-carousel-title">校园二手交易平台</Title>
                    <Paragraph className="xianyu-carousel-desc">让闲置物品流通起来，让校园生活更加便利</Paragraph>
                    <Button type="primary" size="large" onClick={() => navigate('/items')} className="xianyu-carousel-btn">
                      开始浏览
                    </Button>
                  </div>
                </div>
              </div>
            </Carousel>
            
            {/* 最新物品 */}
            <div className="xianyu-section">
              <div className="xianyu-section-header">
                <Title level={4} className="xianyu-section-title">
                  <ClockCircleOutlined className="xianyu-section-icon" /> 最新上架
                </Title>
                <Button type="link" onClick={() => navigate('/items')} className="xianyu-more-btn">
                  查看更多 <RightOutlined />
                </Button>
              </div>
              
              {loading ? (
                <div className="xianyu-loading">
                  <Spin size="large" />
                </div>
              ) : items.length > 0 ? (
                <Row gutter={[16, 16]}>
                  {items.slice(0, 3).map((item, index) => renderItemCard({...item, isNew: index < 3}))}
                </Row>
              ) : (
                <Empty description="暂无物品" />
              )}
            </div>
            
            {/* 推荐物品 */}
            <div className="xianyu-section">
              <div className="xianyu-section-header">
                <Title level={4} className="xianyu-section-title">
                  <FireOutlined className="xianyu-section-icon" /> 推荐物品
                </Title>
                <Button type="link" onClick={() => navigate('/items')} className="xianyu-more-btn">
                  查看更多 <RightOutlined />
                </Button>
              </div>
              
              {loading ? (
                <div className="xianyu-loading">
                  <Spin size="large" />
                </div>
              ) : recommendedItems.length > 0 ? (
                <Row gutter={[16, 16]}>
                  {recommendedItems.slice(0, 3).map(item => renderItemCard(item))}
                </Row>
              ) : (
                <Empty description="暂无推荐物品" />
              )}
            </div>
          </Col>

          {/* 右侧栏目 */}
          <Col xs={24} md={0} lg={5} xl={5} style={{ display: { xs: 'none', lg: 'block' } }}>
            <div className="xianyu-right-sidebar">
              {/* 热门商品 */}
              <div className="xianyu-hot-items">
                <div className="xianyu-hot-title">
                  <FireOutlined className="xianyu-hot-icon" /> 热门商品
                </div>
                {hotItemsLoading ? (
                  <div className="xianyu-loading-small">
                    <Spin />
                  </div>
                ) : (
                  <List
                    itemLayout="horizontal"
                    dataSource={hotItems}
                    locale={{ emptyText: '暂无热门商品' }}
                    className="xianyu-hot-list"
                    renderItem={item => (
                      <List.Item 
                        key={item.id}
                        onClick={() => navigate(`/items/${item.id}`)}
                        className="xianyu-hot-item"
                      >
                        <img 
                          src={item.images?.[0] || DEFAULT_IMAGE} 
                          alt={item.name}
                          className="xianyu-hot-image"
                        />
                        <div className="xianyu-hot-info">
                          <div className="xianyu-hot-name">{item.name}</div>
                          <div className="xianyu-hot-price">￥{formatPrice(item.price)}</div>
                          <div className="xianyu-hot-meta">
                            <Tag color="blue" className="xianyu-tag">热度: {item.popularity || 0}</Tag>
                            {item.condition <= 3 && <Tag color="green" className="xianyu-tag">近全新</Tag>}
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                )}
              </div>
                
              {/* 平台公告 */}
              <div className="xianyu-notice">
                <div className="xianyu-notice-title">
                  <NotificationOutlined className="xianyu-notice-icon" /> 平台公告
                </div>
                <div className="xianyu-notice-content">
                  <ul className="xianyu-notice-list">
                    {announcements.map(item => (
                      <li className="xianyu-notice-item" key={item.id}>
                        <InfoCircleOutlined className="xianyu-notice-item-icon" />
                        <a href={item.link} className="xianyu-notice-link">{item.title}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Home; 