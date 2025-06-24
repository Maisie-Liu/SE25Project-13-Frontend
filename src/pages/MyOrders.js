import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs, Table, Tag, Button, Empty, Spin, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserOrders, updateOrder } from '../store/actions/orderActions';
import { selectOrders, selectOrderLoading } from '../store/slices/orderSlice';

const { TabPane } = Tabs;

const MyOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orders = useSelector(selectOrders);
  const loading = useSelector(selectOrderLoading);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    dispatch(fetchUserOrders({}));
  }, [dispatch]);

  const handleUpdateStatus = (orderId, status) => {
    dispatch(updateOrder({ orderId, status }))
      .then(() => {
        message.success('订单状态更新成功');
        dispatch(fetchUserOrders({}));
      })
      .catch(() => {
        message.error('更新失败，请重试');
      });
  };

  const getFilteredOrders = (tab) => {
    if (!orders) return [];
    
    switch(tab) {
      case 'pending':
        return orders.filter(order => order.status === 'PENDING');
      case 'paid':
        return orders.filter(order => order.status === 'PAID');
      case 'completed':
        return orders.filter(order => order.status === 'COMPLETED');
      case 'cancelled':
        return orders.filter(order => order.status === 'CANCELLED');
      default:
        return orders;
    }
  };

  const renderActionButton = (record) => {
    const { status, id, role } = record;
    
    if (role === 'BUYER') {
      switch(status) {
        case 'PENDING':
          return (
            <Button 
              type="primary" 
              size="small"
              onClick={() => navigate(`/escrow/${id}`)}
            >
              支付定金
            </Button>
          );
        case 'PAID':
          return (
            <Button 
              type="primary" 
              size="small"
              onClick={() => handleUpdateStatus(id, 'COMPLETED')}
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
              size="small"
              onClick={() => handleUpdateStatus(id, 'CANCELLED')}
            >
              取消订单
            </Button>
          );
        case 'PAID':
          return (
            <Button 
              type="primary" 
              size="small"
              onClick={() => handleUpdateStatus(id, 'COMPLETED')}
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

  const columns = [
    {
      title: '商品信息',
      dataIndex: 'item',
      key: 'item',
      render: (item) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/50x50?text=No+Image'} 
            alt={item.title}
            style={{ width: 50, height: 50, marginRight: 10, objectFit: 'cover' }}
          />
          <Link to={`/items/${item.id}`}>{item.title}</Link>
        </div>
      ),
    },
    {
      title: '价格',
      dataIndex: 'amount',
      key: 'amount',
      render: amount => `¥${amount}`,
    },
    {
      title: '定金',
      dataIndex: 'deposit',
      key: 'deposit',
      render: deposit => `¥${deposit || 0}`,
    },
    {
      title: '交易角色',
      dataIndex: 'role',
      key: 'role',
      render: role => (
        <Tag color={role === 'BUYER' ? 'blue' : 'orange'}>
          {role === 'BUYER' ? '买家' : '卖家'}
        </Tag>
      ),
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        let color = 'blue';
        let text = '未知';
        
        switch(status) {
          case 'PENDING':
            color = 'gold';
            text = '待支付';
            break;
          case 'PAID':
            color = 'blue';
            text = '已支付';
            break;
          case 'COMPLETED':
            color = 'green';
            text = '已完成';
            break;
          case 'CANCELLED':
            color = 'red';
            text = '已取消';
            break;
          default:
            break;
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: time => new Date(time).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <div>
          <Button 
            type="link" 
            onClick={() => navigate(`/orders/${record.id}`)}
          >
            详情
          </Button>
          
          {renderActionButton(record)}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="my-orders-container">
      <h1>我的订单</h1>
      
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
      >
        <TabPane tab="全部订单" key="all" />
        <TabPane tab="待支付" key="pending" />
        <TabPane tab="已支付" key="paid" />
        <TabPane tab="已完成" key="completed" />
        <TabPane tab="已取消" key="cancelled" />
      </Tabs>
      
      {orders && orders.length > 0 ? (
        <Table 
          columns={columns} 
          dataSource={getFilteredOrders(activeTab).map(order => ({ ...order, key: order.id }))} 
          pagination={{ pageSize: 10 }}
        />
      ) : (
        <Empty description="暂无订单记录" />
      )}
    </div>
  );
};

export default MyOrders; 