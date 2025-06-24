import React, { useEffect } from 'react';
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
  Tag
} from 'antd';
import { 
  SearchOutlined, 
  FireOutlined, 
  ClockCircleOutlined,
  ShoppingOutlined,
  RightOutlined
} from '@ant-design/icons';
import { fetchItems, fetchRecommendedItems } from '../store/actions/itemActions';
import { 
  selectItems, 
  selectRecommendedItems, 
  selectItemLoading 
} from '../store/slices/itemSlice';

const { Title, Paragraph } = Typography;
const { Search } = Input;
const { Meta } = Card;

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectItems);
  const recommendedItems = useSelector(selectRecommendedItems);
  const loading = useSelector(selectItemLoading);

  // 加载最新物品和推荐物品
  useEffect(() => {
    dispatch(fetchItems({ pageNum: 1, pageSize: 8, sort: 'createTime', order: 'desc' }));
    dispatch(fetchRecommendedItems({ pageNum: 1, pageSize: 4 }));
  }, [dispatch]);

  // 处理搜索
  const handleSearch = (value) => {
    navigate(`/items?keyword=${encodeURIComponent(value)}`);
  };

  // 渲染物品卡片
  const renderItemCard = (item) => (
    <Col xs={24} sm={12} md={8} lg={6} key={item.id} style={{ marginBottom: 16 }}>
      <Link to={`/items/${item.id}`}>
        <Card
          hoverable
          className="item-card"
          cover={
            <img
              alt={item.name}
              src={item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/300x200?text=No+Image'}
              className="item-image"
            />
          }
        >
          <Meta
            title={item.name}
            description={
              <>
                <div className="item-price">¥{item.price}</div>
                <div>
                  {item.condition === 1 && <Tag color="green">全新</Tag>}
                  {item.condition > 1 && item.condition <= 3 && <Tag color="cyan">几乎全新</Tag>}
                  {item.condition > 3 && item.condition <= 6 && <Tag color="blue">轻度使用</Tag>}
                  {item.condition > 6 && item.condition <= 9 && <Tag color="orange">中度使用</Tag>}
                  {item.condition === 10 && <Tag color="red">重度使用</Tag>}
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
      {/* 轮播图 */}
      <Carousel autoplay style={{ marginBottom: 24 }}>
        <div>
          <div style={{ height: 400, background: '#364d79', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: '#fff', textAlign: 'center' }}>
              <Title level={2} style={{ color: '#fff' }}>校园二手交易平台</Title>
              <Paragraph style={{ color: '#fff' }}>让闲置物品流通起来，让校园生活更加便利</Paragraph>
              <Button type="primary" size="large" onClick={() => navigate('/items')}>
                开始浏览
              </Button>
            </div>
          </div>
        </div>
        <div>
          <div style={{ height: 400, background: '#2f54eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: '#fff', textAlign: 'center' }}>
              <Title level={2} style={{ color: '#fff' }}>发布闲置物品</Title>
              <Paragraph style={{ color: '#fff' }}>一键发布，快速售出</Paragraph>
              <Button type="primary" size="large" onClick={() => navigate('/items/publish')}>
                立即发布
              </Button>
            </div>
          </div>
        </div>
      </Carousel>

      <div className="container">
        {/* 搜索区域 */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Title level={2}>搜索你想要的物品</Title>
          <Search
            placeholder="输入关键词搜索"
            enterButton={<><SearchOutlined /> 搜索</>}
            size="large"
            onSearch={handleSearch}
            style={{ maxWidth: 600, width: '100%' }}
          />
        </div>

        {/* 分类导航 */}
        <div style={{ marginBottom: 48 }}>
          <Title level={3}>物品分类</Title>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={8} md={6} lg={4}>
              <Card hoverable onClick={() => navigate('/items?category=1')}>
                <div className="text-center">
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📱</div>
                  <div>电子产品</div>
                </div>
              </Card>
            </Col>
            <Col xs={12} sm={8} md={6} lg={4}>
              <Card hoverable onClick={() => navigate('/items?category=2')}>
                <div className="text-center">
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📚</div>
                  <div>图书教材</div>
                </div>
              </Card>
            </Col>
            <Col xs={12} sm={8} md={6} lg={4}>
              <Card hoverable onClick={() => navigate('/items?category=3')}>
                <div className="text-center">
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🏠</div>
                  <div>生活用品</div>
                </div>
              </Card>
            </Col>
            <Col xs={12} sm={8} md={6} lg={4}>
              <Card hoverable onClick={() => navigate('/items?category=4')}>
                <div className="text-center">
                  <div style={{ fontSize: 32, marginBottom: 8 }}>👕</div>
                  <div>服装鞋帽</div>
                </div>
              </Card>
            </Col>
            <Col xs={12} sm={8} md={6} lg={4}>
              <Card hoverable onClick={() => navigate('/items?category=5')}>
                <div className="text-center">
                  <div style={{ fontSize: 32, marginBottom: 8 }}>⚽</div>
                  <div>运动户外</div>
                </div>
              </Card>
            </Col>
            <Col xs={12} sm={8} md={6} lg={4}>
              <Card hoverable onClick={() => navigate('/items?category=6')}>
                <div className="text-center">
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🎁</div>
                  <div>其他物品</div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>

        {/* 最新物品 */}
        <div style={{ marginBottom: 48 }}>
          <div className="flex-between mb-16">
            <Title level={3}><ClockCircleOutlined /> 最新上架</Title>
            <Button type="link" onClick={() => navigate('/items')}>
              查看更多 <RightOutlined />
            </Button>
          </div>
          
          {loading ? (
            <div className="text-center" style={{ padding: 40 }}>
              <Spin size="large" />
            </div>
          ) : items.length > 0 ? (
            <Row gutter={[16, 16]}>
              {items.map(item => renderItemCard(item))}
            </Row>
          ) : (
            <Empty description="暂无物品" />
          )}
        </div>

        {/* 推荐物品 */}
        <div style={{ marginBottom: 48 }}>
          <div className="flex-between mb-16">
            <Title level={3}><FireOutlined /> 推荐物品</Title>
            <Button type="link" onClick={() => navigate('/items')}>
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

        {/* 平台特色 */}
        <div style={{ marginBottom: 48 }}>
          <Title level={3} className="text-center">平台特色</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={8}>
              <Card>
                <div className="text-center">
                  <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
                  <Title level={4}>智能搜索</Title>
                  <Paragraph>
                    强大的搜索功能，帮助你快速找到心仪物品
                  </Paragraph>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <div className="text-center">
                  <div style={{ fontSize: 40, marginBottom: 16 }}>🤖</div>
                  <Title level={4}>AI描述生成</Title>
                  <Paragraph>
                    上传图片，AI自动生成物品描述，发布更轻松
                  </Paragraph>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <div className="text-center">
                  <div style={{ fontSize: 40, marginBottom: 16 }}>🔒</div>
                  <Title level={4}>安全交易</Title>
                  <Paragraph>
                    校园内交易，安全便捷，支持线下当面交易
                  </Paragraph>
                </div>
              </Card>
            </Col>
          </Row>
        </div>

        {/* 发布物品引导 */}
        <div style={{ marginBottom: 48, background: '#f0f7ff', padding: 24, borderRadius: 8 }}>
          <Row gutter={24} align="middle">
            <Col xs={24} md={16}>
              <Title level={3}>有闲置物品要出售？</Title>
              <Paragraph>
                快来发布你的闲置物品，让它们找到新的主人！
                只需简单几步，填写物品信息，上传图片，即可发布。
              </Paragraph>
            </Col>
            <Col xs={24} md={8} className="text-center">
              <Button 
                type="primary" 
                size="large" 
                icon={<ShoppingOutlined />}
                onClick={() => navigate('/items/publish')}
              >
                立即发布物品
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default Home; 