import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Card, Descriptions, Button, Steps, Divider, Tag, Spin, Typography, 
  Row, Col, message, Modal, Input, Rate, Avatar, Space, Badge, Tooltip 
} from 'antd';
import { 
  ArrowLeftOutlined, CheckCircleOutlined, ClockCircleOutlined, 
  DollarOutlined, ShoppingOutlined, TagOutlined, UserOutlined,
  SendOutlined, StarOutlined, EnvironmentOutlined, FileTextOutlined,
  PhoneOutlined, StarFilled, CarOutlined, CopyOutlined, CloseCircleOutlined, QuestionCircleOutlined
} from '@ant-design/icons';
import { fetchOrderById, updateOrder, confirmOrder, deliverOrder, confirmReceive, commentOrder } from '../store/actions/orderActions';
import { selectCurrentOrder, selectOrderLoading } from '../store/slices/orderSlice';
import { selectUser } from '../store/slices/authSlice';
import './OrderDetail.css';

const { Step } = Steps;
const { Title, Text, Paragraph } = Typography;

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

  const isBuyer = user && order && user.id === (order.buyer?.id || order.buyerId);
  const isSeller = user && order && user.id === (order.seller?.id || order.sellerId);

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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => message.success('已复制到剪贴板'),
      () => message.error('复制失败')
    );
  };

  const getStatusInfo = (status) => {
    let icon, color, text;
    
    switch(status) {
      case 0:
        icon = <ClockCircleOutlined />;
        color = 'gold';
        text = '待确认';
        break;
      case 1:
        icon = <ShoppingOutlined />;
        color = 'blue';
        text = '待发货';
        break;
      case 2:
        icon = <CarOutlined />;
        color = 'orange';
        text = '待收货';
        break;
      case 3:
        icon = <StarOutlined />;
        color = 'green';
        text = '待评价';
        break;
      case 4:
        icon = <CheckCircleOutlined />;
        color = 'default';
        text = '已完成';
        break;
      case 5:
        icon = <CloseCircleOutlined />;
        color = 'red';
        text = '已取消';
        break;
      default:
        icon = <QuestionCircleOutlined />;
        color = 'default';
        text = '未知状态';
    }
    
    return { icon, color, text };
  };

  const renderActionButtons = () => {
    if (!order || !user) return null;
    const status = displayStatus;
    // 状态0：待确定，1：待发货，2：待收货，3：待评价
    
    const btnClasses = "action-button";
    
    if (isSeller) {
      if (status === 0) {
        return (
          <Button 
            type="primary" 
            className={`${btnClasses} confirm-button`}
            onClick={handleConfirmOrder}
            icon={<CheckCircleOutlined />}
            size="large"
          >
            确认订单
          </Button>
        );
      }
      if (status === 1) {
        return (
          <Button 
            type="primary" 
            className={`${btnClasses} deliver-button`}
            onClick={handleDeliverOrder}
            icon={<SendOutlined />}
            size="large"
          >
            发货
          </Button>
        );
      }
      if (order.status === 3 && !order.buyerComment && isSeller) {
        return (
          <Button 
            type="primary" 
            className={`${btnClasses} comment-button`}
            onClick={handleOpenComment}
            icon={<StarOutlined />}
            size="large"
          >
            评价买家
          </Button>
        );
      }
    }
    
    if (isBuyer) {
      if (status === 2) {
        return (
          <Button 
            type="primary" 
            className={`${btnClasses} receive-button`}
            onClick={handleConfirmReceive}
            icon={<CheckCircleOutlined />}
            size="large"
          >
            确认收货
          </Button>
        );
      }
      if (order.status === 3 && !order.sellerComment && isBuyer) {
        return (
          <Button 
            type="primary" 
            className={`${btnClasses} comment-button`}
            onClick={handleOpenComment}
            icon={<StarOutlined />}
            size="large"
          >
            评价卖家
          </Button>
        );
      }
    }
    
    return null;
  };

  if (loading || !order) {
    return (
      <div className="order-detail-loading">
        <Spin size="large" tip="加载订单信息..." />
      </div>
    );
  }

  const { icon, color, text } = getStatusInfo(displayStatus);

  return (
    <div className="order-detail-container">
      <div className="order-detail-header">
        <Button 
          className="back-button" 
          onClick={() => navigate('/my/orders')}
          icon={<ArrowLeftOutlined />}
        >
          返回订单列表
        </Button>
        <Title level={2}>订单详情</Title>
        <div className="order-status-badge">
          <Badge color={color} text={text} />
        </div>
      </div>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card className="order-info-card">
            <div className="order-id-section">
              <div className="order-id-label">订单编号:</div>
              <div className="order-id-value">
                {order.id}
                <Tooltip title="复制订单号">
                  <CopyOutlined 
                    className="copy-icon" 
                    onClick={() => copyToClipboard(order.id)} 
                  />
                </Tooltip>
              </div>
            </div>
            
            <div className="order-progress-section">
              <div className="section-title">
                <ClockCircleOutlined /> 订单进度
              </div>
              <div className="order-progress-steps">
                {order.tradeType === 2 ? (
                  <Steps 
                    current={displayStatus}
                    status={displayStatus === 5 ? 'error' : displayStatus === 4 ? 'finish' : 'process'}
                    progressDot
                    className="custom-steps"
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
                    progressDot
                    className="custom-steps"
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
              </div>
            </div>
            
            <div className="order-details-section">
              <div className="section-title">
                <FileTextOutlined /> 交易详情
              </div>
              <Row gutter={[16, 16]} className="order-details-grid">
                <Col span={12}>
                  <div className="detail-item">
                    <div className="detail-label">交易角色</div>
                    <div className="detail-value">
                      <Tag color={isBuyer ? 'blue' : 'orange'} className="role-tag">
                        {isBuyer ? '买家' : isSeller ? '卖家' : '无权限'}
                      </Tag>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="detail-item">
                    <div className="detail-label">交易对象</div>
                    <div className="detail-value simple-value">
                      {isBuyer ? 
                        <span className="counterpart-name">卖家: {order.seller?.username || '未知用户'}</span> : 
                        <span className="counterpart-name">买家: {order.buyer?.username || '未知用户'}</span>
                      }
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="detail-item">
                    <div className="detail-label">创建时间</div>
                    <div className="detail-value">{new Date(order.createTime).toLocaleString()}</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="detail-item">
                    <div className="detail-label">更新时间</div>
                    <div className="detail-value">{new Date(order.updateTime).toLocaleString()}</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="detail-item">
                    <div className="detail-label">交易方式</div>
                    <div className="detail-value">
                      <Tag color={order.tradeType === 2 ? 'gold' : 'blue'} className="trade-type-tag">
                        {order.tradeType === 2 ? '线上交易' : order.tradeType === 1 ? '线下交易' : '未知'}
                      </Tag>
                    </div>
                  </div>
                </Col>
                {order.tradeLocation && (
                  <Col span={12}>
                    <div className="detail-item">
                      <div className="detail-label">交易地点</div>
                      <div className="detail-value">
                        <span className="location-text">
                          <EnvironmentOutlined /> {order.tradeLocation}
                        </span>
                      </div>
                    </div>
                  </Col>
                )}
                {order.buyerMessage && (
                  <Col span={24}>
                    <div className="detail-item">
                      <div className="detail-label">买家留言</div>
                      <div className="detail-value message-text">
                        {order.buyerMessage}
                      </div>
                    </div>
                  </Col>
                )}
              </Row>
            </div>
            
            <div className="order-action-section">
              {renderActionButtons()}
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card className="item-info-card">
            <div className="section-title">
              <TagOutlined /> 商品信息
            </div>
            <div className="item-preview">
              <div className="item-image-container">
                <img 
                  src={order.item && order.item.images && order.item.images.length > 0 ? order.item.images[0] : 'https://via.placeholder.com/100x100?text=No+Image'} 
                  alt={order.item && order.item.title ? order.item.title : 'No Title'}
                  className="item-image"
                />
              </div>
              <div className="item-basic-info">
                <div className="item-title">{order.item && order.item.title ? order.item.title : '无标题'}</div>
                {order.item && order.item.category && (
                  <div className="item-category">
                    <TagOutlined /> {order.item.category.name || order.item.category}
                  </div>
                )}
              </div>
            </div>
            
            <Divider className="card-divider" />
            
            <div className="price-section">
              <div className="price-item">
                <span className="price-label">物品价格</span>
                <span className="price-value">¥{order.itemPrice?.toFixed(2)}</span>
              </div>
              {order.trackingNumber && (
                <div className="tracking-section">
                  <div className="section-title small">
                    <CarOutlined /> 物流信息
                  </div>
                  <div className="tracking-number-container">
                    <div className="tracking-label">快递单号</div>
                    <div className="tracking-value">
                      {order.trackingNumber}
                      <Tooltip title="复制单号">
                        <CopyOutlined 
                          className="copy-icon" 
                          onClick={() => copyToClipboard(order.trackingNumber)} 
                        />
                      </Tooltip>
                    </div>
                  </div>
                </div>
              )}
              {order.escrow && (
                <div className="escrow-section">
                  <div className="section-title small">
                    <DollarOutlined /> 托管信息
                  </div>
                  <div className="escrow-status">
                    <span className="escrow-label">托管状态</span>
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
                  </div>
                  <div className="transaction-hash">
                    <span className="hash-label">交易哈希</span>
                    <div className="hash-value">
                      <Tooltip title="完整哈希值">
                        <span className="hash-text">{order.escrow.transactionHash.slice(0, 20)}...</span>
                      </Tooltip>
                      <Tooltip title="复制哈希值">
                        <CopyOutlined 
                          className="copy-icon" 
                          onClick={() => copyToClipboard(order.escrow.transactionHash)} 
                        />
                      </Tooltip>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {order.status === 0 && order.role === 'BUYER' && (
              <div className="payment-action">
                <Button 
                  type="primary" 
                  block
                  size="large"
                  className="payment-button"
                  icon={<DollarOutlined />}
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
        title={
          <div className="modal-title">
            <StarFilled className="modal-icon" /> 订单评价
          </div>
        }
        open={commentModalVisible}
        onOk={handleSubmitComment}
        onCancel={() => setCommentModalVisible(false)}
        confirmLoading={commentSubmitting}
        okText="提交评价"
        cancelText="取消"
        className="comment-modal"
        width={500}
        centered
      >
        <div className="rating-section">
          <div className="rating-label">评分</div>
          <Rate 
            allowClear={false} 
            value={rating} 
            onChange={setRating} 
            className="rating-stars"
          />
          <span className="rating-text">{rating}星</span>
        </div>
        
        <div className="comment-section">
          <div className="comment-label">评价内容</div>
          <Input.TextArea
            rows={4}
            value={commentContent}
            onChange={e => setCommentContent(e.target.value)}
            placeholder="请输入评价内容，例如商品质量、服务态度等"
            className="comment-textarea"
            maxLength={200}
            showCount
          />
        </div>
      </Modal>

      {/* 发货弹窗 */}
      {isSeller && (
        <Modal
          title={
            <div className="modal-title">
              <CarOutlined className="modal-icon" /> 填写物流信息
            </div>
          }
          open={deliverModalVisible}
          onOk={handleSubmitDeliver}
          onCancel={() => setDeliverModalVisible(false)}
          okText="确认发货"
          cancelText="取消"
          className="delivery-modal"
          width={500}
          centered
        >
          <div className="tracking-section">
            <div className="tracking-info">
              <Paragraph className="modal-tip">
                请填写有效的快递单号，买家将根据此信息跟踪物品物流状态
              </Paragraph>
              <div className="tracking-input">
                <Input
                  value={trackingNumber}
                  onChange={e => setTrackingNumber(e.target.value)}
                  placeholder="请输入快递单号"
                  prefix={<CarOutlined />}
                  size="large"
                  className="tracking-number-input"
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OrderDetail; 