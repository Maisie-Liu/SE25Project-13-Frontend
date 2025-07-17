import React from 'react';
import { Typography, Card, Row, Col, Divider, Tag, Space, Breadcrumb, Alert, Badge, Button } from 'antd';
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
  InfoCircleOutlined,
  EnvironmentOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
  StarOutlined,
  CompassOutlined,
  RocketOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const { Title, Text, Paragraph } = Typography;

// 自定义标题组件，使用"Ma Shan Zheng"字体
const BrandTitle = styled.span`
  font-family: 'Ma Shan Zheng', cursive;
  font-size: 42px;
  color: #00B8A9;
  margin: 0;
  position: relative;
  display: inline-block;
  text-shadow: 0 2px 4px rgba(0, 184, 169, 0.2);
`;

// 自定义链接组件
const SitemapLink = styled(Link)`
  text-decoration: none;
  display: block;
  transition: all 0.3s;
  
  &:hover .sitemap-card {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 184, 169, 0.15);
  }
`;

const SitemapCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 10px;
  transition: all 0.3s;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  
  .ant-card-body {
    padding: 14px 16px;
  }
  
  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: rgba(0, 184, 169, 0.1);
    margin-right: 12px;
    
    .icon {
      font-size: 20px;
      color: var(--primary-color);
    }
  }
  
  .content {
    flex: 1;
    
    .title {
      font-size: 15px;
      font-weight: 500;
      color: #2d3748;
      margin-bottom: 2px;
    }
    
    .description {
      font-size: 12px;
      color: #718096;
    }
  }
`;

// 自定义小节组件
const SitemapSection = styled.div`
  margin-bottom: 32px;
  
  .section-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    
    .icon-container {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: linear-gradient(135deg, #00B8A9, #0DD8C8);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      box-shadow: 0 4px 10px rgba(0, 184, 169, 0.2);
      
      .icon {
        color: #fff;
        font-size: 18px;
      }
    }
    
    .title {
      font-size: 20px;
      font-weight: 600;
      color: #2d3748;
      margin: 0;
    }
  }
`;

const SitemapTag = styled(Tag)`
  margin-bottom: 8px;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 13px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
  
  transition: all 0.2s ease;
`;

// 创建网站地图导航组件，将同类链接组合在一起，带有标题和图标
const SitemapNavGroup = styled.div`
  margin-bottom: 24px;
  
  .group-title {
    font-size: 14px;
    font-weight: 600;
    display: block;
    margin-bottom: 10px;
    color: #4a5568;
  }
`;

// 网站地图头部背景
const SitemapHeader = styled.div`
  background: linear-gradient(145deg, #f0f7ff, #e6f7f5);
  border-radius: 16px;
  padding: 40px 30px;
  margin-bottom: 40px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 184, 169, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -10%;
    right: -10%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(0, 184, 169, 0.05) 0%, rgba(255, 255, 255, 0) 70%);
    border-radius: 50%;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10%;
    left: -10%;
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, rgba(0, 184, 169, 0.05) 0%, rgba(255, 255, 255, 0) 70%);
    border-radius: 50%;
  }
`;

// 网站结构可视化图
const SitemapVisual = styled.div`
  background: #fff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  min-width: 600px;
  position: relative;
  
  .main-node {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .node-tag {
    padding: 8px 16px;
    font-size: 16px;
    border-radius: 20px;
    margin-bottom: 30px;
    box-shadow: 0 2px 8px rgba(0, 184, 169, 0.2);
    display: flex;
    align-items: center;
    
    .icon {
      margin-right: 6px;
    }
  }
  
  .connector {
    width: 2px;
    height: 30px;
    background: #e2e8f0;
    margin-bottom: 30px;
  }
  
  .nodes-container {
    display: flex;
    justify-content: center;
    gap: 50px;
    flex-wrap: wrap;
  }
  
  .sub-node {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .sub-node-tag {
      padding: 6px 12px;
      font-size: 14px;
      border-radius: 16px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      
      .icon {
        margin-right: 6px;
      }
    }
    
    .sub-connector {
      width: 2px;
      height: 20px;
      background: #e2e8f0;
      margin: 0 auto 20px;
    }
    
    .leaf-nodes {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .leaf-tag {
        margin-bottom: 8px;
        border-radius: 12px;
        transition: all 0.2s;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
`;

// 快速导航卡片
const QuickNavCard = styled(Card)`
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  .ant-card-head {
    border-bottom: 1px solid rgba(0, 184, 169, 0.1);
    
    .ant-card-head-title {
      display: flex;
      align-items: center;
      
      .icon {
        color: var(--primary-color);
        margin-right: 8px;
        font-size: 18px;
      }
    }
  }
`;

const SitemapComponent = ({ title, icon, children }) => (
  <SitemapSection>
    <div className="section-header">
      <div className="icon-container">
        <span className="icon">{icon}</span>
      </div>
      <h3 className="title">{title}</h3>
    </div>
    {children}
  </SitemapSection>
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
        { icon: <SafetyCertificateOutlined />, title: '信誉评分', description: '查看我的信誉评分', to: '/profile' },
      ]
    },
    {
      title: '订单管理',
      icon: <OrderedListOutlined />,
      items: [
        { icon: <OrderedListOutlined />, title: '我的订单', description: '查看我的所有订单', to: '/my/orders' },
        { icon: <OrderedListOutlined />, title: '订单管理', description: '管理订单状态', to: '/orders/manage' },
        { icon: <StarOutlined />, title: '评价管理', description: '管理我的评价', to: '/my/ratings' },
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
      title: '求购论坛',
      icon: <TeamOutlined />,
      items: [
        { icon: <TeamOutlined />, title: '求购论坛', description: '浏览所有求购请求', to: '/requests' },
        { icon: <FileTextOutlined />, title: '发布求购', description: '发布新的求购请求', to: '/requests/publish' },
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
        { icon: <SafetyCertificateOutlined />, title: '信誉分指南', description: '了解信誉分系统', to: '/help#reputation' },
      ]
    },
  ];

  // 快速导航数据 - 新增的快速导航组件
  const quickNavData = [
    {
      title: '主要功能',
      links: [
        { title: '首页', to: '/', icon: <HomeOutlined />, color: 'blue' },
        { title: '全部商品', to: '/items', icon: <ShopOutlined />, color: 'green' },
        { title: '发布物品', to: '/items/publish', icon: <PlusOutlined />, color: 'volcano' },
        { title: '求购论坛', to: '/requests', icon: <TeamOutlined />, color: 'purple' },
      ]
    },
    {
      title: '用户中心',
      links: [
        { title: '登录', to: '/login', icon: <UserOutlined />, color: 'cyan' },
        { title: '注册', to: '/register', icon: <UserOutlined />, color: 'geekblue' },
        { title: '个人资料', to: '/profile', icon: <UserOutlined />, color: 'magenta' },
        { title: '我的订单', to: '/my/orders', icon: <OrderedListOutlined />, color: 'gold' },
        { title: '我的物品', to: '/my/items', icon: <ShopOutlined />, color: 'lime' },
        { title: '信誉评分', to: '/profile', icon: <SafetyCertificateOutlined />, color: 'orange' },
      ]
    },
    {
      title: '帮助与支持',
      links: [
        { title: '帮助中心', to: '/help', icon: <QuestionCircleOutlined />, color: 'orange' },
        { title: '关于我们', to: '/about', icon: <InfoCircleOutlined />, color: 'geekblue' },
        { title: '服务条款', to: '/terms', icon: <FileTextOutlined />, color: 'purple' },
        { title: '隐私政策', to: '/privacy', icon: <LockOutlined />, color: 'red' },
      ]
    },
  ];

  return (
    <div className="sitemap-page container">
      {/* 面包屑导航 */}
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>
          <Link to="/"><HomeOutlined /> 首页</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <GlobalOutlined /> 网站地图
        </Breadcrumb.Item>
      </Breadcrumb>
      
      {/* 标题部分 */}
      <SitemapHeader>
        <Badge count="NEW" offset={[10, 10]} style={{ backgroundColor: 'var(--primary-color)' }}>
          <CompassOutlined style={{ fontSize: 48, color: 'var(--primary-color)', marginBottom: 16 }} />
        </Badge>
        <div style={{ marginBottom: 15 }}>
          <BrandTitle>网站地图</BrandTitle>
        </div>
        <Text style={{ fontSize: 16, color: '#718096' }}>浏览交物通平台所有页面，快速找到您需要的功能</Text>
        
        {/* 快速导航部分 */}
        <div style={{ maxWidth: '900px', margin: '30px auto 0', textAlign: 'left' }}>
          <QuickNavCard
            title={
              <>
                <RocketOutlined className="icon" /> 快速导航
              </>
            }
            bordered={false}
          >
            <Row gutter={[24, 16]}>
              {quickNavData.map((group, index) => (
                <Col xs={24} md={8} key={index}>
                  <SitemapNavGroup>
                    <Text className="group-title">{group.title}</Text>
                    <Space wrap>
                      {group.links.map((link, linkIndex) => (
                        <SitemapTag color={link.color} key={linkIndex}>
                          <Link to={link.to} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {link.icon && <span style={{ marginRight: '4px' }}>{link.icon}</span>}
                            {link.title}
                          </Link>
                        </SitemapTag>
                      ))}
                    </Space>
                  </SitemapNavGroup>
                </Col>
              ))}
            </Row>
          </QuickNavCard>
      </div>
      </SitemapHeader>

      {/* 主内容 */}
      <div className="sitemap-content">
        <Row gutter={[32, 32]}>
          {sitemapData.map((section, index) => (
            <Col xs={24} sm={24} md={12} lg={8} key={index}>
              <SitemapComponent title={section.title} icon={section.icon}>
                {section.items.map((item, itemIndex) => (
                  <SitemapLink to={item.to} key={itemIndex}>
                    <SitemapCard className="sitemap-card" hoverable size="small">
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="icon-wrapper">
                          <span className="icon">{item.icon}</span>
                        </div>
                        <div className="content">
                          <div className="title">{item.title}</div>
                          {item.description && <div className="description">{item.description}</div>}
                        </div>
                      </div>
                    </SitemapCard>
                  </SitemapLink>
                ))}
              </SitemapComponent>
            </Col>
          ))}
        </Row>

        <Divider style={{ margin: '50px 0' }}>
          <Space>
            <GlobalOutlined />
            <span style={{ fontSize: 16, fontWeight: 500 }}>网站结构可视化</span>
          </Space>
        </Divider>
          
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', overflow: 'auto', marginBottom: 40 }}>
          <SitemapVisual>
              {/* 主节点 */}
            <div className="main-node">
                <Link to="/" style={{ textDecoration: 'none' }}>
                <Tag color="var(--primary-color)" className="node-tag">
                  <HomeOutlined className="icon" /> 首页
                  </Tag>
                </Link>
                
                {/* 连接线 */}
              <div className="connector"></div>
                
                {/* 一级节点 */}
              <div className="nodes-container">
                <div className="sub-node">
                    <Link to="/items" style={{ textDecoration: 'none' }}>
                    <Tag color="#0DD8C8" className="sub-node-tag">
                      <ShopOutlined className="icon" /> 物品浏览
                      </Tag>
                    </Link>
                  <div className="sub-connector"></div>
                  <div className="leaf-nodes">
                      <Link to="/items/:id" style={{ textDecoration: 'none' }}>
                      <Tag className="leaf-tag">物品详情</Tag>
                      </Link>
                      <Link to="/items/publish" style={{ textDecoration: 'none' }}>
                      <Tag className="leaf-tag">发布物品</Tag>
                      </Link>
                      <Link to="/items/edit/:id" style={{ textDecoration: 'none' }}>
                      <Tag className="leaf-tag">编辑物品</Tag>
                      </Link>
                  </div>
                  </div>
                  
                <div className="sub-node">
                    <Link to="/profile" style={{ textDecoration: 'none' }}>
                    <Tag color="#0DD8C8" className="sub-node-tag">
                      <UserOutlined className="icon" /> 用户中心
                      </Tag>
                    </Link>
                  <div className="sub-connector"></div>
                  <div className="leaf-nodes">
                      <Link to="/login" style={{ textDecoration: 'none' }}>
                      <Tag className="leaf-tag">登录</Tag>
                      </Link>
                      <Link to="/register" style={{ textDecoration: 'none' }}>
                      <Tag className="leaf-tag">注册</Tag>
                      </Link>
                      <Link to="/profile" style={{ textDecoration: 'none' }}>
                      <Tag className="leaf-tag">个人资料</Tag>
                      </Link>
                      <Link to="/my/orders" style={{ textDecoration: 'none' }}>
                      <Tag className="leaf-tag">我的订单</Tag>
                      </Link>
                      <Link to="/my/favorites" style={{ textDecoration: 'none' }}>
                      <Tag className="leaf-tag">我的收藏</Tag>
                    </Link>
                    <Link to="/profile" style={{ textDecoration: 'none' }}>
                      <Tag className="leaf-tag">信誉评分</Tag>
                      </Link>
                  </div>
                  </div>
                  
                <div className="sub-node">
                  <Link to="/help" style={{ textDecoration: 'none' }}>
                    <Tag color="#0DD8C8" className="sub-node-tag">
                      <CustomerServiceOutlined className="icon" /> 帮助支持
                    </Tag>
                  </Link>
                  <div className="sub-connector"></div>
                  <div className="leaf-nodes">
                    <Link to="/help" style={{ textDecoration: 'none' }}>
                      <Tag className="leaf-tag">帮助中心</Tag>
                      </Link>
                      <Link to="/terms" style={{ textDecoration: 'none' }}>
                      <Tag className="leaf-tag">服务条款</Tag>
                      </Link>
                      <Link to="/privacy" style={{ textDecoration: 'none' }}>
                      <Tag className="leaf-tag">隐私政策</Tag>
                      </Link>
                      <Link to="/sitemap" style={{ textDecoration: 'none' }}>
                      <Tag className="leaf-tag">网站地图</Tag>
                    </Link>
                    <Link to="/help#reputation" style={{ textDecoration: 'none' }}>
                      <Tag className="leaf-tag">信誉分指南</Tag>
                      </Link>
                  </div>
                </div>
              </div>
            </div>
          </SitemapVisual>
        </div>
        
        <Alert
          message="找不到您需要的页面？"
          description="如果您在网站地图中没有找到您需要的页面或功能，请联系我们的客服团队获取帮助。"
          type="info"
          showIcon
          action={
            <Link to="/help#contact">
              <Button size="small" type="primary">
                联系客服
              </Button>
            </Link>
          }
          style={{ marginBottom: 40, borderRadius: 8 }}
        />
      </div>
    </div>
  );
};

export default Sitemap; 