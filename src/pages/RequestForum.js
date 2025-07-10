import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Tabs, 
  Tag, 
  Typography, 
  Space, 
  Divider, 
  Select, 
  Input, 
  Avatar, 
  Empty, 
  Pagination,
  message 
} from 'antd';
import { 
  ShoppingOutlined, 
  TagsOutlined, 
  EyeOutlined, 
  MessageOutlined, 
  LikeOutlined, 
  UserOutlined, 
  SearchOutlined, 
  FilterOutlined,
  ShoppingCartOutlined,
  GiftOutlined
} from '@ant-design/icons';
import './RequestForum.css';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { Search } = Input;

// 模拟数据 - 真实环境中应该从API获取
const mockBuyRequests = [
  {
    id: 1,
    title: '求购 MacBook Pro 2021款',
    type: 'buy',
    author: {
      id: 101,
      name: '00',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=male&0',
    },
    category: '电子产品',
    content: '我想购买一台MacBook Pro 2021款，M1芯片，16G内存，512G硬盘，深空灰色。成色要求9成新以上，有意者请联系。',
    expectedPrice: 9000,
    isNegotiable: true,
    condition: '9成新以上',
    createdAt: '2023-07-15',
    views: 156,
    comments: 12,
    likes: 5,
    tags: ['电子产品', 'Apple', '笔记本电脑']
  },
  {
    id: 2,
    title: '求购 数据结构与算法分析 第3版教材',
    type: 'buy',
    author: {
      id: 102,
      name: '小羊',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=male&1',
    },
    category: '图书教材',
    content: '求购《数据结构与算法分析》第3版教材，C++语言描述，机械工业出版社。成色无要求，有笔记更好。',
    expectedPrice: 30,
    isNegotiable: true,
    condition: '不限',
    createdAt: '2023-07-16',
    views: 89,
    comments: 3,
    likes: 1,
    tags: ['图书教材', '教材', '计算机']
  },
  {
    id: 3,
    title: '求购 自行车 通勤用',
    type: 'buy',
    author: {
      id: 103,
      name: '痛痛',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=female&2',
    },
    category: '运动户外',
    content: '想买一辆二手自行车用于校园通勤，要求车况良好，变速正常，刹车灵敏，有前筐更好。',
    expectedPrice: 300,
    isNegotiable: true,
    condition: '能正常使用',
    createdAt: '2023-07-14',
    views: 210,
    comments: 18,
    likes: 7,
    tags: ['运动户外', '自行车', '交通工具']
  },
  {
    id: 4,
    title: '求购 显示器 24英寸以上',
    type: 'buy',
    author: {
      id: 104,
      name: 'xiaote',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=female&3',
    },
    category: '电子产品',
    content: '想买一个二手显示器，24英寸以上，IPS屏，分辨率1080p以上，有HDMI接口，最好带音箱。',
    expectedPrice: 500,
    isNegotiable: true,
    condition: '无明显划痕',
    createdAt: '2023-07-18',
    views: 76,
    comments: 5,
    likes: 2,
    tags: ['电子产品', '显示器', '电脑配件']
  }
];

const mockSellOffers = [
  {
    id: 101,
    title: '出售 iPad Pro 2020 二手',
    type: 'sell',
    author: {
      id: 105,
      name: '校园小卖家',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=male&4',
    },
    category: '电子产品',
    content: '出售二手iPad Pro 2020款，11英寸，256G，WiFi版，银色，9.5成新，无划痕，配件齐全，有原装笔。',
    price: 4200,
    isNegotiable: true,
    condition: '9.5成新',
    createdAt: '2023-07-17',
    views: 245,
    comments: 23,
    likes: 15,
    tags: ['电子产品', 'Apple', '平板电脑']
  },
  {
    id: 102,
    title: '出售 《高等数学》《线性代数》教材',
    type: 'sell',
    author: {
      id: 106,
      name: '毕业生',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=female&5',
    },
    category: '图书教材',
    content: '毕业清理，出售高等数学上下册和线性代数教材，有完整笔记，习题全部完成，适合大一新生。',
    price: 30,
    isNegotiable: true,
    condition: '8成新',
    createdAt: '2023-07-16',
    views: 178,
    comments: 14,
    likes: 8,
    tags: ['图书教材', '教材', '数学']
  },
  {
    id: 103,
    title: '出售 小米手环7 全新未拆封',
    type: 'sell',
    author: {
      id: 107,
      name: '数码达人',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=male&6',
    },
    category: '电子产品',
    content: '出售小米手环7，全新未拆封，原价249，现在220出，校内面交。',
    price: 220,
    isNegotiable: false,
    condition: '全新',
    createdAt: '2023-07-18',
    views: 132,
    comments: 7,
    likes: 4,
    tags: ['电子产品', '小米', '智能手环']
  },
  {
    id: 104,
    title: '出售 冰箱小型宿舍用',
    type: 'sell',
    author: {
      id: 108,
      name: '即将毕业',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=female&7',
    },
    category: '生活用品',
    content: '毕业转让，宿舍小冰箱，40L容量，制冷效果好，使用一年半，无故障，现150元出售，自提。',
    price: 150,
    isNegotiable: true,
    condition: '9成新',
    createdAt: '2023-07-15',
    views: 201,
    comments: 16,
    likes: 9,
    tags: ['生活用品', '电器', '宿舍必备']
  }
];

const RequestForum = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('buy');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // 根据当前标签加载数据
  useEffect(() => {
    // 在实际应用中，这里应该调用API获取数据
    if (activeTab === 'buy') {
      setPosts(mockBuyRequests);
    } else {
      setPosts(mockSellOffers);
    }
    setCurrentPage(1);
  }, [activeTab]);

  // 处理筛选和搜索
  const filterPosts = () => {
    let filteredPosts = activeTab === 'buy' ? [...mockBuyRequests] : [...mockSellOffers];
    
    // 分类筛选
    if (category !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }
    
    // 搜索筛选
    if (searchText) {
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchText.toLowerCase()) || 
        post.content.toLowerCase().includes(searchText.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()))
      );
    }
    
    // 排序
    switch (sortBy) {
      case 'latest':
        filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'views':
        filteredPosts.sort((a, b) => b.views - a.views);
        break;
      case 'comments':
        filteredPosts.sort((a, b) => b.comments - a.comments);
        break;
      case 'price_low':
        filteredPosts.sort((a, b) => (a.price || a.expectedPrice) - (b.price || b.expectedPrice));
        break;
      case 'price_high':
        filteredPosts.sort((a, b) => (b.price || b.expectedPrice) - (a.price || a.expectedPrice));
        break;
      default:
        break;
    }
    
    return filteredPosts;
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handlePublish = () => {
    navigate(activeTab === 'buy' ? '/publish-request' : '/publish-item');
  };

  const handleViewPost = (id) => {
    message.info(`查看帖子 ID: ${id}`);
    // 实际应用中应导航到帖子详情页
    // navigate(`/forum/post/${id}`);
  };

  const handleLike = (id) => {
    message.success('点赞成功');
    // 实际应用中应调用API进行点赞
  };

  const handleComment = (id) => {
    message.info('跳转到评论区');
    // 实际应用中应导航到评论区
  };

  const filteredPosts = filterPosts();
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="request-forum-container">
      <div className="forum-header">
        <Title level={2} className="forum-title">校园交易论坛</Title>
        <Paragraph className="forum-description">
          这里是同学们发布求购信息和出售物品的地方，帮助您快速找到所需物品或卖出闲置物品。
        </Paragraph>
        <Divider />
      </div>
      
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        className="forum-tabs"
      >
        <TabPane 
          tab={
            <span>
              <ShoppingCartOutlined /> 求购信息
            </span>
          } 
          key="buy"
        >
          <div className="post-filter-bar">
            <div>
              <div className="filter-group">
                <span className="filter-label"><FilterOutlined /> 筛选：</span>
                <Select 
                  value={category} 
                  onChange={setCategory} 
                  style={{ width: 150 }}
                >
                  <Option value="all">全部分类</Option>
                  <Option value="电子产品">电子产品</Option>
                  <Option value="图书教材">图书教材</Option>
                  <Option value="生活用品">生活用品</Option>
                  <Option value="服装鞋帽">服装鞋帽</Option>
                  <Option value="运动户外">运动户外</Option>
                  <Option value="其他">其他</Option>
                </Select>
                
                <Select 
                  value={sortBy} 
                  onChange={setSortBy} 
                  style={{ width: 150 }}
                >
                  <Option value="latest">最新发布</Option>
                  <Option value="views">浏览最多</Option>
                  <Option value="comments">评论最多</Option>
                  <Option value="price_low">价格从低到高</Option>
                  <Option value="price_high">价格从高到低</Option>
                </Select>
              </div>
              
              <div className="filter-group">
                <Search 
                  placeholder="搜索求购信息" 
                  onSearch={handleSearch} 
                  style={{ width: 300 }}
                  allowClear
                />
              </div>
            </div>
            
            <div className="post-actions">
              <Button 
                type="primary" 
                icon={<ShoppingOutlined />}
                className="create-post-button"
                onClick={handlePublish}
              >
                发布求购信息
              </Button>
            </div>
          </div>
          
          {paginatedPosts.length > 0 ? (
            <Row gutter={[24, 24]}>
              {paginatedPosts.map(post => (
                <Col xs={24} md={12} key={post.id}>
                  <Card 
                    className="post-card"
                    hoverable
                    onClick={() => handleViewPost(post.id)}
                  >
                    <div className="post-card-title">
                      <ShoppingOutlined className="post-card-title-icon" /> {post.title}
                    </div>
                    
                    <div className="post-meta">
                      <span>发布于: {post.createdAt}</span>
                      <span>期望价格: ¥{post.expectedPrice}{post.isNegotiable ? ' (可议价)' : ''}</span>
                    </div>
                    
                    <div className="post-tags">
                      {post.tags.map((tag, index) => (
                        <Tag color="blue" key={index} className="post-tag">{tag}</Tag>
                      ))}
                      <Tag color="orange">{post.condition}</Tag>
                    </div>
                    
                    <div className="post-content">
                      {post.content}
                    </div>
                    
                    <div className="post-footer">
                      <div className="post-user-info">
                        <Avatar 
                          src={post.author.avatar} 
                          size="small" 
                          className="post-user-avatar"
                        />
                        <span className="post-user-name">{post.author.name}</span>
                      </div>
                      
                      <div className="post-actions-menu">
                        <span className="post-action-item">
                          <EyeOutlined className="post-action-icon" /> {post.views}
                        </span>
                        <span 
                          className="post-action-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleComment(post.id);
                          }}
                        >
                          <MessageOutlined className="post-action-icon" /> {post.comments}
                        </span>
                        <span 
                          className="post-action-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(post.id);
                          }}
                        >
                          <LikeOutlined className="post-action-icon" /> {post.likes}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="empty-container">
              <Empty 
                description={
                  <span>
                    暂无求购信息
                    {searchText && <span>，请尝试其他搜索条件</span>}
                  </span>
                }
              />
            </div>
          )}
          
          {filteredPosts.length > pageSize && (
            <div className="pagination-container">
              <Pagination 
                current={currentPage}
                pageSize={pageSize}
                total={filteredPosts.length}
                onChange={setCurrentPage}
                showSizeChanger={false}
              />
            </div>
          )}
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <GiftOutlined /> 出售物品
            </span>
          } 
          key="sell"
        >
          <div className="post-filter-bar">
            <div>
              <div className="filter-group">
                <span className="filter-label"><FilterOutlined /> 筛选：</span>
                <Select 
                  value={category} 
                  onChange={setCategory} 
                  style={{ width: 150 }}
                >
                  <Option value="all">全部分类</Option>
                  <Option value="电子产品">电子产品</Option>
                  <Option value="图书教材">图书教材</Option>
                  <Option value="生活用品">生活用品</Option>
                  <Option value="服装鞋帽">服装鞋帽</Option>
                  <Option value="运动户外">运动户外</Option>
                  <Option value="其他">其他</Option>
                </Select>
                
                <Select 
                  value={sortBy} 
                  onChange={setSortBy} 
                  style={{ width: 150 }}
                >
                  <Option value="latest">最新发布</Option>
                  <Option value="views">浏览最多</Option>
                  <Option value="comments">评论最多</Option>
                  <Option value="price_low">价格从低到高</Option>
                  <Option value="price_high">价格从高到低</Option>
                </Select>
              </div>
              
              <div className="filter-group">
                <Search 
                  placeholder="搜索出售物品" 
                  onSearch={handleSearch} 
                  style={{ width: 300 }}
                  allowClear
                />
              </div>
            </div>
            
            <div className="post-actions">
              <Button 
                type="primary" 
                icon={<TagsOutlined />}
                className="create-post-button"
                onClick={handlePublish}
              >
                发布出售信息
              </Button>
            </div>
          </div>
          
          {paginatedPosts.length > 0 ? (
            <Row gutter={[24, 24]}>
              {paginatedPosts.map(post => (
                <Col xs={24} md={12} key={post.id}>
                  <Card 
                    className="post-card"
                    hoverable
                    onClick={() => handleViewPost(post.id)}
                  >
                    <div className="post-card-title">
                      <TagsOutlined className="post-card-title-icon" /> {post.title}
                    </div>
                    
                    <div className="post-meta">
                      <span>发布于: {post.createdAt}</span>
                      <span>售价: ¥{post.price}{post.isNegotiable ? ' (可议价)' : ''}</span>
                    </div>
                    
                    <div className="post-tags">
                      {post.tags.map((tag, index) => (
                        <Tag color="green" key={index} className="post-tag">{tag}</Tag>
                      ))}
                      <Tag color="orange">{post.condition}</Tag>
                    </div>
                    
                    <div className="post-content">
                      {post.content}
                    </div>
                    
                    <div className="post-footer">
                      <div className="post-user-info">
                        <Avatar 
                          src={post.author.avatar} 
                          size="small" 
                          className="post-user-avatar"
                        />
                        <span className="post-user-name">{post.author.name}</span>
                      </div>
                      
                      <div className="post-actions-menu">
                        <span className="post-action-item">
                          <EyeOutlined className="post-action-icon" /> {post.views}
                        </span>
                        <span 
                          className="post-action-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleComment(post.id);
                          }}
                        >
                          <MessageOutlined className="post-action-icon" /> {post.comments}
                        </span>
                        <span 
                          className="post-action-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(post.id);
                          }}
                        >
                          <LikeOutlined className="post-action-icon" /> {post.likes}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="empty-container">
              <Empty 
                description={
                  <span>
                    暂无出售信息
                    {searchText && <span>，请尝试其他搜索条件</span>}
                  </span>
                }
              />
            </div>
          )}
          
          {filteredPosts.length > pageSize && (
            <div className="pagination-container">
              <Pagination 
                current={currentPage}
                pageSize={pageSize}
                total={filteredPosts.length}
                onChange={setCurrentPage}
                showSizeChanger={false}
              />
            </div>
          )}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default RequestForum; 