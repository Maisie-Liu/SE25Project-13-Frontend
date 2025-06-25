import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Form,
  Input,
  Select,
  Button,
  InputNumber,
  Upload,
  Card,
  message,
  Typography,
  Row,
  Col,
  Divider
} from 'antd';
import { UploadOutlined, LoadingOutlined, InboxOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const RequestPublish = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 处理表单提交
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // 这里应该发送请求到后端API
      console.log('提交求购信息:', values);
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('求购信息发布成功！');
      navigate('/requests');
    } catch (error) {
      message.error('发布失败，请重试！');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Card bordered={false} className="publish-card">
        <Title level={2} className="text-center">发布求购信息</Title>
        <Divider />
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            category: 'other',
            price: '',
            condition: 'any'
          }}
        >
          <Row gutter={24}>
            <Col xs={24} md={24}>
              <Form.Item
                name="title"
                label="求购标题"
                rules={[{ required: true, message: '请输入求购标题' }]}
              >
                <Input placeholder="请输入求购标题，例如：求购 MacBook Pro 2021款" maxLength={50} />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="category"
                label="物品类别"
                rules={[{ required: true, message: '请选择物品类别' }]}
              >
                <Select placeholder="请选择物品类别">
                  <Option value="electronics">电子产品</Option>
                  <Option value="books">图书教材</Option>
                  <Option value="daily">生活用品</Option>
                  <Option value="clothing">服装鞋帽</Option>
                  <Option value="sports">运动户外</Option>
                  <Option value="other">其他物品</Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="condition"
                label="物品成色要求"
                rules={[{ required: true, message: '请选择物品成色要求' }]}
              >
                <Select placeholder="请选择物品成色要求">
                  <Option value="any">不限</Option>
                  <Option value="new">全新</Option>
                  <Option value="almost_new">几乎全新</Option>
                  <Option value="light_used">轻度使用</Option>
                  <Option value="medium_used">中度使用</Option>
                  <Option value="heavy_used">重度使用</Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="price"
                label="预期价格"
                rules={[{ required: true, message: '请输入预期价格' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入您的预期价格"
                  min={0}
                  step={10}
                  formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/¥\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="negotiable"
                label="价格是否可议"
                rules={[{ required: true, message: '请选择价格是否可议' }]}
              >
                <Select placeholder="请选择">
                  <Option value={true}>可议价</Option>
                  <Option value={false}>不可议价</Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col xs={24}>
              <Form.Item
                name="description"
                label="求购详情"
                rules={[{ required: true, message: '请输入求购详情' }]}
              >
                <TextArea
                  placeholder="请详细描述您要求购的物品信息，例如：规格、型号、配置、成色要求等"
                  autoSize={{ minRows: 4, maxRows: 8 }}
                  maxLength={500}
                  showCount
                />
              </Form.Item>
            </Col>
            
            <Col xs={24}>
              <Form.Item
                name="contact"
                label="联系方式"
                rules={[{ required: true, message: '请提供联系方式' }]}
              >
                <Input placeholder="请输入您的联系方式，例如：微信、QQ或手机号" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item style={{ marginTop: '24px' }}>
            <div style={{ textAlign: 'center' }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large"
                style={{ width: '180px', height: '48px' }}
                loading={loading}
              >
                发布求购信息
              </Button>
              <br />
              <Button 
                type="link" 
                style={{ marginTop: '16px' }} 
                onClick={() => navigate(-1)}
              >
                返回上一页
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RequestPublish; 