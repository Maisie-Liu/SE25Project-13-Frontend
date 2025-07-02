import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card, Button, Spin, Alert, Descriptions, Steps, Divider, message, Result, Space
} from 'antd';
import { 
  CheckCircleOutlined, CloseCircleOutlined, WalletOutlined, 
  ShoppingCartOutlined, CarOutlined, SmileOutlined
} from '@ant-design/icons';
import { fetchOrderById, confirmReceipt } from '../store/actions/orderActions';
import { 
  getEscrowByOrderId, payEscrow, releaseEscrow, refundEscrow 
} from '../store/actions/escrowActions';
import { selectCurrentOrder, selectOrderLoading } from '../store/slices/orderSlice';
import { selectEscrowDetail, selectPaymentQRCode, selectEscrowLoading } from '../store/slices/escrowSlice';
import { QRCodeSVG } from 'qrcode.react';

const { Step } = Steps;

const EscrowPayment = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const order = useSelector(selectCurrentOrder);
  const escrow = useSelector(selectEscrowDetail);
  const paymentQRCode = useSelector(selectPaymentQRCode);
  const orderLoading = useSelector(selectOrderLoading);
  const escrowLoading = useSelector(selectEscrowLoading);
  
  const [currentStep, setCurrentStep] = useState(0);
  
  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
      dispatch(getEscrowByOrderId(orderId));
    }
  }, [dispatch, orderId]);
  
  useEffect(() => {
    if (escrow) {
      // 根据托管状态设置当前步骤
      switch (escrow.status) {
        case 'PENDING':
          setCurrentStep(0);
          break;
        case 'PAID':
          setCurrentStep(1);
          break;
        case 'RELEASED':
          setCurrentStep(2);
          break;
        case 'REFUNDED':
          setCurrentStep(3); // 退款状态
          break;
        default:
          setCurrentStep(0);
      }
    }
  }, [escrow]);
  
  // 支付定金
  const handlePayEscrow = () => {
    if (escrow && escrow.id) {
      dispatch(payEscrow(escrow.id))
        .then(() => {
          message.success('定金支付成功');
        })
        .catch((error) => {
          message.error(`支付失败: ${error.message}`);
        });
    }
  };
  
  // 释放定金
  const handleReleaseEscrow = () => {
    if (escrow && escrow.id) {
      dispatch(releaseEscrow(escrow.id))
        .then(() => {
          message.success('定金已释放给卖家');
          dispatch(getEscrowByOrderId(orderId));
        })
        .catch((error) => {
          message.error(`释放失败: ${error.message}`);
        });
    }
  };
  
  // 退还定金
  const handleRefundEscrow = () => {
    if (escrow && escrow.id) {
      dispatch(refundEscrow(escrow.id))
        .then(() => {
          message.success('定金已退还给买家');
          dispatch(getEscrowByOrderId(orderId));
        })
        .catch((error) => {
          message.error(`退还失败: ${error.message}`);
        });
    }
  };
  
  // 确认收货
  const handleConfirmReceipt = () => {
    if (orderId) {
      dispatch(confirmReceipt(orderId))
        .then(() => {
          message.success('已确认收货');
          dispatch(fetchOrderById(orderId));
        })
        .catch((error) => {
          message.error(`确认收货失败: ${error.message}`);
        });
    }
  };
  
  if (orderLoading || escrowLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }
  
  if (!order) {
    return (
      <Result
        status="404"
        title="订单不存在"
        subTitle="抱歉，您查找的订单不存在或已被删除。"
        extra={
          <Button type="primary" onClick={() => navigate('/my-orders')}>
            返回我的订单
          </Button>
        }
      />
    );
  }
  
  return (
    <div className="escrow-payment-container">
      <Card title="线上交易服务" bordered={false}>
        <Alert
          message="交易安全提示"
          description="通过线上交易，您的交易将更加安全。卖家发货后，买家确认收货满意再释放货款给卖家。"
          type="info"
          showIcon
          style={{ marginBottom: '20px' }}
        />
        
        <Steps current={currentStep}>
          <Step title="线上支付" icon={<WalletOutlined />} />
          <Step title="等待发货" icon={<ShoppingCartOutlined />} />
          <Step title="确认收货" icon={<CarOutlined />} />
          <Step title="交易完成" icon={<SmileOutlined />} />
        </Steps>
        
        <Divider />
        
        {escrow ? (
          <Descriptions title="线上交易详情" bordered>
            <Descriptions.Item label="线上交易ID">{escrow.id}</Descriptions.Item>
            <Descriptions.Item label="关联订单">{escrow.orderId}</Descriptions.Item>
            <Descriptions.Item label="交易金额">￥{escrow.amount}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{escrow.createdAt}</Descriptions.Item>
            <Descriptions.Item label="状态" span={2}>
              {escrow.status === 'PENDING' && <span style={{ color: '#faad14' }}>待支付</span>}
              {escrow.status === 'PAID' && <span style={{ color: '#1890ff' }}>已支付</span>}
              {escrow.status === 'RELEASED' && <span style={{ color: '#52c41a' }}>已释放</span>}
              {escrow.status === 'REFUNDED' && <span style={{ color: '#ff4d4f' }}>已退款</span>}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Alert
            message="线上交易信息不存在"
            description="该订单尚未创建线上交易，请联系卖家或客服。"
            type="warning"
            showIcon
          />
        )}
        
        <Divider />
        
        {/* 根据当前步骤和角色显示不同操作 */}
        <div className="escrow-actions">
          {escrow && escrow.status === 'PENDING' && (
            <div className="escrow-payment">
              <h3>支付定金</h3>
              {paymentQRCode ? (
                <div className="qrcode-container" style={{ textAlign: 'center' }}>
                  <QRCodeSVG value={paymentQRCode} size={200} />
                  <p style={{ marginTop: '10px' }}>请使用支付宝/微信扫码支付</p>
                </div>
              ) : (
                <Button type="primary" onClick={handlePayEscrow}>
                  立即支付定金
                </Button>
              )}
            </div>
          )}
          
          {escrow && escrow.status === 'PAID' && order.status === 'DELIVERED' && (
            <div className="escrow-release">
              <Space>
                <Button type="primary" onClick={handleConfirmReceipt}>
                  确认收货并释放货款
                </Button>
                <Button danger onClick={handleRefundEscrow}>
                  申请退款
                </Button>
              </Space>
            </div>
          )}
          
          {escrow && escrow.status === 'RELEASED' && (
            <Result
              status="success"
              title="交易已完成"
              subTitle="感谢您使用我们的线上交易服务，货款已成功释放给卖家。"
              extra={[
                <Button type="primary" key="home" onClick={() => navigate('/')}>
                  继续购物
                </Button>,
                <Button key="orders" onClick={() => navigate('/my-orders')}>
                  查看我的订单
                </Button>,
              ]}
            />
          )}
          
          {escrow && escrow.status === 'REFUNDED' && (
            <Result
              status="info"
              title="货款已退还"
              subTitle="您的货款已退还，如有问题请联系客服。"
              extra={[
                <Button type="primary" key="home" onClick={() => navigate('/')}>
                  返回首页
                </Button>,
                <Button key="orders" onClick={() => navigate('/my-orders')}>
                  查看我的订单
                </Button>,
              ]}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default EscrowPayment; 