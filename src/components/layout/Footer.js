import React from 'react';
import { Layout, Row, Col, Typography, Space, Divider, Button, Input, Form } from 'antd';
import { 
  GithubOutlined, 
  WechatOutlined, 
  MailOutlined, 
  PhoneOutlined,
  ShoppingOutlined,
  SendOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined
} from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Title, Text, Link, Paragraph } = Typography;

const Footer = () => {
  const onFinish = (values) => {
    console.log('Received values:', values);
    // 这里可以添加订阅邮件的逻辑
  };

  return (
    <AntFooter>
      <div className="container">
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={24} md={8} lg={8}>
            <div style={{ marginBottom: 16 }}>
              <Space align="center">
                <ShoppingOutlined style={{ fontSize: 24, color: 'var(--primary-color)' }} />
                <Title level={4} style={{ margin: 0, color: 'var(--primary-color)' }}>校园二手交易平台</Title>
              </Space>
            </div>
            <Paragraph style={{ color: 'var(--light-text-color)', marginBottom: 24 }}>
              让闲置物品流通起来，让校园生活更加便利。
              我们致力于为校园师生提供安全、便捷的二手物品交易平台。
            </Paragraph>
            <div style={{ marginBottom: 16 }}>
              <Title level={5} style={{ color: 'var(--text-color)' }}>关注我们</Title>
              <Space size="middle">
                <Button 
                  type="text" 
                  icon={<FacebookOutlined />} 
                  style={{ color: 'var(--primary-color)', fontSize: '18px' }}
                />
                <Button 
                  type="text" 
                  icon={<TwitterOutlined />} 
                  style={{ color: 'var(--primary-color)', fontSize: '18px' }}
                />
                <Button 
                  type="text" 
                  icon={<InstagramOutlined />} 
                  style={{ color: 'var(--primary-color)', fontSize: '18px' }}
                />
                <Button 
                  type="text" 
                  icon={<LinkedinOutlined />} 
                  style={{ color: 'var(--primary-color)', fontSize: '18px' }}
                />
                <Button 
                  type="text" 
                  icon={<GithubOutlined />} 
                  style={{ color: 'var(--primary-color)', fontSize: '18px' }}
                />
              </Space>
            </div>
          </Col>
          
          <Col xs={24} sm={12} md={8} lg={8}>
            <Title level={5} style={{ color: 'var(--text-color)' }}>快速链接</Title>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Link href="/" style={{ color: 'var(--light-text-color)', marginBottom: 8 }}>首页</Link>
                  <Link href="/items" style={{ color: 'var(--light-text-color)', marginBottom: 8 }}>全部物品</Link>
                  <Link href="/items/publish" style={{ color: 'var(--light-text-color)', marginBottom: 8 }}>发布物品</Link>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Link href="/about" style={{ color: 'var(--light-text-color)', marginBottom: 8 }}>关于我们</Link>
                  <Link href="/help" style={{ color: 'var(--light-text-color)', marginBottom: 8 }}>帮助中心</Link>
                  <Link href="/terms" style={{ color: 'var(--light-text-color)', marginBottom: 8 }}>服务条款</Link>
                </div>
              </Col>
            </Row>
            
            <div style={{ marginTop: 24 }}>
              <Title level={5} style={{ color: 'var(--text-color)' }}>联系我们</Title>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Space style={{ marginBottom: 8 }}>
                  <MailOutlined style={{ color: 'var(--primary-color)' }} />
                  <Text style={{ color: 'var(--light-text-color)' }}>contact@campus-trading.com</Text>
                </Space>
                <Space style={{ marginBottom: 8 }}>
                  <PhoneOutlined style={{ color: 'var(--primary-color)' }} />
                  <Text style={{ color: 'var(--light-text-color)' }}>123-456-7890</Text>
                </Space>
                <Space style={{ marginBottom: 8 }}>
                  <WechatOutlined style={{ color: 'var(--primary-color)' }} />
                  <Text style={{ color: 'var(--light-text-color)' }}>campus_trading</Text>
                </Space>
              </div>
            </div>
          </Col>
          
          <Col xs={24} sm={12} md={8} lg={8}>
            <Title level={5} style={{ color: 'var(--text-color)' }}>订阅我们</Title>
            <Paragraph style={{ color: 'var(--light-text-color)' }}>
              订阅我们的新闻邮件，获取最新的平台动态和优质物品推荐
            </Paragraph>
            <Form onFinish={onFinish}>
              <Form.Item name="email" rules={[{ required: true, message: '请输入您的邮箱!' }]}>
                <Input.Search
                  placeholder="请输入您的邮箱"
                  enterButton={<><SendOutlined /> 订阅</>}
                  size="middle"
                  className="search-box"
                />
              </Form.Item>
            </Form>
            
            <div style={{ marginTop: 24, background: 'rgba(0, 184, 169, 0.1)', padding: 16, borderRadius: 8 }}>
              <Title level={5} style={{ color: 'var(--primary-color)' }}>下载我们的APP</Title>
              <Paragraph style={{ color: 'var(--light-text-color)' }}>
                扫描二维码下载APP，享受更流畅的交易体验
              </Paragraph>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button type="primary" style={{ borderRadius: 4 }}>Android版</Button>
                <Button type="primary" style={{ borderRadius: 4 }}>iOS版</Button>
              </div>
            </div>
          </Col>
        </Row>
        
        <Divider style={{ borderColor: 'var(--border-color)', margin: '24px 0 16px' }} />
        
        <div style={{ textAlign: 'center' }}>
          <Text style={{ color: 'var(--lighter-text-color)' }}>
            © {new Date().getFullYear()} 校园二手交易平台 版权所有
          </Text>
          <div style={{ marginTop: 8 }}>
            <Link href="/privacy" style={{ color: 'var(--lighter-text-color)', marginRight: 16 }}>隐私政策</Link>
            <Link href="/terms" style={{ color: 'var(--lighter-text-color)', marginRight: 16 }}>服务条款</Link>
            <Link href="/sitemap" style={{ color: 'var(--lighter-text-color)' }}>网站地图</Link>
          </div>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer; 