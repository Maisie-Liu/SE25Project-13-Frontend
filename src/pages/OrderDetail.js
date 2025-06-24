import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Descriptions, Button, Steps, Divider, Tag, Spin, Typography, Row, Col, message } from 'antd';
import { fetchOrderById, updateOrder } from '../store/actions/orderActions';
import { selectCurrentOrder, selectOrderLoading } from '../store/slices/orderSlice';

const { Step } = Steps;
const { Title, Text } = Typography;

const OrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const order = useSelector(selectCurrentOrder);
  const loading = useSelector(selectOrderLoading);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
  }, [dispatch, id]);

  const handleUpdateStatus = (status) => {
    dispatch(updateOrder({ orderId: id, status }))
      .then(() => {
        message.success('订单状态更新成功');
        dispatch(fetchOrderById(id));
      })
      .catch(() => {
        message.error('更新失败，请重试');
      });
  };

  const getStatusStep = (status) => {
    switch(status) {
      case 'PENDING':
        return 0;
      case 'PAID':
        return 1;
      case 'COMPLETED':
        return 2;
      case 'CANCELLED':
        return 3;
      default:
        return 0;
    }
  };

  const renderActionButtons = () => {
    if (!order) return null;
    
    const { status, role } = order;
    
    if (role === 'BUYER') {
      switch(status) {
        case 'PENDING':
          return (
            <Button 
              type="primary" 
              onClick={() => navigate(`/escrow/${id}`)}
            >
              支付定金
            </Button>
          );
        case 'PAID':
          return (
            <Button 
              type="primary" 
              onClick={() => handleUpdateStatus('COMPLETED')}
            >
              确认收货
            </Button>
          );
        case 'COMPLETED':
        case 'CANCELLED':
          return null;
        default:
          return null;
      }
    } else if (role === 'SELLER') {
      switch(status) {
        case 'PENDING':
          return (
            <Button 
              danger 
              onClick={() => handleUpdateStatus('CANCELLED')}
            >
              取消订单
            </Button>
          );
        case 'PAID':
          return (
            <Button 
              type="primary" 
              onClick={() => handleUpdateStatus('COMPLETED')}
            >
              确认交付
            </Button>
          );
        case 'COMPLETED':
        case 'CANCELLED':
          return null;
        default:
          return null;
      }
    }
    
    return null;
  };

  if (loading || !order) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="order-detail-container">
      <Title level={2}>订单详情</Title>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card>
            <Descriptions title="订单信息" bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
              <Descriptions.Item label="订单编号">{order.id}</Descriptions.Item>
              <Descriptions.Item label="订单状态">
                <Tag color={
                  order.status === 'PENDING' ? 'gold' : 
                  order.status === 'PAID' ? 'blue' : 
                  order.status === 'COMPLETED' ? 'green' : 
                  'red'
                }>
                  {
                    order.status === 'PENDING' ? '待支付' : 
                    order.status === 'PAID' ? '已支付' : 
                    order.status === 'COMPLETED' ? '已完成' : 
                    '已取消'
                  }
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="交易角色">
                <Tag color={order.role === 'BUYER' ? 'blue' : 'orange'}>
                  {order.role === 'BUYER' ? '买家' : '卖家'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="交易对象">
                {order.role === 'BUYER' ? order.seller?.username : order.buyer?.username}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {new Date(order.createdAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="更新时间">
                {new Date(order.updatedAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
            
            <Divider />
            
            <Title level={4}>订单进度</Title>
            <Steps 
              current={getStatusStep(order.status)} 
              status={order.status === 'CANCELLED' ? 'error' : 'process'}
            >
              <Step title="创建订单" description="等待支付定金" />
              <Step title="支付定金" description="等待交易完成" />
              <Step title="交易完成" description="交易成功" />
              {order.status === 'CANCELLED' && (
                <Step title="订单取消" description="交易终止" />
              )}
            </Steps>
            
            <Divider />
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button style={{ marginRight: 8 }} onClick={() => navigate('/my/orders')}>
                返回订单列表
              </Button>
              {renderActionButtons()}
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <img 
                src={order.item.images && order.item.images.length > 0 ? order.item.images[0] : 'https://via.placeholder.com/100x100?text=No+Image'} 
                alt={order.item.title}
                style={{ width: 100, height: 100, marginRight: 16, objectFit: 'cover' }}
              />
              <div>
                <Title level={4}>{order.item.title}</Title>
                <Text type="secondary">{order.item.category}</Text>
              </div>
            </div>
            
            <Divider />
            
            <Descriptions column={1}>
              <Descriptions.Item label="物品价格">¥{order.amount}</Descriptions.Item>
              <Descriptions.Item label="定金金额">¥{order.deposit || 0}</Descriptions.Item>
              {order.escrow && (
                <>
                  <Descriptions.Item label="托管状态">
                    <Tag color={
                      order.escrow.status === 'PENDING' ? 'gold' : 
                      order.escrow.status === 'LOCKED' ? 'blue' : 
                      order.escrow.status === 'RELEASED' ? 'green' : 
                      'red'
                    }>
                      {
                        order.escrow.status === 'PENDING' ? '等待中' : 
                        order.escrow.status === 'LOCKED' ? '已锁定' : 
                        order.escrow.status === 'RELEASED' ? '已释放' : 
                        '已退回'
                      }
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="交易哈希">{order.escrow.transactionHash}</Descriptions.Item>
                </>
              )}
            </Descriptions>
            
            {order.status === 'PENDING' && order.role === 'BUYER' && (
              <div style={{ marginTop: 16 }}>
                <Button 
                  type="primary" 
                  block
                  onClick={() => navigate(`/escrow/${id}`)}
                >
                  前往支付
                </Button>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderDetail; 