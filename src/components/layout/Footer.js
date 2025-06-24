import React from 'react';
import { Layout, Row, Col, Typography, Space, Divider } from 'antd';
import { Link } from 'react-router-dom';
import {
  GithubOutlined,
  WechatOutlined,
  MailOutlined,
  PhoneOutlined
} from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const Footer = () => {
  return (
    <AntFooter>
      <div className="container">
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={8}>
            <Title level={4} style={{ color: 'white' }}>校园二手交易平台</Title>
            <Text type="secondary">
              校园二手交易平台是一个专为大学生设计的二手物品交易平台，
              旨在为校园内的闲置物品提供一个安全、便捷的交易环境。
            </Text>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Title level={4} style={{ color: 'white' }}>快速链接</Title>
            <Space direction="vertical">
              <Link to="/" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>首页</Link>
              <Link to="/items" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>全部物品</Link>
              <Link to="/items/publish" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>发布物品</Link>
              <Link to="/about" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>关于我们</Link>
              <Link to="/help" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>帮助中心</Link>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Title level={4} style={{ color: 'white' }}>联系我们</Title>
            <Space direction="vertical">
              <Space>
                <PhoneOutlined />
                <Text type="secondary">400-123-4567</Text>
              </Space>
              <Space>
                <MailOutlined />
                <Text type="secondary">support@campus-trading.com</Text>
              </Space>
              <Space>
                <WechatOutlined />
                <Text type="secondary">campus_trading</Text>
              </Space>
              <Space>
                <GithubOutlined />
                <a href="https://github.com/campus-trading" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                  GitHub
                </a>
              </Space>
            </Space>
          </Col>
        </Row>
        <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }} />
        <div className="text-center">
          <Text type="secondary">© {new Date().getFullYear()} 校园二手交易平台 版权所有</Text>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer; 