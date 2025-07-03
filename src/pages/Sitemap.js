import React from 'react';
import { Typography, Card, Row, Col, Divider, Tag, Space } from 'antd';
import { 
  HomeOutlined, 
  ShopOutlined, 
  UserOutlined, 
  OrderedListOutlined, 
  HeartOutlined, 
  QuestionCircleOutlined, 
  FileTextOutlined,
  LockOutlined,
  GlobalOutlined,
  CustomerServiceOutlined,
  AppstoreOutlined,
  TagsOutlined,
  SearchOutlined,
  ShoppingOutlined,
  TeamOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const { Title, Text } = Typography;

// 自定义标题组件，使用"Ma Shan Zheng"字体
const BrandTitle = styled.span`
  font-family: 'Ma Shan Zheng', cursive;
  font-size: 36px;
  color: #00B8A9;
  margin: 0;
  position: relative;
  display: inline-block;
`;

// 自定义链接组件
const SitemapLink = ({ to, icon, title, description }) => (
  <Link to={to} style={{ textDecoration: 'none' }}>
    <Card 
      hoverable 
      size="small" 
      style={{ 
        marginBottom: 16, 
        borderRadius: 8,
        transition: 'all 0.3s',
        overflow: 'hidden'
      }}
      bodyStyle={{ padding: '12px 16px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          width: 36, 
          height: 36, 
          borderRadius: '50%', 
          background: 'var(--primary-color)',
          opacity: 0.1,
          marginRight: 12
        }}>
          <span style={{ fontSize: 18, color: 'var(--primary-color)' }}>{icon}</span>
        </div>
        <div>
          <div style={{ 
            fontSize: 15, 
            fontWeight: 500, 
            color: '#2d3748',
            marginBottom: 2
          }}>
            {title}
          </div>
          {description && (
            <div style={{ fontSize: 12, color: '#718096' }}>
              {description}
            </div>
          )}
        </div>
      </div>
    </Card>
  </Link>
);

// 自定义分类组件
const SitemapSection = ({ title, icon, children }) => (
  <div style={{ marginBottom: 32 }}>
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      marginBottom: 16,
      background: 'rgba(0, 184, 169, 0.05)',
      padding: '10px 16px',
      borderRadius: 8,
      borderLeft: '4px solid var(--primary-color)'
    }}>
      <span style={{ 
        fontSize: 18, 
        color: 'var(--primary-color)', 
        marginRight: 10 
      }}>
        {icon}
      </span>
      <span style={{ 
        fontSize: 16, 
        fontWeight: 600, 
        color: '#2d3748'
      }}>
        {title}
      </span>
    </div>
    {children}
  </div>
);

const Sitemap = () => {
  // 网站地图数据
  const sitemapData = [
    {
      title: '主要页面',
      icon: <HomeOutlined />,
      items: [
        { icon: <HomeOutlined />, title: '首页', description: '交物通平台首页', to: '/' },
        { icon: <ShopOutlined />, title: '全部物品', description: '浏览所有在售物品', to: '/items' },
        { icon: <QuestionCircleOutlined />, title: '帮助中心', description: '获取平台使用帮助', to: '/help' },
        { icon: <TeamOutlined />, title: '关于我们', description: '了解交物通平台', to: '/about' },
      ]
    },
    {
      title: '物品管理',
      icon: <AppstoreOutlined />,
      items: [
        { icon: <ShoppingOutlined />, title: '发布物品', description: '发布二手物品出售', to: '/items/publish' },
        { icon: <ShopOutlined />, title: '我的物品', description: '管理我发布的物品', to: '/my/items' },
        { icon: <SearchOutlined />, title: '物品搜索', description: '搜索平台上的物品', to: '/items' },
        { icon: <TagsOutlined />, title: '物品分类', description: '按分类浏览物品', to: '/items?category=all' },
      ]
    },
    {
      title: '用户中心',
      icon: <UserOutlined />,
      items: [
        { icon: <UserOutlined />, title: '用户登录', description: '用户账号登录', to: '/login' },
        { icon: <UserOutlined />, title: '用户注册', description: '注册新用户账号', to: '/register' },
        { icon: <InfoCircleOutlined />, title: '个人资料', description: '查看和编辑个人资料', to: '/profile' },
        { icon: <LockOutlined />, title: '修改密码', description: '修改账号密码', to: '/profile' },
      ]
    },
    {
      title: '订单管理',
      icon: <OrderedListOutlined />,
      items: [
        { icon: <OrderedListOutlined />, title: '我的订单', description: '查看我的所有订单', to: '/my/orders' },
        { icon: <OrderedListOutlined />, title: '订单管理', description: '管理订单状态', to: '/orders/manage' },
        { icon: <ShoppingOutlined />, title: '支付页面', description: '订单支付页面', to: '/escrow/payment' },
      ]
    },
    {
      title: '收藏夹',
      icon: <HeartOutlined />,
      items: [
        { icon: <HeartOutlined />, title: '我的收藏', description: '查看收藏的物品', to: '/my/favorites' },
      ]
    },
    {
      title: '政策与条款',
      icon: <FileTextOutlined />,
      items: [
        { icon: <FileTextOutlined />, title: '服务条款', description: '平台服务条款', to: '/terms' },
        { icon: <LockOutlined />, title: '隐私政策', description: '平台隐私政策', to: '/privacy' },
        { icon: <GlobalOutlined />, title: '网站地图', description: '浏览网站结构', to: '/sitemap' },
      ]
    },
    {
      title: '支持与帮助',
      icon: <CustomerServiceOutlined />,
      items: [
        { icon: <QuestionCircleOutlined />, title: '常见问题', description: '常见问题解答', to: '/help#faq' },
        { icon: <CustomerServiceOutlined />, title: '联系我们', description: '联系平台客服', to: '/help#contact' },
        { icon: <FileTextOutlined />, title: '用户指南', description: '平台使用指南', to: '/help#guide' },
      ]
    },
  ];

  return (
    <div className="sitemap-page">
      <div style={{ 
        textAlign: 'center', 
        margin: '40px 0 50px',
        padding: '20px',
        borderRadius: 12
      }}>
        <div style={{ marginBottom: 15 }}>
          <BrandTitle>网站地图</BrandTitle>
        </div>
        <Text style={{ fontSize: 16, color: '#718096' }}>浏览交物通平台所有页面</Text>
      </div>

      <div className="sitemap-content">
        <Row gutter={[32, 32]}>
          {sitemapData.map((section, index) => (
            <Col xs={24} sm={24} md={12} key={index}>
              <SitemapSection title={section.title} icon={section.icon}>
                {section.items.map((item, itemIndex) => (
                  <SitemapLink 
                    key={itemIndex}
                    to={item.to}
                    icon={item.icon}
                    title={item.title}
                    description={item.description}
                  />
                ))}
              </SitemapSection>
            </Col>
          ))}
        </Row>

        <Divider style={{ margin: '50px 0' }} />
        
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <Title level={4} style={{ marginBottom: 30, color: '#2d3748' }}>网站结构可视化</Title>
          
          <div className="sitemap-visual" style={{ 
            display: 'flex',
            justifyContent: 'center',
            padding: '20px',
            overflow: 'auto'
          }}>
            <div style={{ 
              position: 'relative',
              background: '#fff',
              padding: '40px',
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
              minWidth: '600px'
            }}>
              {/* 主节点 */}
              <div style={{ 
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                  <Tag color="var(--primary-color)" style={{ 
                    padding: '8px 16px', 
                    fontSize: '16px',
                    borderRadius: '20px',
                    marginBottom: '30px',
                    boxShadow: '0 2px 8px rgba(0, 184, 169, 0.2)'
                  }}>
                    <HomeOutlined /> 首页
                  </Tag>
                </Link>
                
                {/* 连接线 */}
                <div style={{ 
                  width: '2px', 
                  height: '30px', 
                  background: '#e2e8f0',
                  marginBottom: '30px'
                }}></div>
                
                {/* 一级节点 */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '50px',
                  flexWrap: 'wrap'
                }}>
                  <div className="sitemap-node">
                    <Link to="/items" style={{ textDecoration: 'none' }}>
                      <Tag color="#0DD8C8" style={{ 
                        padding: '6px 12px', 
                        fontSize: '14px',
                        borderRadius: '16px',
                        marginBottom: '20px'
                      }}>
                        <ShopOutlined /> 物品浏览
                      </Tag>
                    </Link>
                    <div style={{ 
                      width: '2px', 
                      height: '20px', 
                      background: '#e2e8f0',
                      margin: '0 auto 20px'
                    }}></div>
                    <Space direction="vertical" size={12} style={{ display: 'flex', alignItems: 'center' }}>
                      <Link to="/items/:id" style={{ textDecoration: 'none' }}>
                        <Tag style={{ borderRadius: '12px' }}>物品详情</Tag>
                      </Link>
                      <Link to="/items/publish" style={{ textDecoration: 'none' }}>
                        <Tag style={{ borderRadius: '12px' }}>发布物品</Tag>
                      </Link>
                      <Link to="/items/edit/:id" style={{ textDecoration: 'none' }}>
                        <Tag style={{ borderRadius: '12px' }}>编辑物品</Tag>
                      </Link>
                    </Space>
                  </div>
                  
                  <div className="sitemap-node">
                    <Link to="/profile" style={{ textDecoration: 'none' }}>
                      <Tag color="#0DD8C8" style={{ 
                        padding: '6px 12px', 
                        fontSize: '14px',
                        borderRadius: '16px',
                        marginBottom: '20px'
                      }}>
                        <UserOutlined /> 用户中心
                      </Tag>
                    </Link>
                    <div style={{ 
                      width: '2px', 
                      height: '20px', 
                      background: '#e2e8f0',
                      margin: '0 auto 20px'
                    }}></div>
                    <Space direction="vertical" size={12} style={{ display: 'flex', alignItems: 'center' }}>
                      <Link to="/login" style={{ textDecoration: 'none' }}>
                        <Tag style={{ borderRadius: '12px' }}>登录</Tag>
                      </Link>
                      <Link to="/register" style={{ textDecoration: 'none' }}>
                        <Tag style={{ borderRadius: '12px' }}>注册</Tag>
                      </Link>
                      <Link to="/profile" style={{ textDecoration: 'none' }}>
                        <Tag style={{ borderRadius: '12px' }}>个人资料</Tag>
                      </Link>
                      <Link to="/my/orders" style={{ textDecoration: 'none' }}>
                        <Tag style={{ borderRadius: '12px' }}>我的订单</Tag>
                      </Link>
                      <Link to="/my/favorites" style={{ textDecoration: 'none' }}>
                        <Tag style={{ borderRadius: '12px' }}>我的收藏</Tag>
                      </Link>
                    </Space>
                  </div>
                  
                  <div className="sitemap-node">
                    <Link to="/help" style={{ textDecoration: 'none' }}>
                      <Tag color="#0DD8C8" style={{ 
                        padding: '6px 12px', 
                        fontSize: '14px',
                        borderRadius: '16px',
                        marginBottom: '20px'
                      }}>
                        <CustomerServiceOutlined /> 帮助支持
                      </Tag>
                    </Link>
                    <div style={{ 
                      width: '2px', 
                      height: '20px', 
                      background: '#e2e8f0',
                      margin: '0 auto 20px'
                    }}></div>
                    <Space direction="vertical" size={12} style={{ display: 'flex', alignItems: 'center' }}>
                      <Link to="/help" style={{ textDecoration: 'none' }}>
                        <Tag style={{ borderRadius: '12px' }}>帮助中心</Tag>
                      </Link>
                      <Link to="/terms" style={{ textDecoration: 'none' }}>
                        <Tag style={{ borderRadius: '12px' }}>服务条款</Tag>
                      </Link>
                      <Link to="/privacy" style={{ textDecoration: 'none' }}>
                        <Tag style={{ borderRadius: '12px' }}>隐私政策</Tag>
                      </Link>
                      <Link to="/sitemap" style={{ textDecoration: 'none' }}>
                        <Tag style={{ borderRadius: '12px' }}>网站地图</Tag>
                      </Link>
                    </Space>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sitemap; 