import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Card, Typography, Steps, Divider, Button, Form, InputNumber, 
  Radio, Alert, Spin, Row, Col, Statistic, Descriptions, Result, Modal, Input, Space 
} from 'antd';
import { 
  ShoppingCartOutlined, WalletOutlined, SafetyOutlined, 
  CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined,
  QrcodeOutlined, DollarOutlined
} from '@ant-design/icons';
import { getEscrowByOrderId, createEscrow, payEscrow } from '../store/actions/escrowActions';
import { getOrderById } from '../store/actions/orderActions';
import { 
  selectEscrowDetail, selectPaymentInfo, 
  selectEscrowLoading, selectEscrowError 
} from '../store/slices/escrowSlice';
import { selectOrderDetail } from '../store/slices/orderSlice';
import QRCode from 'qrcode.react';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { confirm } = Modal;

const EscrowPayment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const escrowDetail = useSelector(selectEscrowDetail);
  const paymentInfo = useSelector(selectPaymentInfo);
  const loading = useSelector(selectEscrowLoading);
  const error = useSelector(selectEscrowError);
  const orderDetail = useSelector(selectOrderDetail);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  
  // 加载订单信息和托管信息
  useEffect(() => {
    if (orderId) {
      dispatch(getOrderById(orderId));
      dispatch(getEscrowByOrderId(orderId));
    }
  }, [dispatch, orderId]);
  
  // 根据托管状态设置当前步骤
  useEffect(() => {
    if (escrowDetail) {
      switch (escrowDetail.status) {
        case 1: // 未支付
          setCurrentStep(1);
          break;
        case 2: // 已支付，交易中
          setCurrentStep(2);
          break;
        case 3: // 已释放给卖家
        case 4: // 已退还给买家
        case 5: // 已过期
          setCurrentStep(3);
          break;
        default:
          setCurrentStep(0);
      }
    } else {
      setCurrentStep(0);
    }
  }, [escrowDetail]);
  
  // 创建托管
  const handleCreateEscrow = (values) => {
    dispatch(createEscrow({
      orderId,
      escrowAmount: values.escrowAmount,
      expireTime: values.expireTime
    }));
  };
  
  // 支付托管
  const handlePayEscrow = (paymentMethod) => {
    if (!escrowDetail) return;
    
    dispatch(payEscrow({
      escrowId: escrowDetail.id,
      paymentMethod
    }));
  };
  
  // 渲染托管状态
  const renderEscrowStatus = () => {
    if (!escrowDetail) return null;
    
    switch (escrowDetail.status) {
      case 1:
        return <Alert message="托管已创建，等待支付" type="info" showIcon />;
      case 2:
        return <Alert message="托管已支付，等待交易完成" type="success" showIcon />;
      case 3:
        return <Alert message="托管已释放给卖家，交易完成" type="success" showIcon />;
      case 4:
        return <Alert message="托管已退还给买家，交易取消" type="warning" showIcon />;
      case 5:
        return <Alert message="托管已过期" type="error" showIcon />;
      default:
        return null;
    }
  };
  
  // 渲染步骤1：创建托管
  const renderStep1 = () => {
    if (!orderDetail) return <Spin tip="加载订单信息..." />;
    
    return (
      <div>
        <Title level={4}>第一步：创建定金托管</Title>
        <Paragraph>
          创建定金托管可以保障买卖双方的权益。买家支付定金后，卖家确认收到定金，双方线下完成交易，确认无误后释放定金给卖家。
        </Paragraph>
        
        <Descriptions title="订单信息" bordered column={1}>
          <Descriptions.Item label="订单编号">{orderDetail.orderNo}</Descriptions.Item>
          <Descriptions.Item label="物品名称">{orderDetail.itemName}</Descriptions.Item>
          <Descriptions.Item label="物品价格">¥{orderDetail.itemPrice?.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="卖家">{orderDetail.sellerName}</Descriptions.Item>
          <Descriptions.Item label="买家">{orderDetail.buyerName}</Descriptions.Item>
          <Descriptions.Item label="交易地点">{orderDetail.tradeLocation || '未指定'}</Descriptions.Item>
        </Descriptions>
        
        <Divider />
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateEscrow}
          initialValues={{
            escrowAmount: orderDetail.itemPrice * 0.2, // 默认为总价的20%
            expireTime: 24 // 默认24小时
          }}
        >
          <Form.Item
            name="escrowAmount"
            label="托管金额"
            rules={[
              { required: true, message: '请输入托管金额' },
              { type: 'number', min: 1, message: '托管金额必须大于0' },
              { type: 'number', max: orderDetail.itemPrice, message: '托管金额不能超过物品价格' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\¥\s?|(,*)/g, '')}
              placeholder="建议为总价的20%"
            />
          </Form.Item>
          
          <Form.Item
            name="expireTime"
            label="过期时间"
            rules={[{ required: true, message: '请选择过期时间' }]}
          >
            <Radio.Group>
              <Radio value={12}>12小时</Radio>
              <Radio value={24}>24小时</Radio>
              <Radio value={48}>48小时</Radio>
              <Radio value={72}>72小时</Radio>
            </Radio.Group>
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SafetyOutlined />} loading={loading}>
              创建托管
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };
  
  // 渲染步骤2：支付定金
  const renderStep2 = () => {
    if (!escrowDetail) return <Spin tip="加载托管信息..." />;
    
    return (
      <div>
        <Title level={4}>第二步：支付定金</Title>
        <Paragraph>
          请选择支付方式，支付定金。支付成功后，卖家将收到通知，双方可以进行线下交易。
        </Paragraph>
        
        <Descriptions title="托管信息" bordered column={1}>
          <Descriptions.Item label="托管编号">{escrowDetail.id}</Descriptions.Item>
          <Descriptions.Item label="订单编号">{escrowDetail.orderNo}</Descriptions.Item>
          <Descriptions.Item label="托管金额">¥{escrowDetail.escrowAmount?.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="总金额">¥{escrowDetail.totalAmount?.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="过期时间">{escrowDetail.expireTime}</Descriptions.Item>
        </Descriptions>
        
        <Divider />
        
        {paymentInfo ? (
          <div style={{ textAlign: 'center' }}>
            <Title level={4}>请扫码支付</Title>
            <div style={{ margin: '20px 0' }}>
              <QRCode value={paymentInfo.qrCodeContent || 'https://example.com'} size={200} />
            </div>
            <Statistic
              title="支付金额"
              value={paymentInfo.amount}
              precision={2}
              prefix="¥"
              style={{ marginBottom: 20 }}
            />
            <Paragraph type="secondary">
              请在 {Math.floor(paymentInfo.expireSeconds / 60)} 分钟内完成支付，超时订单将自动取消
            </Paragraph>
            <Button type="primary" onClick={() => window.location.reload()}>
              我已完成支付
            </Button>
          </div>
        ) : (
          <div>
            <Title level={5}>选择支付方式</Title>
            <Space size="large" style={{ marginTop: 20 }}>
              <Button
                type="primary"
                icon={<QrcodeOutlined />}
                onClick={() => handlePayEscrow(1)}
                loading={loading}
              >
                支付宝
              </Button>
              <Button
                type="primary"
                icon={<QrcodeOutlined />}
                onClick={() => handlePayEscrow(2)}
                loading={loading}
              >
                微信支付
              </Button>
            </Space>
          </div>
        )}
      </div>
    );
  };
  
  // 渲染步骤3：交易状态
  const renderStep3 = () => {
    if (!escrowDetail) return <Spin tip="加载托管信息..." />;
    
    const renderResult = () => {
      switch (escrowDetail.status) {
        case 2: // 已支付，交易中
          return (
            <Result
              status="info"
              title="定金已支付，等待交易完成"
              subTitle={`交易编号: ${escrowDetail.orderNo} | 托管编号: ${escrowDetail.id}`}
              extra={[
                <Button key="back" onClick={() => navigate('/orders')}>
                  查看我的订单
                </Button>
              ]}
            />
          );
        case 3: // 已释放给卖家
          return (
            <Result
              status="success"
              title="交易成功，定金已释放给卖家"
              subTitle={`交易编号: ${escrowDetail.orderNo} | 托管编号: ${escrowDetail.id}`}
              extra={[
                <Button type="primary" key="home" onClick={() => navigate('/')}>
                  返回首页
                </Button>
              ]}
            />
          );
        case 4: // 已退还给买家
          return (
            <Result
              status="warning"
              title="交易已取消，定金已退还"
              subTitle={`交易编号: ${escrowDetail.orderNo} | 托管编号: ${escrowDetail.id}`}
              extra={[
                <Button type="primary" key="home" onClick={() => navigate('/')}>
                  返回首页
                </Button>
              ]}
            />
          );
        case 5: // 已过期
          return (
            <Result
              status="error"
              title="交易已过期"
              subTitle={`交易编号: ${escrowDetail.orderNo} | 托管编号: ${escrowDetail.id}`}
              extra={[
                <Button type="primary" key="home" onClick={() => navigate('/')}>
                  返回首页
                </Button>
              ]}
            />
          );
        default:
          return null;
      }
    };
    
    return (
      <div>
        <Title level={4}>第三步：完成交易</Title>
        {renderResult()}
        
        <Divider />
        
        <Descriptions title="托管详情" bordered column={1}>
          <Descriptions.Item label="托管编号">{escrowDetail.id}</Descriptions.Item>
          <Descriptions.Item label="订单编号">{escrowDetail.orderNo}</Descriptions.Item>
          <Descriptions.Item label="托管金额">¥{escrowDetail.escrowAmount?.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="总金额">¥{escrowDetail.totalAmount?.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="托管状态">
            {escrowDetail.status === 1 && '未支付'}
            {escrowDetail.status === 2 && '已支付，交易中'}
            {escrowDetail.status === 3 && '已释放给卖家'}
            {escrowDetail.status === 4 && '已退还给买家'}
            {escrowDetail.status === 5 && '已过期'}
          </Descriptions.Item>
          <Descriptions.Item label="支付方式">
            {escrowDetail.paymentMethod === 1 && '支付宝'}
            {escrowDetail.paymentMethod === 2 && '微信支付'}
            {!escrowDetail.paymentMethod && '未支付'}
          </Descriptions.Item>
          <Descriptions.Item label="支付时间">{escrowDetail.paymentTime || '未支付'}</Descriptions.Item>
          <Descriptions.Item label="过期时间">{escrowDetail.expireTime}</Descriptions.Item>
          <Descriptions.Item label="智能合约地址">{escrowDetail.contractAddress}</Descriptions.Item>
          <Descriptions.Item label="交易哈希">{escrowDetail.transactionHash || '未生成'}</Descriptions.Item>
          <Descriptions.Item label="备注">{escrowDetail.remark || '无'}</Descriptions.Item>
        </Descriptions>
      </div>
    );
  };
  
  if (loading && !escrowDetail && !orderDetail) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container" style={{ padding: '20px 0' }}>
        <Alert message="错误" description={error} type="error" showIcon />
      </div>
    );
  }
  
  return (
    <div className="container" style={{ padding: '20px 0' }}>
      <Card>
        <Title level={2}>定金托管交易</Title>
        
        {renderEscrowStatus()}
        
        <Steps current={currentStep} style={{ margin: '30px 0' }}>
          <Step title="创建托管" icon={<ShoppingCartOutlined />} />
          <Step title="支付定金" icon={<WalletOutlined />} />
          <Step title="完成交易" icon={<CheckCircleOutlined />} />
        </Steps>
        
        <Divider />
        
        {currentStep === 0 && renderStep1()}
        {currentStep === 1 && renderStep2()}
        {currentStep >= 2 && renderStep3()}
      </Card>
    </div>
  );
};

export default EscrowPayment; 