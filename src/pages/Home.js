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
  Select,
  Pagination
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
  CloseOutlined,
  AppstoreOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { fetchItems, fetchRecommendedItems, fetchHotItems, fetchRecommendedItemsPage } from '../store/actions/itemActions';
import { 
  selectItems, 
  selectRecommendedItems, 
  selectItemLoading,
  selectRecommendedItemsPage,
  selectRecommendedItemsPageLoading
} from '../store/slices/itemSlice';
import { selectCategories, selectCategoryLoading } from '../store/slices/categorySlice';
import { fetchCategories } from '../store/actions/categoryActions';
import { formatPrice, DEFAULT_IMAGE } from '../utils/helpers';
import axios from '../utils/axios';
import ConditionTag from '../components/condition/ConditionTag';
import styled from 'styled-components';

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

// 悬浮网站地图导航按钮样式
const FloatingSitemapButton = styled.button`
  position: fixed;
  bottom: 200px; /* 位置上移，更远离发布按钮 */
  right: 20px;
  width: 60px; /* 放大按钮尺寸 */
  height: 60px; /* 放大按钮尺寸 */
  border-radius: 8px; /* 改为方形圆角，与发布按钮区分 */
  background: linear-gradient(135deg, #4A90E2, #5C6BC0); /* 蓝色系渐变，与发布按钮形成对比 */
  color: #fff;
  border: none;
  box-shadow: 0 3px 10px rgba(74, 144, 226, 0.3);
  display: flex;
  flex-direction: column; /* 改为纵向布局 */
  align-items: center;
  justify-content: center;
  font-size: 24px; /* 放大图标 */
  cursor: pointer;
  z-index: 990;
  transition: all 0.3s;
  padding: 0;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(74, 144, 226, 0.4);
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  /* 添加小文字 */
  &::after {
    content: '地图';
    font-size: 12px; /* 稍微放大文字 */
    margin-top: 3px;
    font-weight: 500;
  }
`;

// 添加首次访问引导提示
const FirstTimeGuide = styled.div`
  position: fixed;
  bottom: 270px; /* 调整位置 */
  right: 25px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  max-width: 180px;
  text-align: center;
  z-index: 991;
  animation: bounce 2s infinite;
  transform-origin: bottom center;
  
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    right: 20px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid rgba(0, 0, 0, 0.7);
  }
`;

// 网站地图悬浮卡片样式
const SitemapFloatingCard = styled.div`
  position: fixed;
  right: 20px;
  bottom: 260px; /* 位置上移 */
  width: 280px; /* 稍微加宽 */
  z-index: 989;
  transform: translateX(${props => props.visible ? '0' : '300px'});
  opacity: ${props => props.visible ? '1' : '0'};
  transition: all 0.3s ease;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  overflow: hidden;
`;

// 添加工具提示样式
const SitemapTooltip = styled.div`
  position: absolute;
  top: -40px;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  transform: translateY(10px);
  pointer-events: none;
  transition: all 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    right: 18px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid rgba(0, 0, 0, 0.7);
  }
`;

// 浮动效果容器
const FloatingButtonWrapper = styled.div`
  position: relative;
  
  &:hover ${SitemapTooltip} {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectItems);
  // const recommendedItems = useSelector(selectRecommendedItems);
  const loading = useSelector(selectItemLoading);
  const recommendedItemsPage = useSelector(selectRecommendedItemsPage);
  const recommendedItemsPageLoading = useSelector(selectRecommendedItemsPageLoading);
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
  const categories = useSelector(selectCategories);
  const categoryLoading = useSelector(selectCategoryLoading);
  const [recPageNum, setRecPageNum] = useState(1);
  const recPageSize = 4;
  // 添加网站地图悬浮卡片状态
  const [showSitemapCard, setShowSitemapCard] = useState(false);
  const sitemapCardRef = useRef(null);
  // 添加首次访问引导状态
  const [showGuide, setShowGuide] = useState(true);

  // 加载最新物品和推荐物品
  useEffect(() => {
    dispatch(fetchItems({ pageNum: 1, pageSize: 8, sort: 'createTime', order: 'desc' }));
    // dispatch(fetchRecommendedItems({ pageNum: 1, pageSize: 4 }));
  }, [dispatch]);

  // 检查是否首次访问，控制引导提示的显示
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('hasSeenSitemapGuide');
    if (hasSeenGuide) {
      setShowGuide(false);
    } else {
      // 5秒后自动隐藏引导提示
      const timer = setTimeout(() => {
        setShowGuide(false);
        localStorage.setItem('hasSeenSitemapGuide', 'true');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

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

  useEffect(() => {
    dispatch(fetchRecommendedItemsPage({ pageNum: recPageNum, pageSize: recPageSize }));
  }, [dispatch, recPageNum]);

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

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

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
      
      // 处理点击外部关闭网站地图卡片
      if (
        showSitemapCard &&
        sitemapCardRef.current &&
        !sitemapCardRef.current.contains(event.target) &&
        !event.target.closest('.sitemap-floating-btn')
      ) {
        setShowSitemapCard(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPublishMenu, showSitemapCard]);

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
    navigate('/publish-request');
    setShowPublishMenu(false);
  };
  
  // 网站地图卡片切换
  const toggleSitemapCard = () => {
    setShowSitemapCard(!showSitemapCard);
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
                  <div>
                    <ConditionTag condition={item.condition} />
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

  const categoryIcons = {
    1: <MobileOutlined className="xianyu-category-icon" />,
    2: <BookOutlined className="xianyu-category-icon" />,
    3: <HomeOutlined className="xianyu-category-icon" />,
    4: <SkinOutlined className="xianyu-category-icon" />,
    5: <TrophyOutlined className="xianyu-category-icon" />,
    6: <GiftOutlined className="xianyu-category-icon" />
  };

  const parentCategories = categories && categories.length > 0 ? categories.filter(cat => !cat.parentId) : [];

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
      
      {/* 添加浮动网站地图按钮和卡片 */}
      <FloatingButtonWrapper>
        <FloatingSitemapButton 
          onClick={toggleSitemapCard} 
          className="sitemap-floating-btn"
        >
          <GlobalOutlined />
        </FloatingSitemapButton>
        <SitemapTooltip>网站地图</SitemapTooltip>
      </FloatingButtonWrapper>
      
      {/* 首次访问引导提示 */}
      {showGuide && (
        <FirstTimeGuide onClick={() => {
          setShowGuide(false);
          setShowSitemapCard(true);
          localStorage.setItem('hasSeenSitemapGuide', 'true');
        }}>
          点击这里查看网站地图，快速找到所有功能！
        </FirstTimeGuide>
      )}
      
      {/* 网站地图悬浮卡片 */}
      <SitemapFloatingCard visible={showSitemapCard} ref={sitemapCardRef}>
        <Card
          title={<><GlobalOutlined /> 网站地图</>}
          extra={<CloseOutlined onClick={() => setShowSitemapCard(false)} style={{ cursor: 'pointer' }} />}
          style={{ width: '100%', boxShadow: 'none' }}
          headStyle={{ background: 'linear-gradient(90deg, #4A90E2, #5C6BC0)', color: 'white' }}
        >
          <div>
            <Title level={5} style={{ marginBottom: 8 }}>找不到你需要的功能？</Title>
            <Text type="secondary">
              网站地图可以帮助你快速找到所有功能和页面，就像实体商场的导航图一样。
            </Text>
            <div style={{ marginTop: 12 }}>
              <Button 
                type="primary" 
                block
                onClick={() => navigate('/sitemap')}
                style={{ 
                  background: 'linear-gradient(90deg, #4A90E2, #5C6BC0)',
                  border: 'none',
                  marginTop: 8
                }}
              >
                查看完整网站地图
              </Button>
            </div>
            
            {/* 添加快速链接 */}
            <div style={{ marginTop: 16 }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>常用功能：</Text>
              <Space wrap>
                <Button size="small" onClick={() => navigate('/items/publish')}>发布物品</Button>
                <Button size="small" onClick={() => navigate('/my/orders')}>我的订单</Button>
                <Button size="small" onClick={() => navigate('/my/favorites')}>我的收藏</Button>
              </Space>
            </div>
          </div>
        </Card>
      </SitemapFloatingCard>

      {/* 主体内容区 - 咸鱼风格布局 */}
      <div className="container">
        {/* 修改主页引导提示样式 */}
        <Row style={{ marginBottom: 16 }}>
          <Col span={24}>
            <Card 
              bordered={false}
              className="xianyu-section"
              style={{ 
                background: 'linear-gradient(to right, rgba(0, 184, 169, 0.05), rgba(0, 184, 169, 0.02))',
                borderRadius: 8,
                overflow: 'hidden',
                marginBottom: 16
              }}
              bodyStyle={{ padding: '12px 16px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Space align="center">
                  <GlobalOutlined style={{ fontSize: 18, color: '#00B8A9' }} />
                  <span style={{ color: '#333', fontSize: '14px' }}>
                    找不到需要的功能？试试
                    <Button 
                      type="link" 
                      onClick={() => navigate('/sitemap')} 
                      style={{ 
                        padding: '0 4px', 
                        fontSize: '14px',
                        color: '#00B8A9',
                        fontWeight: 'bold'
                      }}
                    >
                      网站地图
                    </Button>
                  </span>
                </Space>
                <Button 
                  size="small" 
                  type="primary" 
                  ghost
                  icon={<GlobalOutlined />}
                  onClick={() => setShowSitemapCard(true)}
                  style={{ 
                    borderColor: '#00B8A9', 
                    color: '#00B8A9',
                    display: 'flex',
                    alignItems: 'center',
                    height: '28px'
                  }}
                >
                  查看
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
        
        <Row gutter={[16, 24]}>
          {/* 左侧分类导航 */}
          <Col xs={24} md={6} lg={5} xl={4}>
            <div className="xianyu-sidebar">
              <div className="xianyu-category-menu">
                <div className="xianyu-category-title">
                  物品分类
                </div>
                <div className="xianyu-category-list">
                  {categoryLoading ? (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}><Spin /></div>
                  ) : (
                    parentCategories.length > 0 ? (
                      parentCategories.map(category => (
                        <div
                          className="xianyu-category-item"
                          key={category.id}
                          style={{ cursor: 'pointer' }}
                          onClick={() => navigate(`/items?category=${category.id}`)}
                        >
                          {categoryIcons[category.id] || <AppstoreOutlined className="xianyu-category-icon" />}
                          <span className="xianyu-category-text">{category.name}</span>
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: 'center', color: '#aaa', padding: '12px 0' }}>暂无分类</div>
                    )
                  )}
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
                  title="平台订单" 
                  value={statistics.totalOrders} 
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
            
            {/* 推荐物品分页 */}
            <div className="xianyu-section">
              <div className="xianyu-section-header">
                <Title level={4} className="xianyu-section-title">
                  <FireOutlined className="xianyu-section-icon" /> 推荐物品
                </Title>
              </div>
              {recommendedItemsPageLoading ? (
                <div className="xianyu-loading">
                  <Spin size="large" />
                </div>
              ) : recommendedItemsPage && recommendedItemsPage.content && recommendedItemsPage.content.length > 0 ? (
                <>
                  <Row gutter={[16, 16]}>
                    {recommendedItemsPage.content.map(item => renderItemCard(item))}
                  </Row>
                  <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <Pagination
                      current={recPageNum}
                      pageSize={recPageSize}
                      total={recommendedItemsPage.totalElements}
                      onChange={setRecPageNum}
                      showSizeChanger={false}
                    />
                  </div>
                </>
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
                            <ConditionTag condition={item.condition} />
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
      
      {/* 移除底部的网站地图卡片 */}
    </>
  );
};

export default Home; 