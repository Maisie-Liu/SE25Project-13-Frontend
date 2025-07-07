import React, { useEffect, useState } from 'react';
import { Tabs, Table, Tag, Button, Empty, Spin, message, Modal, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/slices/authSlice';
import { confirmOrder, deliverOrder, confirmReceive, commentOrder } from '../store/actions/orderActions';

const { TabPane } = Tabs;

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
    if (isSeller) {
      if (status === 0) {
        return <Button type="primary" size="small" onClick={() => handleConfirmOrder(record.id)}>确认订单</Button>;
      }
      if (status === 1) {
        return <Button type="primary" size="small" onClick={() => handleDeliverOrder(record.id)}>发货</Button>;
      }
      if (status === 3 && !buyerComment) {
        return <Button type="primary" size="small" onClick={() => handleOpenComment(record.id)}>评价买家</Button>;
      }
    }
    if (isBuyer) {
      if (status === 2) {
        return <Button type="primary" size="small" onClick={() => handleConfirmReceive(record.id)}>确认收货</Button>;
      }
      if (status === 3 && !sellerComment) {
        return <Button type="primary" size="small" onClick={() => handleOpenComment(record.id)}>评价卖家</Button>;
      }
    }
    return null;
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
          <>
          <img 
            src={item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/50x50?text=No+Image'} 
            alt={item.title}
            style={{ width: 50, height: 50, marginRight: 10, objectFit: 'cover' }}
          />
          <Link to={`/items/${item.id}`}>{item.title}</Link>
          </>
        ) : (
          <span>商品信息缺失</span>
        )
      ),
    },
    {
      title: '价格',
      dataIndex: 'itemPrice',
      key: 'itemPrice',
      render: price => `¥${price}`,
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
        return <Tag color={color}>{text}</Tag>;
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
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => navigate(`/orders/${record.id}`)}>详情</Button>
          {renderActionButtons(record)}
        </>
      ),
    },
  ];

  return (
    <div style={{ background: '#fff', padding: 24, minHeight: 600 }}>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="我买到的订单" key="buyer">
          {loading ? <Spin /> : (
            <Table
              rowKey="id"
              columns={columns}
              dataSource={buyerOrders.filter(order => order && order.item)}
              locale={{ emptyText: <Empty description="暂无订单" /> }}
              pagination={false}
            />
          )}
        </TabPane>
        <TabPane tab="我卖出的订单" key="seller">
          {loading ? <Spin /> : (
            <Table
              rowKey="id"
              columns={columns}
              dataSource={sellerOrders.filter(order => order && order.item)}
              locale={{ emptyText: <Empty description="暂无订单" /> }}
              pagination={false}
            />
          )}
        </TabPane>
      </Tabs>
      <Modal
        title="订单评价"
        open={commentModalVisible}
        onOk={handleSubmitComment}
        onCancel={() => setCommentModalVisible(false)}
        confirmLoading={commentSubmitting}
        okText="提交"
        cancelText="取消"
      >
        <Input.TextArea
          rows={4}
          value={commentContent}
          onChange={e => setCommentContent(e.target.value)}
          placeholder="请输入评价内容"
        />
      </Modal>
    </div>
  );
};

export default MyOrders; 