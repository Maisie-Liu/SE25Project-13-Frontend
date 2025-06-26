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
  Space
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
import { formatPrice } from '../utils/helpers';

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
          className="item-card"
          cover={
            <div style={{ position: 'relative' }}>
              <img
                alt={item.name}
                src={item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/300x200?text=No+Image'}
                className="item-image"
              />
              {item.isNew && (
                <div className="custom-badge">新上架</div>
              )}
            </div>
          }
          bodyStyle={{ padding: '12px' }}
        >
          <Meta
            title={
              <div className="text-ellipsis" style={{ fontWeight: 'bold' }}>{item.name}</div>
            }
            description={
              <>
                <div className="price-tag">{item.price ? `¥${item.price}` : '面议'}</div>
                <div className="flex-between" style={{ marginTop: '8px' }}>
                  <div>
                    {item.condition === 1 && <Tag color="green">全新</Tag>}
                    {item.condition > 1 && item.condition <= 3 && <Tag color="cyan">几乎全新</Tag>}
                    {item.condition > 3 && item.condition <= 6 && <Tag color="blue">轻度使用</Tag>}
                    {item.condition > 6 && item.condition <= 9 && <Tag color="orange">中度使用</Tag>}
                    {item.condition === 10 && <Tag color="red">重度使用</Tag>}
                  </div>
                  <div className="flex" style={{ alignItems: 'center' }}>
                    <Avatar size="small" icon={<UserOutlined />} src={item.userAvatar} className="user-avatar" />
                    <span style={{ marginLeft: '4px', fontSize: '12px', color: 'var(--lighter-text-color)' }}>
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

      {/* 主体内容区 - 两栏布局 */}
      <div className="container">
        <Row gutter={[8, 24]}>
          {/* 左侧分类导航 */}
          <Col xs={24} md={7} lg={6} xl={5}>
            <div className="left-sidebar-fixed">
              <div className="category-menu">
                <div className="category-menu-title">
                  物品分类
                </div>
                <div className="category-menu-list">
                  <div className="category-menu-item">
                    <MobileOutlined className="icon" />
                    <span className="text">电子产品</span>
                    <span className="count">28</span>
                  </div>
                  <div className="category-menu-item">
                    <BookOutlined className="icon" />
                    <span className="text">图书教材</span>
                    <span className="count">45</span>
                  </div>
                  <div className="category-menu-item">
                    <HomeOutlined className="icon" />
                    <span className="text">生活用品</span>
                    <span className="count">36</span>
                  </div>
                  <div className="category-menu-item">
                    <SkinOutlined className="icon" />
                    <span className="text">服装鞋帽</span>
                    <span className="count">19</span>
                  </div>
                  <div className="category-menu-item">
                    <TrophyOutlined className="icon" />
                    <span className="text">运动户外</span>
                    <span className="count">24</span>
                  </div>
                  <div className="category-menu-item">
                    <GiftOutlined className="icon" />
                    <span className="text">其他物品</span>
                    <span className="count">31</span>
                  </div>
                </div>
              </div>
              
              {/* 平台特色 - 移动到左侧侧边栏 */}
              <div className="sidebar-module">
                <div className="sidebar-module-title">
                  <SearchOutlined className="icon" /> 平台特色
                </div>
                <div className="sidebar-module-content">
                  <div className="feature-item">
                    <div className="feature-icon">
                      <SearchOutlined style={{ fontSize: 24, color: 'var(--primary-color)' }} />
                    </div>
                    <div className="feature-info">
                      <div className="feature-title">智能搜索</div>
                      <div className="feature-desc">快速找到心仪物品</div>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">
                      <RocketOutlined style={{ fontSize: 24, color: 'var(--primary-color)' }} />
                    </div>
                    <div className="feature-info">
                      <div className="feature-title">AI描述生成</div>
                      <div className="feature-desc">发布物品更轻松</div>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">
                      <SafetyCertificateOutlined style={{ fontSize: 24, color: 'var(--primary-color)' }} />
                    </div>
                    <div className="feature-info">
                      <div className="feature-title">安全交易</div>
                      <div className="feature-desc">保障双方权益</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>

          {/* 中间主内容区域 */}
          <Col xs={24} md={17} lg={13} xl={14}>
            {/* 轮播图 */}
            <Carousel autoplay className="home-carousel">
              <div>
                <div className="carousel-item" style={{ background: 'linear-gradient(135deg, #00b8a9 0%, #1de9b6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ color: '#fff', textAlign: 'center' }}>
                    <Title level={2} style={{ color: '#fff', marginBottom: '24px' }}>发布闲置物品</Title>
                    <Paragraph style={{ color: '#fff', fontSize: '16px', marginBottom: '24px' }}>一键发布，快速售出</Paragraph>
                    <Button type="primary" size="large" onClick={() => navigate('/items/publish')} style={{ borderRadius: '22px', height: '44px', padding: '0 32px', background: '#fff', color: 'var(--primary-color)' }}>
                      立即发布
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                <div className="carousel-item" style={{ background: 'linear-gradient(135deg, #00b8a9 0%, #1de9b6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ color: '#fff', textAlign: 'center' }}>
                    <Title level={2} style={{ color: '#fff', marginBottom: '24px' }}>校园二手交易平台</Title>
                    <Paragraph style={{ color: '#fff', fontSize: '16px', marginBottom: '24px' }}>让闲置物品流通起来，让校园生活更加便利</Paragraph>
                    <Button type="primary" size="large" onClick={() => navigate('/items')} style={{ borderRadius: '22px', height: '44px', padding: '0 32px', background: '#fff', color: 'var(--primary-color)' }}>
                      开始浏览
                    </Button>
                  </div>
                </div>
              </div>
            </Carousel>

            {/* 平台数据统计 */}
            <div className="feature-block" style={{ marginTop: '24px' }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                  <Statistic 
                    title={<Text strong style={{ fontSize: '16px' }}>平台商品</Text>} 
                    value={1234} 
                    prefix={<ShoppingOutlined />} 
                    valueStyle={{ color: 'var(--primary-color)', fontWeight: 'bold' }}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <Statistic 
                    title={<Text strong style={{ fontSize: '16px' }}>成交订单</Text>} 
                    value={568} 
                    prefix={<SafetyCertificateOutlined />} 
                    valueStyle={{ color: 'var(--primary-color)', fontWeight: 'bold' }}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <Statistic 
                    title={<Text strong style={{ fontSize: '16px' }}>注册用户</Text>} 
                    value={986} 
                    prefix={<UserOutlined />} 
                    valueStyle={{ color: 'var(--primary-color)', fontWeight: 'bold' }}
                  />
                </Col>
              </Row>
            </div>
            
            {/* 最新物品 */}
            <div style={{ marginBottom: 24 }}>
              <div className="flex-between mb-16">
                <Title level={3} style={{ fontSize: '20px', margin: 0 }}>
                  <ClockCircleOutlined style={{ marginRight: '8px', color: 'var(--primary-color)' }} /> 最新上架
                </Title>
                <Button type="link" onClick={() => navigate('/items')} style={{ color: 'var(--primary-color)' }}>
                  查看更多 <RightOutlined />
                </Button>
              </div>
              
              {loading ? (
                <div className="text-center" style={{ padding: 40 }}>
                  <Spin size="large" />
                </div>
              ) : items.length > 0 ? (
                <Row gutter={[16, 16]}>
                  {items.map((item, index) => renderItemCard({...item, isNew: index < 3}))}
                </Row>
              ) : (
                <Empty description="暂无物品" />
              )}
            </div>
            
            {/* 推荐物品 */}
            <div style={{ marginBottom: 24 }}>
              <div className="flex-between mb-16">
                <Title level={3} style={{ fontSize: '20px', margin: 0 }}>
                  <FireOutlined style={{ marginRight: '8px', color: 'var(--primary-color)' }} /> 推荐物品
                </Title>
                <Button type="link" onClick={() => navigate('/items')} style={{ color: 'var(--primary-color)' }}>
                  查看更多 <RightOutlined />
                </Button>
              </div>
              
              {loading ? (
                <div className="text-center" style={{ padding: 40 }}>
                  <Spin size="large" />
                </div>
              ) : recommendedItems.length > 0 ? (
                <Row gutter={[16, 16]}>
                  {recommendedItems.map(item => renderItemCard(item))}
                </Row>
              ) : (
                <Empty description="暂无推荐物品" />
              )}
            </div>
          </Col>

          {/* 右侧栏目 */}
          <Col xs={24} md={0} lg={5} xl={5} style={{ display: { xs: 'none', lg: 'block' } }}>
            <div className="right-sidebar-fixed">
              {/* 热门商品 */}
              <Card title="热门商品">
                {hotItemsLoading ? (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <Spin />
                  </div>
                ) : (
                  <List
                    itemLayout="horizontal"
                    dataSource={hotItems}
                    locale={{ emptyText: '暂无热门商品' }}
                    renderItem={item => (
                      <List.Item 
                        key={item.id}
                        onClick={() => navigate(`/items/${item.id}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        <List.Item.Meta
                          avatar={
                            <img 
                              src={item.images?.[0] || 'https://via.placeholder.com/60x60?text=No+Image'} 
                              alt={item.name}
                              style={{ width: 60, height: 60, objectFit: 'cover' }}
                            />
                          }
                          title={item.name}
                          description={
                            <Space>
                              <Tag color="red">￥{formatPrice(item.price)}</Tag>
                              <Tag color="blue">热度: {item.popularity || 0}</Tag>
                              {item.condition === 1 && <Tag color="green">全新</Tag>}
                              {item.condition > 1 && item.condition <= 3 && <Tag color="cyan">9成新</Tag>}
                              {item.condition > 3 && item.condition <= 5 && <Tag color="blue">7成新</Tag>}
                              {item.condition > 5 && item.condition <= 7 && <Tag color="orange">5成新</Tag>}
                              {item.condition > 7 && item.condition <= 9 && <Tag color="red">3成新</Tag>}
                              {item.condition > 9 && <Tag color="red">破旧</Tag>}
                            </Space>
                          }
                        />
                      </List.Item>
                    )}
                  />
                )}
              </Card>
                
              {/* 平台公告 */}
              <div className="platform-notice">
                <div className="platform-notice-title">
                  <NotificationOutlined className="icon" /> 平台公告
                </div>
                <div className="platform-notice-content">
                  <ul className="announcement-list">
                    {announcements.map(item => (
                      <li className="platform-notice-item" key={item.id}>
                        <InfoCircleOutlined className="icon" />
                        <a href={item.link}>{item.title}</a>
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