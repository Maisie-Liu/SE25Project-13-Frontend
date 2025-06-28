import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Card, 
  Row, 
  Col, 
  Pagination, 
  Empty, 
  Spin, 
  Typography, 
  Input, 
  Select,
  Tag,
  Space,
  Avatar,
  Divider,
  Button,
  Slider,
  Radio,
  Tooltip,
  Badge,
  Checkbox,
  List
} from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  SearchOutlined, 
  FilterOutlined, 
  SortAscendingOutlined,
  UserOutlined,
  FireOutlined,
  HeartOutlined,
  EyeOutlined,
  CommentOutlined,
  ShoppingOutlined,
  CheckCircleOutlined,
  AppstoreOutlined,
  MenuOutlined,
  SortDescendingOutlined,
  ClockCircleOutlined,
  MobileOutlined,
  BookOutlined,
  HomeOutlined,
  SkinOutlined,
  TrophyOutlined,
  GiftOutlined,
  NotificationOutlined,
  QuestionCircleOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { fetchItems } from '../store/actions/itemActions';
import { selectItems, selectItemLoading, selectItemPagination } from '../store/slices/itemSlice';
import queryString from 'query-string';
import { formatPrice, DEFAULT_IMAGE } from '../utils/helpers';

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;
const { Search } = Input;

// 分类选项
const categoryOptions = [
  { value: '', label: '全部分类' },
  { value: '1', label: '电子产品', icon: <MobileOutlined /> },
  { value: '2', label: '图书教材', icon: <BookOutlined /> },
  { value: '3', label: '生活用品', icon: <HomeOutlined /> },
  { value: '4', label: '服装鞋帽', icon: <SkinOutlined /> },
  { value: '5', label: '运动户外', icon: <TrophyOutlined /> },
  { value: '6', label: '其他物品', icon: <GiftOutlined /> }
];

// 排序选项
const sortOptions = [
  { value: 'createTime-desc', label: '最新发布' },
  { value: 'price-asc', label: '价格升序' },
  { value: 'price-desc', label: '价格降序' },
  { value: 'views-desc', label: '浏览最多' },
  { value: 'favorites-desc', label: '收藏最多' }
];

// 校区选项
const campusOptions = [
  { value: '', label: '全部校区' },
  { value: 'main', label: '主校区' },
  { value: 'south', label: '南校区' },
  { value: 'north', label: '北校区' },
  { value: 'east', label: '东校区' }
];

// 自定义BarsOutlined组件
const BarsOutlined = () => (
  <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
    <path d="M912 192H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 284H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 284H328c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h584c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM104 228a56 56 0 1 0 112 0 56 56 0 1 0-112 0zm0 284a56 56 0 1 0 112 0 56 56 0 1 0-112 0zm0 284a56 56 0 1 0 112 0 56 56 0 1 0-112 0z" />
  </svg>
);

const ItemList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const items = useSelector(selectItems);
  const loading = useSelector(selectItemLoading);
  const pagination = useSelector(selectItemPagination);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [keyword, setKeyword] = useState(queryParams.get('keyword') || '');
  const [category, setCategory] = useState(queryParams.get('category') || '');
  const [sortBy, setSortBy] = useState('createTime');
  const [sortOrder, setSortOrder] = useState('desc');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [condition, setCondition] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [campus, setCampus] = useState('');
  const [hasImage, setHasImage] = useState(false);

  // 处理搜索和筛选参数变化
  useEffect(() => {
    const params = {
      pageNum: currentPage,
      pageSize: pageSize,
      sort: sortBy,
      order: sortOrder,
      keyword: keyword || undefined,
      category: category || undefined,
      condition: condition !== 'all' ? condition : undefined,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 5000 ? priceRange[1] : undefined,
      campus: campus || undefined,
      hasImage: hasImage || undefined
    };
    
    // 移除所有 undefined 的参数
    Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
    
    dispatch(fetchItems(params));
  }, [dispatch, currentPage, pageSize, keyword, category, sortBy, sortOrder, condition, priceRange, campus, hasImage]);

  // 从URL参数中获取搜索和筛选条件
  useEffect(() => {
    const keywordParam = queryParams.get('keyword');
    const categoryParam = queryParams.get('category');
    const campusParam = queryParams.get('campus');
    
    if (keywordParam) {
      setKeyword(keywordParam);
    }
    
    if (categoryParam) {
      setCategory(categoryParam);
    }

    if (campusParam) {
      setCampus(campusParam);
    }
  }, [location.search]);

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleSearch = (value) => {
    setKeyword(value);
    setCurrentPage(1);
    navigate(`/items?keyword=${encodeURIComponent(value)}${category ? `&category=${category}` : ''}`);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setCurrentPage(1);
    navigate(`/items?${keyword ? `keyword=${encodeURIComponent(keyword)}&` : ''}category=${value}`);
  };

  const handleSortChange = (value) => {
    const [sort, order] = value.split('-');
    setSortBy(sort);
    setSortOrder(order);
  };

  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
  };

  const handleConditionChange = (e) => {
    setCondition(e.target.value);
  };

  const handleViewModeChange = (e) => {
    setViewMode(e.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const applyAdvancedFilter = () => {
    setCurrentPage(1);
    setShowFilters(false);
  };

  const resetAdvancedFilter = () => {
    setPriceRange([0, 5000]);
    setCondition('all');
    setCurrentPage(1);
  };

  const renderItemCard = (item, index) => (
    <Col xs={viewMode === 'grid' ? 12 : 24} sm={viewMode === 'grid' ? 8 : 24} md={viewMode === 'grid' ? 6 : 24} lg={viewMode === 'grid' ? 6 : 24} key={item.id || `item-${index}`} style={{ marginBottom: 16 }}>
      {item.id ? (
        <Link to={`/items/${item.id}`}>
          <Card
            hoverable
            className="item-card"
            cover={
              <div style={{ position: 'relative' }}>
                <img
                  alt={item.name}
                  src={item.images && item.images.length > 0 ? item.images[0] : DEFAULT_IMAGE}
                  style={{ objectFit: 'cover', height: '200px' }}
                />
                {item.isNew && (
                  <div className="custom-badge">新上架</div>
                )}
                <div style={{ position: 'absolute', bottom: 8, right: 8 }}>
                  <Space>
                    <Badge count={item.viewCount || 0} overflowCount={999} style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}>
                      <EyeOutlined style={{ color: '#fff', fontSize: 16 }} />
                    </Badge>
                    <Badge count={item.favoriteCount || 0} overflowCount={999} style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}>
                      <HeartOutlined style={{ color: '#fff', fontSize: 16 }} />
                    </Badge>
                  </Space>
                </div>
              </div>
            }
            styles={{ body: { padding: '12px' } }}
          >
            {viewMode === 'grid' ? (
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
                        {item.condition > 1 && item.condition <= 3 && <Tag color="cyan">9成新</Tag>}
                        {item.condition > 3 && item.condition <= 5 && <Tag color="blue">7成新</Tag>}
                        {item.condition > 5 && item.condition <= 7 && <Tag color="orange">5成新</Tag>}
                        {item.condition > 7 && item.condition <= 9 && <Tag color="red">3成新</Tag>}
                        {item.condition > 9 && <Tag color="red">破旧</Tag>}
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
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="flex-between">
                  <Title level={5} className="text-ellipsis" style={{ marginBottom: '8px', flex: 1 }}>{item.name}</Title>
                  <div className="price-tag" style={{ marginLeft: '8px' }}>{item.price ? `¥${item.price}` : '面议'}</div>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  {item.condition === 1 && <Tag color="green">全新</Tag>}
                  {item.condition > 1 && item.condition <= 3 && <Tag color="cyan">9成新</Tag>}
                  {item.condition > 3 && item.condition <= 5 && <Tag color="blue">7成新</Tag>}
                  {item.condition > 5 && item.condition <= 7 && <Tag color="orange">5成新</Tag>}
                  {item.condition > 7 && item.condition <= 9 && <Tag color="red">3成新</Tag>}
                  {item.condition > 9 && <Tag color="red">破旧</Tag>}
                  <Tag color="var(--primary-color)">{getCategoryName(item.category)}</Tag>
                </div>
                <Paragraph ellipsis={{ rows: 2 }} style={{ color: 'var(--light-text-color)', marginBottom: '8px' }}>
                  {item.description || '暂无描述'}
                </Paragraph>
                <div className="flex-between">
                  <div className="flex" style={{ alignItems: 'center' }}>
                    <Avatar size="small" icon={<UserOutlined />} src={item.userAvatar} className="user-avatar" />
                    <span style={{ marginLeft: '4px', fontSize: '12px', color: 'var(--lighter-text-color)' }}>
                      {item.username}
                    </span>
                  </div>
                  <Text style={{ fontSize: '12px', color: 'var(--lighter-text-color)' }}>
                    发布于 {formatDate(item.createTime)}
                  </Text>
                </div>
              </div>
            )}
          </Card>
        </Link>
      ) : (
        <Card
          className="item-card"
          hoverable
          cover={
            <div style={{ position: 'relative' }}>
              <img
                alt={item.name}
                src={item.images && item.images.length > 0 ? item.images[0] : DEFAULT_IMAGE}
                style={{ objectFit: 'cover', height: '200px' }}
              />
              {item.isNew && (
                <div className="custom-badge">新上架</div>
              )}
              <div style={{ position: 'absolute', bottom: 8, right: 8 }}>
                <Space>
                  <Badge count={item.viewCount || 0} overflowCount={999} style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}>
                    <EyeOutlined style={{ color: '#fff', fontSize: 16 }} />
                  </Badge>
                  <Badge count={item.favoriteCount || 0} overflowCount={999} style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}>
                    <HeartOutlined style={{ color: '#fff', fontSize: 16 }} />
                  </Badge>
                </Space>
              </div>
            </div>
          }
          styles={{ body: { padding: '12px' } }}
        >
          {viewMode === 'grid' ? (
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
                      {item.condition > 1 && item.condition <= 3 && <Tag color="cyan">9成新</Tag>}
                      {item.condition > 3 && item.condition <= 5 && <Tag color="blue">7成新</Tag>}
                      {item.condition > 5 && item.condition <= 7 && <Tag color="orange">5成新</Tag>}
                      {item.condition > 7 && item.condition <= 9 && <Tag color="red">3成新</Tag>}
                      {item.condition > 9 && <Tag color="red">破旧</Tag>}
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
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="flex-between">
                <Title level={5} className="text-ellipsis" style={{ marginBottom: '8px', flex: 1 }}>{item.name}</Title>
                <div className="price-tag" style={{ marginLeft: '8px' }}>{item.price ? `¥${item.price}` : '面议'}</div>
              </div>
              <div style={{ marginBottom: '8px' }}>
                {item.condition === 1 && <Tag color="green">全新</Tag>}
                {item.condition > 1 && item.condition <= 3 && <Tag color="cyan">9成新</Tag>}
                {item.condition > 3 && item.condition <= 5 && <Tag color="blue">7成新</Tag>}
                {item.condition > 5 && item.condition <= 7 && <Tag color="orange">5成新</Tag>}
                {item.condition > 7 && item.condition <= 9 && <Tag color="red">3成新</Tag>}
                {item.condition > 9 && <Tag color="red">破旧</Tag>}
                <Tag color="var(--primary-color)">{getCategoryName(item.category)}</Tag>
              </div>
              <Paragraph ellipsis={{ rows: 2 }} style={{ color: 'var(--light-text-color)', marginBottom: '8px' }}>
                {item.description || '暂无描述'}
              </Paragraph>
              <div className="flex-between">
                <div className="flex" style={{ alignItems: 'center' }}>
                  <Avatar size="small" icon={<UserOutlined />} src={item.userAvatar} className="user-avatar" />
                  <span style={{ marginLeft: '4px', fontSize: '12px', color: 'var(--lighter-text-color)' }}>
                    {item.username}
                  </span>
                </div>
                <Text style={{ fontSize: '12px', color: 'var(--lighter-text-color)' }}>
                  发布于 {formatDate(item.createTime)}
                </Text>
              </div>
            </div>
          )}
        </Card>
      )}
    </Col>
  );

  // 辅助函数：获取分类名称
  const getCategoryName = (categoryId) => {
    const categories = {
      '1': '电子产品',
      '2': '图书教材',
      '3': '生活用品',
      '4': '服装鞋帽',
      '5': '运动户外',
      '6': '其他物品'
    };
    return categories[categoryId] || '未分类';
  };

  // 辅助函数：格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="container">
      <div className="item-list-container">
        <div className="item-list-header" style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={24} md={12} lg={8}>
              <Search
                placeholder="搜索商品名称、描述..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onSearch={handleSearch}
              />
            </Col>
            
            <Col xs={24} sm={24} md={12} lg={16}>
              <Space wrap>
                <Space>
                  <Select
                    value={category}
                    onChange={handleCategoryChange}
                    placeholder="选择分类"
                    style={{ width: 120 }}
                    options={categoryOptions}
                    styles={{
                      popup: {
                        root: {
                          borderRadius: '8px'
                        }
                      }
                    }}
                  />
                </Space>
                
                <Space>
                  <Select
                    value={sortBy + '-' + sortOrder}
                    onChange={handleSortChange}
                    style={{ width: 140 }}
                    options={sortOptions}
                    styles={{
                      popup: {
                        root: {
                          borderRadius: '8px'
                        }
                      }
                    }}
                  />
                </Space>

                <Space>
                  <Select
                    value={campus}
                    onChange={(value) => setCampus(value)}
                    placeholder="选择校区"
                    style={{ width: 120 }}
                    options={campusOptions}
                    styles={{
                      popup: {
                        root: {
                          borderRadius: '8px'
                        }
                      }
                    }}
                  />
                </Space>

                <Button
                  icon={<FilterOutlined />}
                  onClick={toggleFilters}
                  type={showFilters ? 'primary' : 'default'}
                >
                  筛选
                </Button>

                <Radio.Group value={viewMode} onChange={handleViewModeChange} buttonStyle="solid">
                  <Radio.Button value="grid"><AppstoreOutlined /></Radio.Button>
                  <Radio.Button value="list"><BarsOutlined /></Radio.Button>
                </Radio.Group>
              </Space>
            </Col>
          </Row>

          {showFilters && (
            <div className="advanced-filters" style={{ marginTop: 16, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Title level={5}>价格区间</Title>
                  <Slider
                    range
                    value={priceRange}
                    onChange={handlePriceRangeChange}
                    min={0}
                    max={5000}
                    marks={{
                      0: '¥0',
                      1000: '¥1000',
                      2000: '¥2000',
                      3000: '¥3000',
                      4000: '¥4000',
                      5000: '¥5000'
                    }}
                  />
                </Col>
                
                <Col span={24}>
                  <Title level={5}>商品成色</Title>
                  <Radio.Group value={condition} onChange={handleConditionChange}>
                    <Radio.Button value="all">全部</Radio.Button>
                    <Radio.Button value="new">全新</Radio.Button>
                    <Radio.Button value="like_new">几乎全新</Radio.Button>
                    <Radio.Button value="good">状况良好</Radio.Button>
                    <Radio.Button value="acceptable">可接受</Radio.Button>
                  </Radio.Group>
                </Col>

                <Col span={24}>
                  <Checkbox checked={hasImage} onChange={(e) => setHasImage(e.target.checked)}>
                    只看有图片的商品
                  </Checkbox>
                </Col>

                <Col span={24}>
                  <Space>
                    <Button type="primary" onClick={applyAdvancedFilter}>
                      应用筛选
                    </Button>
                    <Button onClick={resetAdvancedFilter}>
                      重置
                    </Button>
                  </Space>
                </Col>
              </Row>
            </div>
          )}
        </div>

        {/* 热门推荐标签 */}
        <div style={{ marginBottom: '16px' }}>
          <Space wrap>
            <Text strong><FireOutlined style={{ color: 'var(--primary-color)' }} /> 热门搜索:</Text>
            <Button size="small" onClick={() => handleSearch('笔记本电脑')} style={{ borderRadius: '12px' }}>笔记本电脑</Button>
            <Button size="small" onClick={() => handleSearch('自行车')} style={{ borderRadius: '12px' }}>自行车</Button>
            <Button size="small" onClick={() => handleSearch('课本')} style={{ borderRadius: '12px' }}>课本</Button>
            <Button size="small" onClick={() => handleSearch('手机')} style={{ borderRadius: '12px' }}>手机</Button>
            <Button size="small" onClick={() => handleSearch('耳机')} style={{ borderRadius: '12px' }}>耳机</Button>
          </Space>
        </div>

        {/* 物品列表 */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : items.length > 0 ? (
          <>
            <Row gutter={[16, 16]}>
              {items.map((item, index) => renderItemCard({...item, isNew: index < 3}, index))}
            </Row>
            
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={pagination?.total || 0}
                onChange={handlePageChange}
                showSizeChanger
                showQuickJumper
              />
            </div>
          </>
        ) : (
          <div className="item-detail-container" style={{ padding: '40px', textAlign: 'center' }}>
            <Empty 
              description={
                <span>
                  没有找到符合条件的物品
                  <br />
                  <Link to="/items/publish">
                    <Button type="primary" style={{ marginTop: 16, borderRadius: '20px' }}>
                      发布物品
                    </Button>
                  </Link>
                </span>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemList; 