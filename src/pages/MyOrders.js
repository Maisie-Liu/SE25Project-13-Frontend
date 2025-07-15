import React, { useEffect, useState } from 'react';
import { Tabs, Table, Tag, Button, Empty, Spin, message, Modal, Input, Typography, Space, Divider } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/slices/authSlice';
import { ShoppingOutlined, ShopOutlined, InboxOutlined, RightOutlined } from '@ant-design/icons';
import './MyOrders.css';

const { TabPane } = Tabs;
const { Title, Paragraph } = Typography;

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
      await axios.put(`/orders/${orderId}/receive`);
      message.success('确认收货成功');
      fetchOrders(activeTab);
    } catch (e) {
      message.error('操作失败');
    }
  };
  const handleOpenComment = (orderId) => {
    setCommentOrderId(orderId);
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
      await axios.put(`/orders/${commentOrderId}/comment`, null, { params: { comment: commentContent, isBuyer } });
      message.success('评价成功');
      setCommentModalVisible(false);
      setCommentContent('');
      setCommentOrderId(null);
      fetchOrders(activeTab);
    } catch (e) {
      message.error('评价失败');
    } finally {
      setCommentSubmitting(false);
    }
  };

  const renderActionButtons = (record) => {
    if (!user) return null;
    const { status, buyer, seller, buyerComment, sellerComment } = record;
    const isBuyer = user.id === buyer?.id;
    const isSeller = user.id === seller?.id;
    
          return (
      <div className="order-action-buttons">
        <Button 
          type="link" 
          className="order-detail-button" 
          onClick={() => navigate(`/orders/${record.id}`)}
        >
          详情 <RightOutlined />
        </Button>
        
        {isSeller && status === 0 && (
          <Button 
            type="primary" 
            size="small" 
            className="order-action-button"
            onClick={() => handleConfirmOrder(record.id)}
          >
            确认订单
          </Button>
        )}
        
        {isSeller && status === 1 && (
          <Button 
            type="primary" 
            size="small" 
            className="order-action-button"
            onClick={() => handleDeliverOrder(record.id)}
          >
            发货
          </Button>
        )}
        
        {isSeller && status === 3 && !buyerComment && (
            <Button 
              type="primary" 
              size="small"
            className="order-action-button"
            onClick={() => handleOpenComment(record.id)}
            >
            评价买家
            </Button>
        )}
        
        {isBuyer && status === 2 && (
            <Button 
              type="primary" 
              size="small"
            className="order-action-button"
            onClick={() => handleConfirmReceive(record.id)}
            >
              确认收货
            </Button>
        )}
        
        {isBuyer && status === 3 && !sellerComment && (
            <Button 
              type="primary" 
              size="small"
            className="order-action-button"
            onClick={() => handleOpenComment(record.id)}
            >
            评价卖家
            </Button>
        )}
      </div>
    );
  };

  // 判断当前用户是否已评价
  const hasCommented = (user, order) => {
    const isBuyer = String(user.id) === String(order.buyerId);
    const isSeller = String(user.id) === String(order.sellerId);
    return (isBuyer && order.sellerComment) || (isSeller && order.buyerComment);
  };

  const columns = [
    {
      title: '商品信息',
      dataIndex: 'item',
      key: 'item',
      render: (item) => (
        item ? (
          <div className="order-item-card">
          <img 
            src={item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/50x50?text=No+Image'} 
            alt={item.title}
              className="order-item-image"
          />
            <Link to={`/items/${item.id}`} className="order-item-title">{item.title}</Link>
        </div>
        ) : (
          <span>商品信息缺失</span>
        )
      ),
    },
    {
      title: '价格',
      dataIndex: 'itemPrice',
      key: 'itemPrice',
      render: price => <span className="order-price">¥{price}</span>,
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        let displayStatus = status;
        if (status === 3 && hasCommented(user, record)) {
          displayStatus = 4;
        }
        let text = '';
        let color = '';
        switch (displayStatus) {
          case 0:
            text = '待确认'; color = 'gold'; break;
          case 1:
            text = '待发货'; color = 'blue'; break;
          case 2:
            text = '待收货'; color = 'orange'; break;
          case 3:
            text = '待评价'; color = 'green'; break;
          case 4:
            text = '已完成'; color = 'default'; break;
          case 5:
            text = '已取消'; color = 'red'; break;
          default:
            text = '未知'; color = 'default';
        }
        return <Tag color={color} className="order-status-tag">{text}</Tag>;
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: time => new Date(time).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => renderActionButtons(record),
    },
  ];

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
          <div className="order-table-container">
            {loading ? (
              <div className="orders-loading">
                <Spin size="large" tip="加载中..." />
              </div>
            ) : (
              <Table
                rowKey="id"
                columns={columns}
                dataSource={buyerOrders.filter(order => order && order.item)}
                locale={{ 
                  emptyText: (
                    <div className="empty-orders">
                      <Empty 
                        image={Empty.PRESENTED_IMAGE_SIMPLE} 
                        description="暂无订单记录" 
                      />
                      <Button 
                        type="primary" 
                        style={{ marginTop: 16 }}
                        onClick={() => navigate('/items')}
                      >
                        去浏览商品
                      </Button>
                    </div>
                  ) 
                }}
                pagination={{ 
                  pageSize: 8, 
                  showTotal: total => `共 ${total} 条订单`,
                  showSizeChanger: false
                }}
              />
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
          <div className="order-table-container">
            {loading ? (
              <div className="orders-loading">
                <Spin size="large" tip="加载中..." />
              </div>
            ) : (
              <Table
                rowKey="id"
                columns={columns}
                dataSource={sellerOrders.filter(order => order && order.item)}
                locale={{ 
                  emptyText: (
                    <div className="empty-orders">
                      <Empty 
                        image={Empty.PRESENTED_IMAGE_SIMPLE} 
                        description="暂无订单记录" 
                      />
                      <Button 
                        type="primary" 
                        style={{ marginTop: 16 }}
                        onClick={() => navigate('/publish')}
                      >
                        去发布商品
                      </Button>
                    </div>
                  ) 
                }}
                pagination={{ 
                  pageSize: 8, 
                  showTotal: total => `共 ${total} 条订单`,
                  showSizeChanger: false
                }}
              />
            )}
          </div>
        </TabPane>
      </Tabs>
      
      <Modal
        title="订单评价"
        open={commentModalVisible}
        onOk={handleSubmitComment}
        onCancel={() => setCommentModalVisible(false)}
        confirmLoading={commentSubmitting}
        okText="提交评价"
        cancelText="取消"
        className="comment-modal"
      >
        <Paragraph>请对本次交易进行评价，您的反馈将帮助我们改进服务</Paragraph>
        <Input.TextArea
          rows={4}
          value={commentContent}
          onChange={e => setCommentContent(e.target.value)}
          placeholder="请输入评价内容，例如：物品描述准确，发货速度快，服务态度好等"
          maxLength={200}
          showCount
        />
      </Modal>
    </div>
  );
};

export default MyOrders; 