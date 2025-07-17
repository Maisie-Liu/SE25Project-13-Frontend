import React, { useEffect, useState } from 'react';
import { Tabs, Card, Tag, Button, Empty, Spin, message, Modal, Input, Typography, Space, Divider, Row, Col, Badge } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../store/slices/authSlice';
import { 
  ShoppingOutlined, ShopOutlined, InboxOutlined, RightOutlined, 
  ClockCircleOutlined, DollarOutlined, EnvironmentOutlined, CommentOutlined,
  CheckCircleOutlined, SendOutlined, StarOutlined, CloseCircleOutlined, UserOutlined
} from '@ant-design/icons';
import './MyOrders.css';
import { Rate } from 'antd';
import { confirmReceive } from '../store/actions/orderActions';

const { TabPane } = Tabs;
const { Title, Paragraph, Text } = Typography;

const MyOrders = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('buyer');
  const [buyerOrders, setBuyerOrders] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector(selectUser);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentOrderId, setCommentOrderId] = useState(null);
  const [commentRating, setCommentRating] = useState(5);
  const [currentOrder, setCurrentOrder] = useState(null);
  const dispatch = useDispatch();

  const fetchOrders = async (type) => {
    setLoading(true);
    try {
      const url = type === 'buyer' ? '/orders/buyer' : '/orders/seller';
      const res = await axios.get(url);
      if (type === 'buyer') {
        setBuyerOrders(res.data.data.list || []);
      } else {
        setSellerOrders(res.data.data.list || []);
      }
    } catch (e) {
      message.error('获取订单失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(activeTab);
    // eslint-disable-next-line
  }, [activeTab]);

  const handleConfirmOrder = async (orderId) => {
    try {
      await axios.put(`/orders/${orderId}/confirm`);
      message.success('订单已确认');
      fetchOrders(activeTab);
    } catch (e) {
      message.error('操作失败');
    }
  };
  
  const handleDeliverOrder = async (orderId) => {
    try {
      await axios.put(`/orders/${orderId}/deliver`);
      message.success('发货成功');
      fetchOrders(activeTab);
    } catch (e) {
      message.error('操作失败');
    }
  };
  
  const handleConfirmReceive = async (orderId) => {
    try {
      // 使用redux action进行确认收货
      await dispatch(confirmReceive(orderId)).unwrap();
      message.success('确认收货成功');
      
      // 重新获取订单列表
      fetchOrders(activeTab);
      
      // 通知用户可以评价
      Modal.success({
        title: '确认收货成功',
        content: '您已确认收货，现在可以对卖家进行评价了！',
        okText: '我知道了'
      });
    } catch (e) {
      message.error('操作失败: ' + (e.message || '未知错误'));
    }
  };
  
  const handleOpenComment = (order) => {
    setCommentOrderId(order.id);
    setCurrentOrder(order);
    setCommentModalVisible(true);
  };
  
  const handleSubmitComment = async () => {
    if (!commentContent.trim()) {
      message.warning('评价内容不能为空');
      return;
    }
    setCommentSubmitting(true);
    try {
      const order = [...buyerOrders, ...sellerOrders].find(o => o.id === commentOrderId);
      const isBuyer = user && order && user.id === order.buyer?.id;
      await axios.put(`/orders/${commentOrderId}/comment`, null, { 
        params: { 
          comment: commentContent, 
          isBuyer,
          rating: commentRating
        } 
      });
      message.success('评价成功');
      setCommentModalVisible(false);
      setCommentContent('');
      setCommentOrderId(null);
      setCommentRating(5);
      fetchOrders(activeTab);
    } catch (e) {
      message.error('评价失败');
    } finally {
      setCommentSubmitting(false);
    }
  };

  // 判断当前用户是否已评价
  const hasCommented = (user, order) => {
    const isBuyer = String(user.id) === String(order.buyerId);
    const isSeller = String(user.id) === String(order.sellerId);
    return (isBuyer && order.sellerComment) || (isSeller && order.buyerComment);
  };

  const getStatusInfo = (status, record) => {
    let displayStatus = status;
    if (status === 3 && hasCommented(user, record)) {
      displayStatus = 4;
    }
    
    let text = '';
    let color = '';
    let icon = null;
    
    switch (displayStatus) {
      case 0:
        text = '待确认'; 
        color = 'gold'; 
        icon = <ClockCircleOutlined />;
        break;
      case 1:
        text = '待收货'; 
        color = 'blue'; 
        icon = <ShoppingOutlined />;
        break;
      case 2:
        text = '已拒绝'; 
        color = 'red'; 
        icon = <CloseCircleOutlined />;
        break;
      case 3:
        text = '待评价'; 
        color = 'green'; 
        icon = <CommentOutlined />;
        break;
      case 4:
        text = '已完成'; 
        color = 'default'; 
        icon = <CheckCircleOutlined />;
        break;
      case 5:
        text = '已取消'; 
        color = 'red'; 
        icon = <CloseCircleOutlined />;
        break;
      default:
        text = '未知'; 
        color = 'default';
    }
    
    return { text, color, icon };
  };

  const renderOrderCards = (orders) => {
    if (!orders || orders.length === 0) {
      return (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
          description={
            <span className="empty-text">
              {activeTab === 'buyer' ? '您还没有购买任何商品' : '您还没有卖出任何商品'}
            </span>
          }
        >
          <Button 
            type="primary" 
            onClick={() => navigate(activeTab === 'buyer' ? '/items' : '/publish')}
            className="empty-action-button"
          >
            {activeTab === 'buyer' ? '去浏览商品' : '去发布商品'}
          </Button>
        </Empty>
      );
    }

    return (
      <Row gutter={[24, 24]}>
        {orders.filter(order => order && order.item).map(order => {
          const { text, color, icon } = getStatusInfo(order.status, order);
          const isBuyer = user && user.id === (order.buyer?.id || order.buyerId);
          const isSeller = user && user.id === (order.seller?.id || order.sellerId);
          
          return (
            <Col xs={24} sm={24} md={12} lg={8} key={order.id}>
              <Card 
                className="order-card" 
                hoverable
                actions={[
                  <Button 
                    type="link" 
                    className="order-detail-link" 
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    查看详情 <RightOutlined />
                  </Button>,
                  renderActionButton(order)
                ]}
              >
                <div className="order-card-header">
                  <div className="order-number">
                    <Text type="secondary">订单编号: {order.id}</Text>
                  </div>
                  <div className="order-status">
                    <Badge color={color} text={text} />
                  </div>
                </div>
                
                <div className="order-card-content">
                  <div className="order-item-info">
                    <div className="order-item-image-container">
                      <img 
                        src={order.item.images && order.item.images.length > 0 ? 
                          order.item.images[0] : 
                          'https://via.placeholder.com/100x100?text=No+Image'
                        } 
                        alt={order.item.title}
                        className="order-item-image"
                      />
                    </div>
                    <div className="order-item-details">
                      <Link to={`/items/${order.item.id}`} className="order-item-title">
                        {order.item.title}
                      </Link>
                      <div className="order-price">
                        <DollarOutlined /> ¥{order.itemPrice?.toFixed(2)}
                      </div>
                      <div className="order-time">
                        <ClockCircleOutlined /> {new Date(order.createTime).toLocaleString()}
                      </div>
                      {order.tradeLocation && (
                        <div className="order-location">
                          <EnvironmentOutlined /> {order.tradeLocation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="order-card-footer">
                  <div className="order-user-info">
                    <UserOutlined className="order-user-icon" />
                    <div className="order-user-name">
                      {isBuyer ? 
                        `卖家: ${order.sellerName || '未知用户'}` :
                        `买家: ${order.buyerName || '未知用户'}`
                      }
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    );
  };

  const renderActionButton = (order) => {
    if (!user) return null;
    const { status, buyer, seller, buyerComment, sellerComment } = order;
    const isBuyer = user.id === (buyer?.id || order.buyerId);
    const isSeller = user.id === (seller?.id || order.sellerId);
    
    if (isSeller && status === 0) {
      return (
        <Button 
          type="primary" 
          className="order-action-button confirm-button"
          onClick={() => handleConfirmOrder(order.id)}
        >
          确认订单
        </Button>
      );
    }
    
    if (isSeller && status === 1) {
      return (
        <Button 
          type="primary" 
          className="order-action-button deliver-button"
          onClick={() => handleDeliverOrder(order.id)}
        >
          发货
        </Button>
      );
    }
    
    if (isBuyer && status === 2) {
      return (
        <Button 
          type="primary" 
          className="order-action-button receive-button"
          onClick={() => handleConfirmReceive(order.id)}
        >
          确认收货
        </Button>
      );
    }
    
    if ((isSeller && status === 3 && !buyerComment) || (isBuyer && status === 3 && !sellerComment)) {
      return (
        <Button 
          type="primary" 
          className="order-action-button comment-button"
          onClick={() => handleOpenComment(order)}
        >
          {isBuyer ? '评价卖家' : '评价买家'}
        </Button>
      );
    }
    
    return null;
  };

  return (
    <div className="my-orders-container">
      <div className="my-orders-header">
        <Title level={2}>我的订单</Title>
        <Paragraph>查看并管理您的交易订单，跟踪订单状态和物流信息</Paragraph>
        <Divider />
      </div>
      
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        className="my-orders-tabs"
      >
        <TabPane 
          tab={
            <span>
              <ShoppingOutlined /> 我买到的订单
            </span>
          } 
          key="buyer"
        >
          <div className="order-list-container">
            {loading ? (
              <div className="orders-loading">
                <Spin size="large" tip="加载中..." />
              </div>
            ) : (
              renderOrderCards(buyerOrders)
            )}
          </div>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <ShopOutlined /> 我卖出的订单
            </span>
          } 
          key="seller"
        >
          <div className="order-list-container">
            {loading ? (
              <div className="orders-loading">
                <Spin size="large" tip="加载中..." />
              </div>
            ) : (
              renderOrderCards(sellerOrders)
            )}
          </div>
        </TabPane>
      </Tabs>
      
      <Modal
        title={
          <div className="comment-modal-title">
            <StarOutlined style={{ marginRight: 8 }} /> 
            订单评价
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
        {currentOrder && (
          <div className="comment-modal-item">
            <div className="comment-modal-item-image">
              <img 
                src={currentOrder.item?.images && currentOrder.item.images.length > 0 ? 
                  currentOrder.item.images[0] : 
                  'https://via.placeholder.com/60x60?text=No+Image'
                } 
                alt={currentOrder.item?.title || '商品图片'} 
              />
            </div>
            <div className="comment-modal-item-info">
              <div className="comment-modal-item-title">
                {currentOrder.item?.title || '未知商品'}
              </div>
              <div className="comment-modal-item-price">
                ¥{currentOrder.itemPrice?.toFixed(2)}
              </div>
            </div>
          </div>
        )}
        
        <Divider style={{ margin: '16px 0' }} />
        
        <div className="comment-form">
          <div className="comment-rating">
            <div className="comment-label">评分:</div>
            <Rate value={commentRating} onChange={setCommentRating} />
          </div>
          
          <div className="comment-input">
            <div className="comment-label">评价内容:</div>
            <Input.TextArea
              rows={4}
              value={commentContent}
              onChange={e => setCommentContent(e.target.value)}
              placeholder="请输入评价内容，例如：物品描述准确，发货速度快，服务态度好等"
              maxLength={200}
              showCount
              className="comment-textarea"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyOrders; 