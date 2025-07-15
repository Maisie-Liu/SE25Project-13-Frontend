import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Descriptions, Button, Steps, Divider, Tag, Spin, Typography, Row, Col, message, Modal, Input, Rate } from 'antd';
import { fetchOrderById, updateOrder, confirmOrder, deliverOrder, confirmReceive, commentOrder, cancelOrder, rejectOrder } from '../store/actions/orderActions';
import { selectCurrentOrder, selectOrderLoading } from '../store/slices/orderSlice';
import { selectUser } from '../store/slices/authSlice';

const { Step } = Steps;
const { Title, Text } = Typography;

const OrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const order = useSelector(selectCurrentOrder);
  const loading = useSelector(selectOrderLoading);
  const user = useSelector(selectUser);

  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [deliverModalVisible, setDeliverModalVisible] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');

  const isBuyer = user && order && String(user.id) === String(order.buyerId);
  const isSeller = user && order && String(user.id) === String(order.sellerId);

  // 判断当前用户是否已评价
  const hasCommented = order ? ((isBuyer && order.sellerComment) || (isSeller && order.buyerComment)) : false;
  // 本地显示用的状态
  let displayStatus = order ? order.status : 0;
  if (order && order.status === 3 && hasCommented) {
    displayStatus = 4;
  }

  // 物品成色映射表
  const conditionMap = {
    0: '全新',
    1: '9成新',
    2: '8成新',
    3: '7成新',
    4: '6成新',
    5: '5成新',
    6: '4成新',
    7: '3成新',
    8: '2成新',
    9: '1成新'
  };

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

  const handleConfirmOrder = async () => {
    try {
      await dispatch(confirmOrder({ orderId: id })).unwrap();
      message.success('订单已确认');
      dispatch(fetchOrderById(id));
    } catch (e) {
      message.error('操作失败');
    }
  };

  const handleDeliverOrder = async () => {
    setDeliverModalVisible(true);
  };

  const handleSubmitDeliver = async () => {
    if (!trackingNumber.trim()) {
      message.warning('请输入快递单号');
      return;
    }
    try {
      await dispatch(deliverOrder({ orderId: id, trackingNumber })).unwrap();
      message.success('发货成功');
      setDeliverModalVisible(false);
      setTrackingNumber('');
      dispatch(fetchOrderById(id));
    } catch (e) {
      message.error('发货失败');
    }
  };

  const handleConfirmReceive = async () => {
    try {
      await dispatch(confirmReceive(id)).unwrap();
      message.success('确认收货成功');
      dispatch(fetchOrderById(id));
    } catch (e) {
      message.error('操作失败');
    }
  };

  const handleOpenComment = () => {
    setCommentModalVisible(true);
  };

  const handleSubmitComment = async () => {
    if (!commentContent.trim()) {
      message.warning('评价内容不能为空');
      return;
    }
    if (!rating) {
      message.warning('请给出评分');
      return;
    }
    setCommentSubmitting(true);
    try {
      await dispatch(commentOrder({ orderId: id, comment: commentContent, isBuyer, rating })).unwrap();
      message.success('评价成功');
      setCommentModalVisible(false);
      setCommentContent('');
      setRating(5);
      dispatch(fetchOrderById(id));
    } catch (e) {
      message.error('评价失败');
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleRejectOrder = async () => {
    try {
      await dispatch(rejectOrder({ orderId: id })).unwrap();
      message.success('已拒绝预定，订单已取消');
      dispatch(fetchOrderById(id));
    } catch (e) {
      message.error('操作失败');
    }
  };

  const renderActionButtons = () => {
    if (!order || !user) return null;
    const status = displayStatus;
    // 状态0：待确定，1：待发货，2：待收货，3：待评价
    if (isSeller) {
      if (status === 0) {
        return <>
          <Button type="primary" onClick={handleConfirmOrder} style={{marginRight: 8}}>确认订单</Button>
          <Button danger onClick={handleRejectOrder}>拒绝预定</Button>
        </>;
      }
      if (status === 1) {
        return <Button type="primary" onClick={handleDeliverOrder}>发货</Button>;
      }
      if (order.status === 3 && !order.buyerComment && isSeller) {
        return <Button type="primary" onClick={handleOpenComment}>评价买家</Button>;
      }
    }
    if (isBuyer) {
      if (status === 2) {
        return <Button type="primary" onClick={handleConfirmReceive}>确认收货</Button>;
      }
      if (order.status === 3 && !order.sellerComment && isBuyer) {
        return <Button type="primary" onClick={handleOpenComment}>评价卖家</Button>;
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
                  displayStatus === 0 ? 'gold' : 
                  displayStatus === 1 ? 'blue' : 
                  displayStatus === 2 ? 'orange' :
                  displayStatus === 3 ? 'green' : 
                  'red'
                }>
                  {
                    displayStatus === 0 ? '待确认' : 
                    displayStatus === 1 ? '待发货' : 
                    displayStatus === 2 ? '待收货' : 
                    displayStatus === 3 ? '待评价' : 
                    displayStatus === 4 ? '已完成' : 
                    displayStatus === 5 ? '已取消' :
                    '未知状态'
                  }
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="交易角色">
                <Tag color={isBuyer ? 'blue' : 'orange'}>
                  {isBuyer ? '买家' : isSeller ? '卖家' : '无权限'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="交易对象">
                {isSeller
                  ? (order.buyerName || '无')
                  : isBuyer
                    ? (order.sellerName || '无')
                    : '无'}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">{order.createTime ? new Date(order.createTime).toLocaleString() : '无'}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{order.updateTime ? new Date(order.updateTime).toLocaleString() : '无'}</Descriptions.Item>
              <Descriptions.Item label="交易地点">{order.tradeLocation ? order.tradeLocation : '无'}</Descriptions.Item>
            </Descriptions>
            
            <Divider />
            
            <Title level={4}>订单进度</Title>
            {order.status === 5 ? (
              <Steps current={1} status="error">
                <Step title="待确认" />
                <Step title="已取消" />
              </Steps>
            ) : order.tradeType === 2 ? (
              <Steps 
                current={displayStatus}
                status={displayStatus === 5 ? 'error' : displayStatus === 4 ? 'finish' : 'process'}
              >
                <Step title="待确认" />
                <Step title="待发货" />
                <Step title="待收货" />
                <Step title="待评价" />
                <Step title="已完成" />
                {displayStatus === 5 && (
                  <Step title="订单取消" description="交易终止" />
                )}
              </Steps>
            ) : (
            <Steps 
                current={displayStatus > 1 ? displayStatus - 1 : displayStatus}
                status={displayStatus === 5 ? 'error' : displayStatus === 4 ? 'finish' : 'process'}
            >
                <Step title="待确认" />
                <Step title="待收货" />
                <Step title="待评价" />
                <Step title="已完成" />
                {displayStatus === 5 && (
                <Step title="订单取消" description="交易终止" />
              )}
            </Steps>
            )}
            
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
                src={order.item && order.item.images && order.item.images.length > 0 ? order.item.images[0] : 'https://via.placeholder.com/100x100?text=No+Image'} 
                alt={order.item && order.item.title ? order.item.title : 'No Title'}
                style={{ width: 100, height: 100, marginRight: 16, objectFit: 'cover' }}
              />
              <div>
                <Title level={4}>{order.itemName || (order.item && order.item.title) || '无标题'}</Title>
                <Text type="secondary">{order.item && order.item.category ? order.item.category : ''}</Text>
              </div>
            </div>
            
            <Divider />
            
            <Descriptions column={1}>
              <Descriptions.Item label="物品价格">¥{order.item && order.item.price ? order.item.price : '无'}</Descriptions.Item>
              <Descriptions.Item label="物品成色">
                {order.item && order.item.condition !== undefined && order.item.condition !== null
                  ? conditionMap[order.item.condition]
                  : '无'}
              </Descriptions.Item>
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
            
            {order.status === 0 && order.role === 'BUYER' && (
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

      {/* 评价弹窗 */}
      <Modal
        title="订单评价"
        open={commentModalVisible}
        onOk={handleSubmitComment}
        onCancel={() => setCommentModalVisible(false)}
        confirmLoading={commentSubmitting}
        okText="提交"
        cancelText="取消"
      >
        <Rate allowClear={false} value={rating} onChange={setRating} />
        <Input.TextArea
          rows={4}
          value={commentContent}
          onChange={e => setCommentContent(e.target.value)}
          placeholder="请输入评价内容"
        />
      </Modal>

      {isSeller && (
        <Modal
          title="填写快递单号"
          open={deliverModalVisible}
          onOk={handleSubmitDeliver}
          onCancel={() => setDeliverModalVisible(false)}
          okText="提交"
          cancelText="取消"
        >
          <Input
            value={trackingNumber}
            onChange={e => setTrackingNumber(e.target.value)}
            placeholder="请输入快递单号"
          />
        </Modal>
      )}
    </div>
  );
};

export default OrderDetail; 