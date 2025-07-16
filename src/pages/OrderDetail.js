import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Card, Descriptions, Button, Steps, Divider, Tag, Spin, Typography, 
  Row, Col, message, Modal, Input, Rate, Avatar, Space, Badge, Tooltip, Select,
  Alert
} from 'antd';
import { 
  ArrowLeftOutlined, CheckCircleOutlined, ClockCircleOutlined, 
  DollarOutlined, ShoppingOutlined, TagOutlined, UserOutlined,
  SendOutlined, StarOutlined, EnvironmentOutlined, FileTextOutlined,
  PhoneOutlined, StarFilled, CarOutlined, CopyOutlined, CloseCircleOutlined, QuestionCircleOutlined
} from '@ant-design/icons';
import { fetchOrderById, updateOrder, confirmOrder, deliverOrder, confirmReceive, commentOrder, cancelOrder, rejectOrder } from '../store/actions/orderActions';
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

  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [customCancelReason, setCustomCancelReason] = useState('');
  const [cancelSubmitting, setCancelSubmitting] = useState(false);

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
      
      // 重新加载订单详情
      dispatch(fetchOrderById(id));
      
      // 显示提示，告知用户可以评价订单
      Modal.success({
        title: '确认收货成功',
        content: '您已确认收货，现在可以对卖家进行评价了！',
        okText: '我知道了'
      });
    } catch (e) {
      message.error('操作失败: ' + (e.message || '未知错误'));
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

  const handleCancelOrder = () => {
    setCancelModalVisible(true);
    setCancelReason('');
    setCustomCancelReason('');
  };
  const handleSubmitCancelOrder = async () => {
    if (!cancelReason && !customCancelReason.trim()) {
      message.warning('请选择或填写终止原因');
      return;
    }
    setCancelSubmitting(true);
    try {
      const reason = cancelReason === '其他' ? customCancelReason : cancelReason;
      await dispatch(rejectOrder({ orderId: id, sellerRemark: reason })).unwrap();
      message.success('订单已终止');
      setCancelModalVisible(false);
      dispatch(fetchOrderById(id));
    } catch (e) {
      message.error('终止订单失败');
    } finally {
      setCancelSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => message.success('已复制到剪贴板'),
      () => message.error('复制失败')
    );
  };

  if (loading || !order) {
    return (
      <div className="order-detail-loading">
        <Spin size="large" tip="加载订单信息..." />
      </div>
    );
  }

  // 进度条节点结构与渲染逻辑调整（必须在 order 存在后再执行）
  const mainSteps = [
    { title: '待确认' },
    { title: '待收货' },
    { title: '待评价' },
    { title: '已完成' }
  ];
  
  // 分别定义两种终止状态的步骤
  const cancelStep = { title: '已取消', description: '订单已取消' };
  const rejectStep = { title: '已拒绝', description: '订单已被拒绝' };

  let stepsToShow = mainSteps;
  let currentStep = 0;
  let stepsStatus = 'process';
  
  // 根据订单状态调整步骤显示
  if (order.status === 2) { // 已拒绝
    stepsToShow = [mainSteps[0], rejectStep];
    currentStep = 1;
    stepsStatus = 'error';
  } else if (order.status === 5) { // 已取消
    stepsToShow = [mainSteps[0], cancelStep];
    currentStep = 1;
    stepsStatus = 'warning';
  } else if (order.status === 0) {
    currentStep = 0;
  } else if (order.status === 1) {
    currentStep = 1;
  } else if (order.status === 3) {
    currentStep = 2;
  } else if (order.status === 4) {
    currentStep = 3;
    stepsStatus = 'finish';
  }

  // 主状态显示
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
        color = 'orange';
        text = '待收货';
        break;
      case 2:
        icon = <CloseCircleOutlined />;
        color = 'red';
        text = '已拒绝';
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
        color = 'warning';
        text = '已取消';
        break;
      default:
        icon = <QuestionCircleOutlined />;
        color = 'default';
        text = '未知状态';
    }
    return { icon, color, text };
  };

  // 终止原因选项与后端保持一致
  const buyerCancelReasons = [
    '临时有事',
    '不需要该商品了',
    '价格不合适',
    '描述不符',
    '与卖家协商一致取消',
    '其他'
  ];
  const sellerCancelReasons = [
    '临时有事',
    '不想卖了',
    '无法交易',
    '价格不合适',
    '描述不符',
    '与买家协商一致取消',
    '商品已售出',
    '买家长时间未响应',
    '买家要求取消',
    '其他'
  ];

  const renderActionButtons = () => {
    if (!order || !user) return null;
    const status = displayStatus;
    const btnClasses = "action-button";
    const canCancel = status !== 2 && status !== 4 && status !== 5;
    return (
      <>
        {/* 原有操作按钮 */}
        {isSeller && status === 0 && (
          <Button 
            type="primary" 
            className={`${btnClasses} confirm-button`}
            onClick={handleConfirmOrder}
            icon={<CheckCircleOutlined />}
            size="large"
          >
            确认订单
          </Button>
        )}
        {isSeller && order.status === 3 && !order.buyerComment && (

          <Button 
            type="primary" 
            className={`${btnClasses} comment-button`}
            onClick={handleOpenComment}
            icon={<StarOutlined />}
            size="large"
          >
            评价买家
          </Button>
        )}
        {isBuyer && status === 1 && (
          <Button 
            type="primary" 
            className={`${btnClasses} receive-button`}
            onClick={handleConfirmReceive}
            icon={<CheckCircleOutlined />}
            size="large"
          >
            确认收货
          </Button>
        )}
        {isBuyer && order.status === 3 && !order.sellerComment && (
          <Button 
            type="primary" 
            className={`${btnClasses} comment-button`}
            onClick={handleOpenComment}
            icon={<StarOutlined />}
            size="large"
          >
            评价卖家
          </Button>
        )}
        {/* 新增：双方都可终止订单 */}
        {canCancel && (
          <Button 
            danger
            className={`${btnClasses} cancel-button`}
            onClick={handleCancelOrder}
            icon={<CloseCircleOutlined />}
            size="large"
            style={{ marginLeft: 12 }}
          >
            终止订单
          </Button>
        )}
        {/* 终止订单弹窗 */}
        <Modal
          title="请选择终止订单原因"
          open={cancelModalVisible}
          onOk={handleSubmitCancelOrder}
          onCancel={() => setCancelModalVisible(false)}
          confirmLoading={cancelSubmitting}
          okText="提交"
          cancelText="取消"
          destroyOnClose
        >
          <Select
            style={{ width: '100%', marginBottom: 16 }}
            placeholder="请选择原因"
            value={cancelReason || undefined}
            onChange={setCancelReason}
          >
            {(isBuyer ? buyerCancelReasons : sellerCancelReasons).map(reason => (
              <Select.Option key={reason} value={reason}>{reason}</Select.Option>
            ))}
          </Select>
          {cancelReason === '其他' && (
            <Input.TextArea
              rows={3}
              placeholder="请填写具体原因"
              value={customCancelReason}
              onChange={e => setCustomCancelReason(e.target.value)}
              maxLength={100}
              showCount
            />
          )}
        </Modal>
      </>
    );
  };

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
          <Badge 
            color={color} 
            text={
              <span style={{ fontSize: '16px', fontWeight: '500' }}>
                {icon} {text}
              </span>
            } 
          />
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
                <ClockCircleOutlined /> 订单状态更新
              </div>
              <div className="order-progress-steps">
                {/* 当订单被拒绝或取消时显示特殊样式 */}
                {order.status === 2 || order.status === 5 ? (
                  <div className="order-terminated-status">
                    <Alert
                      message={order.status === 2 ? "订单已被拒绝" : "订单已被取消"}
                      description={
                        <div>
                          <p>状态更新时间: {new Date(order.updateTime).toLocaleString()}</p>
                          {order.sellerRemark && (
                            <p>终止原因: {order.sellerRemark}</p>
                          )}
                        </div>
                      }
                      type={order.status === 2 ? "error" : "warning"}
                      showIcon
                      style={{ marginBottom: 16 }}
                    />
                    <Steps 
                      current={currentStep}
                      status={stepsStatus}
                      progressDot
                      className="custom-steps terminated-steps"
                    >
                      {stepsToShow.map((step, idx) => (
                        <Step key={idx} title={step.title} description={step.description} />
                      ))}
                    </Steps>
                  </div>
                ) : (
                  <Steps 
                    current={currentStep}
                    status={stepsStatus}
                    progressDot
                    className="custom-steps"
                  >
                    {stepsToShow.map((step, idx) => (
                      <Step key={idx} title={step.title} description={step.description} />
                    ))}
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
                        <span className="counterpart-name">卖家: {order.sellerName || '未知用户'}</span> : 
                        <span className="counterpart-name">买家: {order.buyerName || '未知用户'}</span>
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
                      <Tag color="blue" className="trade-type-tag">线下交易</Tag>
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
              {/* 标题放到图片下方 */}
              <div className="item-basic-info" style={{ textAlign: 'center', marginTop: 12 }}>
                <div className="item-title" style={{ fontWeight: 'bold', fontSize: 18 }}>
                  {order.item && order.item.title ? order.item.title : '无标题'}
                </div>
                {order.item && order.item.category && (
                  <div className="item-category" style={{ marginTop: 4 }}>
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
              {/* 删除托管信息、快递单号、托管支付按钮、托管状态、交易哈希等线上交易相关内容 */}
            </div>
            
            {/* 删除展示托管信息、快递单号、托管支付按钮等相关的 JSX 片段 */}
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
    </div>
  );
};

export default OrderDetail; 