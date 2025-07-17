import React from 'react';
import styled from 'styled-components';
import { Layout, Row, Col, Typography, Space, Divider, Button, Input, Form } from 'antd';
import { Link as RouterLink } from 'react-router-dom';
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
  LinkedinOutlined,
  GlobalOutlined
} from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Title, Text, Link, Paragraph } = Typography;

// 使用styled-components创建样式组件
const StyledFooter = styled(AntFooter)`
  background: #f0f5f9;
  padding: 40px 0 20px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #00B8A9, #0DD8C8, #00B8A9);
  }
`;

const BrandTitle = styled(Title)`
  &.ant-typography {
    font-family: 'Ma Shan Zheng', cursive;
    font-size: 32px;
    margin: 0;
    color: #00B8A9;
    position: relative;
    display: inline-block;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 50%;
      height: 2px;
      background: linear-gradient(90deg, #00B8A9, transparent);
      border-radius: 2px;
    }
  }
`;

const StyledIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  margin-right: 10px;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
  }
  
  .anticon {
    font-size: 18px;
    color: #00B8A9;
  }
`;

const SocialButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
  margin-right: 10px;
  
  &:hover {
    transform: translateY(-3px) rotate(5deg);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background: #f9f9f9;
  }
  
  .anticon {
    font-size: 18px;
    color: #00B8A9;
  }
`;

const FooterLink = styled(RouterLink)`
  color: #4a5568;
  position: relative;
  padding-left: 10px;
  transition: all 0.3s;
  display: block;
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 14px;
  line-height: 1.8;
  margin-bottom: 8px;
  text-decoration: none;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 4px;
    height: 4px;
    background: #00B8A9;
    border-radius: 50%;
    transform: translateY(-50%);
    opacity: 0.7;
    transition: all 0.3s;
  }
  
  &:hover {
    color: #00B8A9;
    padding-left: 14px;
    
    &::before {
      width: 5px;
      height: 5px;
      opacity: 1;
    }
  }
`;

const AppDownload = styled.div`
  background: linear-gradient(135deg, rgba(0, 184, 169, 0.05) 0%, rgba(13, 216, 200, 0.1) 100%);
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 184, 169, 0.1);
`;

const AppButton = styled(Button)`
  border-radius: 6px;
  height: 34px;
  padding: 0 14px;
  background: linear-gradient(135deg, #00B8A9, #0DD8C8);
  border: none;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(0, 184, 169, 0.2);
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 184, 169, 0.3);
    background: linear-gradient(135deg, #00a89a, #0cc8b8);
  }
`;

const CopyrightText = styled(Text)`
  font-family: 'Zhi Mang Xing', cursive;
  font-size: 18px;
  letter-spacing: 1px;
  background: linear-gradient(90deg, #00B8A9, #0DD8C8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const FooterDivider = styled(Divider)`
  &.ant-divider {
    margin: 24px 0 16px;
    
    &::before, &::after {
      border-top: 1px solid #e2e8f0;
    }
  }
`;

const FooterSection = styled.div`
  margin-bottom: 16px;
`;

const SectionTitle = styled(Title)`
  &.ant-typography {
    color: #2d3748;
    margin-bottom: 16px;
    font-weight: 600;
    font-size: 16px;
  }
`;

const BottomLink = styled(RouterLink)`
  margin: 0 10px;
  color: #718096;
  font-size: 14px;
  
  &:hover {
    color: var(--primary-color);
    text-decoration: underline;
  }
`;

// 增强版网站地图链接样式
const SitemapBottomLink = styled(BottomLink)`
  color: var(--primary-color);
  font-weight: 500;
  position: relative;
  padding: 2px 10px;
  background-color: rgba(0, 184, 169, 0.1);
  border-radius: 12px;
  
  &:hover {
    background-color: rgba(0, 184, 169, 0.2);
    box-shadow: 0 2px 6px rgba(0, 184, 169, 0.15);
  }
  
  transition: all 0.3s ease;
`;

const Footer = () => {
  const onFinish = (values) => {
    console.log('Received values:', values);
    // 这里可以添加订阅邮件的逻辑
  };

  return (
    <StyledFooter>
      <div className="container">
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={24} md={8} lg={8}>
            <FooterSection>
              <Space align="center" style={{ marginBottom: 16 }}>
                <ShoppingOutlined style={{ fontSize: 24, color: '#00B8A9' }} />
                <BrandTitle level={4}>交物通</BrandTitle>
              </Space>
              <Paragraph style={{ color: '#4a5568', marginBottom: 16, fontSize: '14px' }}>
                让闲置物品流通起来，让校园生活更加便利。
                我们致力于为校园师生提供安全、便捷的二手物品交易平台。
              </Paragraph>
              <div>
                <SectionTitle level={5}>关注我们</SectionTitle>
                <Space size="small">
                  <SocialButton 
                    type="text" 
                    icon={<FacebookOutlined />}
                  />
                  <SocialButton 
                    type="text" 
                    icon={<TwitterOutlined />}
                  />
                  <SocialButton 
                    type="text" 
                    icon={<InstagramOutlined />}
                  />
                  <SocialButton 
                    type="text" 
                    icon={<LinkedinOutlined />}
                  />
                  <SocialButton 
                    type="text" 
                    icon={<GithubOutlined />}
                  />
                </Space>
              </div>
            </FooterSection>
          </Col>
          
          <Col xs={24} sm={12} md={8} lg={8}>
            <FooterSection>
              <SectionTitle level={5}>快速链接</SectionTitle>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <FooterLink to="/">首页</FooterLink>
                    <FooterLink to="/items">全部物品</FooterLink>
                    <FooterLink to="/items/publish">发布物品</FooterLink>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <FooterLink to="/about">关于我们</FooterLink>
                    <FooterLink to="/help">帮助中心</FooterLink>
                    <FooterLink to="/terms">服务条款</FooterLink>
                  </div>
                </Col>
              </Row>
            </FooterSection>
            
            <FooterSection>
              <SectionTitle level={5}>联系我们</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Space style={{ marginBottom: 10 }}>
                  <StyledIcon>
                    <MailOutlined />
                  </StyledIcon>
                  <Text style={{ color: '#4a5568' }}>contact@campus-trading.com</Text>
                </Space>
                <Space style={{ marginBottom: 10 }}>
                  <StyledIcon>
                    <PhoneOutlined />
                  </StyledIcon>
                  <Text style={{ color: '#4a5568' }}>123-456-7890</Text>
                </Space>
                <Space style={{ marginBottom: 10 }}>
                  <StyledIcon>
                    <WechatOutlined />
                  </StyledIcon>
                  <Text style={{ color: '#4a5568' }}>campus_trading</Text>
                </Space>
              </div>
            </FooterSection>
          </Col>
          
          <Col xs={24} sm={12} md={8} lg={8}>
            <FooterSection>
              <SectionTitle level={5}>订阅我们</SectionTitle>
              <Paragraph style={{ color: '#4a5568', marginBottom: 14, fontSize: '14px' }}>
                订阅我们的新闻邮件，获取最新的平台动态和优质物品推荐
              </Paragraph>
              <Form onFinish={onFinish}>
                <Form.Item name="email" rules={[{ required: true, message: '请输入您的邮箱!' }]}>
                  <Input.Search
                    placeholder="请输入您的邮箱"
                    enterButton={<SendOutlined />}
                    size="middle"
                    style={{ borderRadius: '6px', overflow: 'hidden' }}
                  />
                </Form.Item>
              </Form>
            </FooterSection>
            
            <AppDownload>
              <SectionTitle level={5} style={{ color: '#00B8A9', marginBottom: 10 }}>下载我们的APP</SectionTitle>
              <Paragraph style={{ color: '#4a5568', marginBottom: 12, fontSize: '14px' }}>
                扫描二维码下载APP，享受更流畅的交易体验
              </Paragraph>
              <div style={{ display: 'flex', gap: 10 }}>
                <AppButton type="primary">Android版</AppButton>
                <AppButton type="primary">iOS版</AppButton>
              </div>
            </AppDownload>
          </Col>
        </Row>
        
        <FooterDivider />
        
        <div style={{ textAlign: 'center' }}>
          <CopyrightText>
            © {new Date().getFullYear()} 交物通 版权所有
          </CopyrightText>
          <div style={{ marginTop: 10 }}>
            <BottomLink to="/privacy">隐私政策</BottomLink>
            <BottomLink to="/terms">服务条款</BottomLink>
            <SitemapBottomLink to="/sitemap">
              <GlobalOutlined style={{ marginRight: 4 }} /> 网站地图
            </SitemapBottomLink>
          </div>
        </div>
      </div>
    </StyledFooter>
  );
};

export default Footer; 