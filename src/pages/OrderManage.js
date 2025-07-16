import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Tabs, Table, Tag, Button, Typography, Badge, Space, Tooltip, 
  Modal, Input, message, Spin, Row, Col, Card, Statistic, Descriptions, Form 
} from 'antd';
import { 
  CheckCircleOutlined, CloseCircleOutlined, FieldTimeOutlined,
  DollarCircleOutlined, CommentOutlined, InfoCircleOutlined
} from '@ant-design/icons';
import { 
  fetchUserOrders, fetchSellerOrders, updateOrder, 
  cancelOrder, confirmReceive, rateOrder 
} from '../store/actions/orderActions';
import { 
  selectOrders, selectOrderLoading, selectOrderPagination
} from '../store/slices/orderSlice';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

const OrderManage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const orders = useSelector(selectOrders);
  const loading = useSelector(selectOrderLoading);
  const pagination = useSelector(selectOrderPagination);
  
  const [activeKey, setActiveKey] = useState('buyer');
  const [sellerRemark, setSellerRemark] = useState('');
  const [currentOrder, setCurrentOrder] = useState(null);
  const [remarkModalVisible, setRemarkModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // 加载订单数据
  useEffect(() => {
    if (activeKey === 'buyer') {
      dispatch(fetchUserOrders({ pageNum: 1, pageSize: 10 }));
    } else {
      dispatch(fetchSellerOrders({ pageNum: 1, pageSize: 10 }));
    }
  }, [dispatch, activeKey]);
  
  // 处理Tab切换
  const handleTabChange = (key) => {
    setActiveKey(key);
  };
  
  // 查看订单详情
  const handleViewOrderDetail = (order) => {
    setCurrentOrder(order);
    setRemarkModalVisible(true);
  };
  
  // 确认订单
  const handleConfirmOrder = (order) => {
    setCurrentOrder(order);
    setConfirmModalVisible(true);
    setActionType('confirm');
  };
  
  // 拒绝订单
  const handleRejectOrder = (order) => {
    setCurrentOrder(order);
    setRejectModalVisible(true);
    setActionType('reject');
  };
  
  // 完成订单
  const handleCompleteOrder = async (order) => {
    setSubmitting(true);
    try {
      await dispatch(confirmReceive(order.id)).unwrap();
      message.success('订单已完成');
      if (activeKey === 'buyer') {
        dispatch(fetchUserOrders({ pageNum: 1, pageSize: 10 }));
      } else {
        dispatch(fetchSellerOrders({ pageNum: 1, pageSize: 10 }));
      }
    } catch (error) {
      message.error('操作失败: ' + error);
    } finally {
      setSubmitting(false);
    }
  };
  
  // 取消订单
  const handleCancelOrder = async (order) => {
    Modal.confirm({
      title: '取消订单',
      content: '确定要取消该订单吗？',
      onOk: async () => {
        setSubmitting(true);
        try {
          await dispatch(cancelOrder(order.id)).unwrap();
          message.success('订单已取消');
          if (activeKey === 'buyer') {
            dispatch(fetchUserOrders({ pageNum: 1, pageSize: 10 }));
          } else {
            dispatch(fetchSellerOrders({ pageNum: 1, pageSize: 10 }));
          }
        } catch (error) {
          message.error('操作失败: ' + error);
        } finally {
          setSubmitting(false);
        }
      }
    });
  };
  
  // 提交备注确认/拒绝
  const handleSubmitAction = async () => {
    if (!currentOrder) return;
    
    setSubmitting(true);
    try {
      if (actionType === 'confirm') {
        await dispatch(updateOrder({ orderId: currentOrder.id, status: 'ACCEPTED', remark: sellerRemark })).unwrap();
        message.success('订单已确认');
      } else if (actionType === 'reject') {
        await dispatch(updateOrder({ orderId: currentOrder.id, status: 'REJECTED', remark: sellerRemark })).unwrap();
        message.success('订单已拒绝');
      }
      
      setConfirmModalVisible(false);
      setRejectModalVisible(false);
      setSellerRemark('');
      
      // 刷新列表
      dispatch(fetchSellerOrders({ pageNum: 1, pageSize: 10 }));
    } catch (error) {
      message.error('操作失败: ' + error);
    } finally {
      setSubmitting(false);
    }
  };
  
  // 渲染订单状态标签
  const renderStatusTag = (status) => {
    const statusMap = {
      1: { color: 'blue', text: '待确认' },
      2: { color: 'green', text: '已确认' },
      3: { color: 'red', text: '已拒绝' },
      4: { color: 'orange', text: '已取消' },
      5: { color: 'purple', text: '已完成' }
    };
    
    const statusInfo = statusMap[status] || { color: 'default', text: '未知状态' };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };
  
  // 渲染交易方式
  const renderTradeType = (type) => {
    switch (type) {
      case 1:
        return <Tag>线下交易</Tag>;
      case 2:
        return <Tag color="gold">线上交易</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };
  
  // 买家订单列表列定义
  const buyerColumns = [
    {
      title: '订单编号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      ellipsis: true,
    },
    {
      title: '物品信息',
      dataIndex: 'itemName',
      key: 'itemName',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary">¥{record.itemPrice?.toFixed(2)}</Text>
        </Space>
      ),
    },
    {
      title: '卖家',
      dataIndex: 'sellerName',
      key: 'sellerName',
    },
    {
      title: '交易方式',
      dataIndex: 'tradeType',
      key: 'tradeType',
      render: renderTradeType,
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      render: renderStatusTag,
    },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small" 
            onClick={() => handleViewOrderDetail(record)}
          >
            详情
          </Button>
          
          {record.status === 1 && (
            <Button 
              type="link" 
              size="small" 
              danger
              onClick={() => handleCancelOrder(record)}
            >
              取消
            </Button>
          )}
          
          {record.status === 2 && (
            <Button 
              type="link" 
              size="small"
              onClick={() => handleCompleteOrder(record)}
            >
              完成交易
            </Button>
          )}
        </Space>
      ),
    },
  ];
  
  // 卖家订单列表列定义
  const sellerColumns = [
    {
      title: '订单编号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      ellipsis: true,
    },
    {
      title: '物品信息',
      dataIndex: 'itemName',
      key: 'itemName',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary">¥{record.itemPrice?.toFixed(2)}</Text>
        </Space>
      ),
    },
    {
      title: '买家',
      dataIndex: 'buyerName',
      key: 'buyerName',
    },
    {
      title: '交易方式',
      dataIndex: 'tradeType',
      key: 'tradeType',
      render: renderTradeType,
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      render: renderStatusTag,
    },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small" 
            onClick={() => handleViewOrderDetail(record)}
          >
            详情
          </Button>
          
          {record.status === 1 && (
            <>
              <Button 
                type="link" 
                size="small"
                onClick={() => handleConfirmOrder(record)}
              >
                确认
              </Button>
              <Button 
                type="link" 
                size="small" 
                danger
                onClick={() => handleRejectOrder(record)}
              >
                拒绝
              </Button>
            </>
          )}
          
          {record.status === 2 && (
            <Button 
              type="link" 
              size="small"
              onClick={() => handleCompleteOrder(record)}
            >
              完成交易
            </Button>
          )}
        </Space>
      ),
    },
  ];
  
  return (
    <div className="container" style={{ padding: '20px 0' }}>
      <Card>
        <Title level={2}>我的订单</Title>
        
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="待处理订单"
                value={pagination.totalPending || 0}
                valueStyle={{ color: '#1890ff' }}
                prefix={<FieldTimeOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="已完成订单"
                value={pagination.totalCompleted || 0}
                valueStyle={{ color: '#52c41a' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="已取消订单"
                value={pagination.totalCancelled || 0}
                valueStyle={{ color: '#faad14' }}
                prefix={<CloseCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="交易总额"
                value={pagination.totalAmount || 0}
                precision={2}
                valueStyle={{ color: '#cf1322' }}
                prefix="¥"
                suffix=""
              />
            </Card>
          </Col>
        </Row>
        
        <Tabs activeKey={activeKey} onChange={handleTabChange}>
          <TabPane 
            tab={<span><Badge count={pagination.totalBuyerPending || 0} offset={[10, 0]}>我买到的</Badge></span>} 
            key="buyer"
          >
            <Table 
              columns={buyerColumns} 
              dataSource={orders} 
              rowKey="id" 
              loading={loading}
              pagination={{ 
                pageSize: pagination.pageSize,
                total: pagination.total,
                hideOnSinglePage: true,
              }}
            />
          </TabPane>
          <TabPane 
            tab={<span><Badge count={pagination.totalSellerPending || 0} offset={[10, 0]}>我卖出的</Badge></span>} 
            key="seller"
          >
            <Table 
              columns={sellerColumns} 
              dataSource={orders} 
              rowKey="id" 
              loading={loading}
              pagination={{ 
                pageSize: pagination.pageSize,
                total: pagination.total,
                hideOnSinglePage: true,
              }}
            />
          </TabPane>
        </Tabs>
      </Card>
      
      {/* 订单详情弹窗 */}
      <Modal
        title="订单详情"
        open={remarkModalVisible}
        onCancel={() => setRemarkModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setRemarkModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {currentOrder && (
          <div>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="订单编号">{currentOrder.orderNo}</Descriptions.Item>
              <Descriptions.Item label="物品名称">{currentOrder.itemName}</Descriptions.Item>
              <Descriptions.Item label="交易金额">¥{currentOrder.itemPrice?.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="买家">{currentOrder.buyerName}</Descriptions.Item>
              <Descriptions.Item label="卖家">{currentOrder.sellerName}</Descriptions.Item>
              <Descriptions.Item label="交易方式">{renderTradeType(currentOrder.tradeType)}</Descriptions.Item>
              <Descriptions.Item label="交易地点">{currentOrder.tradeLocation || '未指定'}</Descriptions.Item>
              <Descriptions.Item label="订单状态">{renderStatusTag(currentOrder.status)}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{currentOrder.createTime}</Descriptions.Item>
              <Descriptions.Item label="买家留言">{currentOrder.buyerMessage || '无'}</Descriptions.Item>
              <Descriptions.Item label="卖家备注">{currentOrder.sellerRemark || '无'}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
      
      {/* 确认订单弹窗 */}
      <Modal
        title="确认订单"
        open={confirmModalVisible}
        onOk={handleSubmitAction}
        onCancel={() => setConfirmModalVisible(false)}
        confirmLoading={submitting}
      >
        <p>确认接受该订单吗？确认后买家将收到通知。</p>
        <Form.Item label="卖家备注">
          <TextArea 
            rows={4} 
            value={sellerRemark}
            onChange={(e) => setSellerRemark(e.target.value)}
            placeholder="可以给买家留言，如：交易时间、地点等"
          />
        </Form.Item>
      </Modal>
      
      {/* 拒绝订单弹窗 */}
      <Modal
        title="拒绝订单"
        open={rejectModalVisible}
        onOk={handleSubmitAction}
        onCancel={() => setRejectModalVisible(false)}
        confirmLoading={submitting}
      >
        <p>确认拒绝该订单吗？拒绝后买家将收到通知。</p>
        <Form.Item label="拒绝原因" required>
          <TextArea 
            rows={4} 
            value={sellerRemark}
            onChange={(e) => setSellerRemark(e.target.value)}
            placeholder="请填写拒绝原因"
          />
        </Form.Item>
      </Modal>
    </div>
  );
};

export default OrderManage; 