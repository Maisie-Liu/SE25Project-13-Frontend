import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Row, Col, Card, Typography, Button, Image, Tag, Descriptions, Divider, 
  Spin, message, Modal, Form, Input, Radio, Space 
} from 'antd';
import { 
  ShoppingCartOutlined, HeartOutlined, HeartFilled, 
  EnvironmentOutlined, CommentOutlined, ShareAltOutlined,
  UserOutlined, ClockCircleOutlined, SafetyOutlined
} from '@ant-design/icons';
import { fetchItemById } from '../store/actions/itemActions';
import { createOrder } from '../store/actions/orderActions';
import { addToFavorite, removeFromFavorite } from '../store/actions/favoriteActions';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import { selectItemDetail, selectItemLoading } from '../store/slices/itemSlice';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const item = useSelector(selectItemDetail);
  const loading = useSelector(selectItemLoading);
  
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [orderForm] = Form.useForm();
  const [isFavorite, setIsFavorite] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // 获取物品详情
  useEffect(() => {
    if (id) {
      dispatch(fetchItemById(id));
    }
  }, [dispatch, id]);
  
  // 处理预订
  const handleOrder = () => {
    if (!isAuthenticated) {
      message.warning('请先登录');
      navigate('/login');
      return;
    }
    
    if (item.status !== 'PUBLISHED') {
      message.warning('该物品当前不可预订');
      return;
    }
    
    setOrderModalVisible(true);
  };
  
  // 提交预订
  const handleSubmitOrder = async (values) => {
    if (!isAuthenticated) {
      message.warning('请先登录');
      navigate('/login');
      return;
    }
    
    setSubmitting(true);
    try {
      const orderData = {
        itemId: id,
        tradeType: values.tradeType,
        tradeLocation: values.tradeLocation,
        buyerMessage: values.buyerMessage
      };
      
      await dispatch(createOrder(orderData)).unwrap();
      message.success('预订成功');
      setOrderModalVisible(false);
      // 刷新物品状态
      dispatch(fetchItemById(id));
    } catch (error) {
      message.error('预订失败: ' + error);
    } finally {
      setSubmitting(false);
    }
  };
  
  // 处理收藏
  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      message.warning('请先登录');
      navigate('/login');
      return;
    }
    
    try {
      if (isFavorite) {
        await dispatch(removeFromFavorite(id)).unwrap();
        setIsFavorite(false);
        message.success('取消收藏成功');
      } else {
        await dispatch(addToFavorite(id)).unwrap();
        setIsFavorite(true);
        message.success('收藏成功');
      }
    } catch (error) {
      message.error('操作失败: ' + error);
    }
  };
  
  // 渲染新旧程度标签
  const renderConditionTag = (condition) => {
    const conditionMap = {
      5: { color: 'green', text: '全新' },
      4: { color: 'cyan', text: '9成新' },
      3: { color: 'blue', text: '7成新' },
      2: { color: 'orange', text: '5成新' },
      1: { color: 'red', text: '3成新以下' },
    };
    
    const conditionInfo = conditionMap[condition] || { color: 'default', text: '未知' };
    return <Tag color={conditionInfo.color}>{conditionInfo.text}</Tag>;
  };
  
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }
  
  if (!item) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Title level={3}>物品不存在或已被删除</Title>
        <Button type="primary" onClick={() => navigate('/')}>返回首页</Button>
      </div>
    );
  }
  
  return (
    <div className="container" style={{ padding: '20px 0' }}>
      <Card>
        <Row gutter={[24, 24]}>
          {/* 物品图片 */}
          <Col xs={24} sm={24} md={12} lg={10}>
            <Image.PreviewGroup>
              <div style={{ textAlign: 'center' }}>
                <Image
                  src={item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/400x400?text=No+Image'}
                  alt={item.name}
                  style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                {item.images && item.images.slice(1).map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    alt={`${item.name}-${index+1}`}
                    width={80}
                    height={80}
                    style={{ marginRight: 8, objectFit: 'cover' }}
                  />
                ))}
              </div>
            </Image.PreviewGroup>
          </Col>
          
          {/* 物品信息 */}
          <Col xs={24} sm={24} md={12} lg={14}>
            <Title level={2}>{item.name}</Title>
            
            <Divider />
            
            <Title level={3} type="danger" style={{ marginBottom: 24 }}>
              ￥{item.price?.toFixed(2)}
            </Title>
            
            <Descriptions column={1} bordered>
              <Descriptions.Item label="物品分类">{item.categoryName}</Descriptions.Item>
              <Descriptions.Item label="新旧程度">{renderConditionTag(item.condition)}</Descriptions.Item>
              <Descriptions.Item label="库存数量">{item.quantity}</Descriptions.Item>
              <Descriptions.Item label="发布时间">{item.createTime}</Descriptions.Item>
              <Descriptions.Item label="物品状态">
                {item.status === 'PUBLISHED' ? (
                  <Tag color="green">可预订</Tag>
                ) : item.status === 'RESERVED' ? (
                  <Tag color="orange">已预订</Tag>
                ) : item.status === 'SOLD' ? (
                  <Tag color="red">已售出</Tag>
                ) : (
                  <Tag color="default">未上架</Tag>
                )}
              </Descriptions.Item>
            </Descriptions>
            
            <div style={{ marginTop: 24 }}>
              <Space>
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<ShoppingCartOutlined />}
                  onClick={handleOrder}
                  disabled={item.status !== 'PUBLISHED'}
                >
                  立即预订
                </Button>
                
                <Button
                  type={isFavorite ? "default" : "dashed"}
                  size="large"
                  icon={isFavorite ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                  onClick={handleToggleFavorite}
                >
                  {isFavorite ? '已收藏' : '收藏'}
                </Button>
              </Space>
            </div>
            
            <div style={{ marginTop: 16 }}>
              <Space>
                <div>
                  <UserOutlined /> 卖家: {item.sellerName}
                </div>
                <div>
                  <ClockCircleOutlined /> 浏览: {item.viewCount || 0}次
                </div>
              </Space>
            </div>
          </Col>
        </Row>
        
        <Divider orientation="left">物品详情</Divider>
        
        <div style={{ padding: '0 16px' }}>
          <Paragraph style={{ whiteSpace: 'pre-wrap', fontSize: 16 }}>
            {item.description || '暂无描述'}
          </Paragraph>
        </div>
      </Card>
      
      {/* 预订弹窗 */}
      <Modal
        title="预订物品"
        open={orderModalVisible}
        onCancel={() => setOrderModalVisible(false)}
        footer={null}
      >
        <Form
          form={orderForm}
          layout="vertical"
          onFinish={handleSubmitOrder}
          initialValues={{
            tradeType: 1, // 默认线下交易
          }}
        >
          <Form.Item
            name="tradeType"
            label="交易方式"
            rules={[{ required: true, message: '请选择交易方式' }]}
          >
            <Radio.Group>
              <Radio value={1}>线下交易</Radio>
              <Radio value={2}>定金托管</Radio>
            </Radio.Group>
          </Form.Item>
          
          <Form.Item
            name="tradeLocation"
            label="交易地点"
            rules={[{ required: true, message: '请输入交易地点' }]}
          >
            <Input 
              prefix={<EnvironmentOutlined />} 
              placeholder="请输入交易地点，如：学校图书馆门口" 
            />
          </Form.Item>
          
          <Form.Item
            name="buyerMessage"
            label="买家留言"
          >
            <TextArea 
              rows={4} 
              placeholder="可以留言给卖家，如：期望的交易时间、特殊要求等" 
            />
          </Form.Item>
          
          <Form.Item>
            <div style={{ textAlign: 'right' }}>
              <Button 
                style={{ marginRight: 8 }} 
                onClick={() => setOrderModalVisible(false)}
              >
                取消
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={submitting}
              >
                确认预订
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ItemDetail; 