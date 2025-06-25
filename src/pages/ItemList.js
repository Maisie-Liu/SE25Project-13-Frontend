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

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;
const { Search } = Input;
const { Option } = Select;

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
      page: currentPage,
      size: pageSize,
      sort: sortBy,
      order: sortOrder
    };
    
    if (keyword) {
      params.keyword = keyword;
    }
    
    if (category) {
      params.category = category;
    }

    if (condition !== 'all') {
      params.condition = condition;
    }

    if (priceRange[0] > 0 || priceRange[1] < 5000) {
      params.minPrice = priceRange[0];
      params.maxPrice = priceRange[1];
    }
    
    if (campus) {
      params.campus = campus;
    }

    if (hasImage) {
      params.hasImage = hasImage;
    }
    
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

  const renderItemCard = (item) => (
    <Col xs={viewMode === 'grid' ? 12 : 24} sm={viewMode === 'grid' ? 8 : 24} md={viewMode === 'grid' ? 6 : 24} lg={viewMode === 'grid' ? 6 : 24} key={item.id} style={{ marginBottom: 16 }}>
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
          bodyStyle={{ padding: '12px' }}
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
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="flex-between">
                <Title level={5} className="text-ellipsis" style={{ marginBottom: '8px', flex: 1 }}>{item.name}</Title>
                <div className="price-tag" style={{ marginLeft: '8px' }}>{item.price ? `¥${item.price}` : '面议'}</div>
              </div>
              <div style={{ marginBottom: '8px' }}>
                {item.condition === 1 && <Tag color="green">全新</Tag>}
                {item.condition > 1 && item.condition <= 3 && <Tag color="cyan">几乎全新</Tag>}
                {item.condition > 3 && item.condition <= 6 && <Tag color="blue">轻度使用</Tag>}
                {item.condition > 6 && item.condition <= 9 && <Tag color="orange">中度使用</Tag>}
                {item.condition === 10 && <Tag color="red">重度使用</Tag>}
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
        {/* 顶部搜索和筛选区 */}
        <div className="item-detail-container" style={{ marginBottom: '24px', padding: '20px', background: '#fff', borderRadius: '16px', boxShadow: 'var(--card-shadow)' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={10}>
              <div style={{ paddingRight: '15px' }}>
                <Search
                  placeholder="搜索物品..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onSearch={handleSearch}
                  enterButton={<><SearchOutlined /> 搜索</>}
                  className="search-box"
                  style={{ maxWidth: '100%' }}
                />
              </div>
            </Col>
            <Col xs={12} md={7}>
              <Space size="middle">
                <FilterOutlined style={{ color: 'var(--primary-color)', fontSize: '16px' }} />
                <Text strong>分类:</Text>
                <Select
                  value={category || ''}
                  onChange={handleCategoryChange}
                  style={{ width: 140 }}
                  size="middle"
                  dropdownStyle={{ borderRadius: '8px' }}
                >
                  <Option value="">全部</Option>
                  <Option value="1">电子产品</Option>
                  <Option value="2">图书教材</Option>
                  <Option value="3">生活用品</Option>
                  <Option value="4">服装鞋帽</Option>
                  <Option value="5">运动户外</Option>
                  <Option value="6">其他物品</Option>
                </Select>
              </Space>
            </Col>
            <Col xs={12} md={7}>
              <Space size="middle">
                <SortAscendingOutlined style={{ color: 'var(--primary-color)', fontSize: '16px' }} />
                <Text strong>排序:</Text>
                <Select
                  defaultValue="createTime-desc"
                  onChange={handleSortChange}
                  style={{ width: 140 }}
                  size="middle"
                  dropdownStyle={{ borderRadius: '8px' }}
                >
                  <Option value="createTime-desc">最新发布</Option>
                  <Option value="price-asc">价格从低到高</Option>
                  <Option value="price-desc">价格从高到低</Option>
                  <Option value="viewCount-desc">浏览量最多</Option>
                </Select>
              </Space>
            </Col>
          </Row>
          
          <Divider style={{ margin: '16px 0' }} />
          
          <div className="flex-between">
            <Button 
              type={showFilters ? "primary" : "default"} 
              icon={<FilterOutlined />} 
              onClick={toggleFilters}
              style={{ borderRadius: '20px' }}
            >
              高级筛选
            </Button>
            
            <Radio.Group value={viewMode} onChange={handleViewModeChange} buttonStyle="solid">
              <Tooltip title="网格视图">
                <Radio.Button value="grid"><AppstoreOutlined /></Radio.Button>
              </Tooltip>
              <Tooltip title="列表视图">
                <Radio.Button value="list"><BarsOutlined /></Radio.Button>
              </Tooltip>
            </Radio.Group>
          </div>
          
          {showFilters && (
            <div style={{ marginTop: '16px', padding: '16px', background: 'var(--background-color)', borderRadius: '8px' }}>
              <Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <div>
                    <Text strong>价格范围:</Text>
                    <Slider
                      range
                      min={0}
                      max={5000}
                      step={100}
                      value={priceRange}
                      onChange={handlePriceRangeChange}
                      tipFormatter={value => `¥${value}`}
                    />
                    <div className="flex-between">
                      <Text>¥{priceRange[0]}</Text>
                      <Text>¥{priceRange[1]}</Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div>
                    <Text strong>物品状态:</Text>
                    <div style={{ marginTop: '8px' }}>
                      <Radio.Group value={condition} onChange={handleConditionChange}>
                        <Radio value="all">全部</Radio>
                        <Radio value="1">全新</Radio>
                        <Radio value="2-3">几乎全新</Radio>
                        <Radio value="4-6">轻度使用</Radio>
                        <Radio value="7-9">中度使用</Radio>
                        <Radio value="10">重度使用</Radio>
                      </Radio.Group>
                    </div>
                  </div>
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
              {items.map((item, index) => renderItemCard({...item, isNew: index < 3}))}
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