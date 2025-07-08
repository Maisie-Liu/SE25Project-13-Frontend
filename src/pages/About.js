import React from 'react';
import { Typography, Row, Col, Card, Divider, Avatar, Space, Button, Timeline, Image } from 'antd';
import { TeamOutlined, HistoryOutlined, AimOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined, GlobalOutlined } from '@ant-design/icons';
import './About.css';

const { Title, Paragraph, Text } = Typography;

const About = () => {
  const teamMembers = [
    {
      name: '张三',
      title: '创始人 & CEO',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=male&0',
      bio: '拥有多年互联网创业经验，曾创办多家校园服务平台。致力于用科技解决校园二手交易问题，让闲置资源发挥更大价值。'
    },
    {
      name: '李四',
      title: '技术总监',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=male&1',
      bio: '毕业于知名高校计算机专业，拥有丰富的全栈开发经验。精通React、Node.js和微服务架构，追求打造极致用户体验的产品。'
    },
    {
      name: '王五',
      title: '运营总监',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=female&2',
      bio: '擅长市场分析和用户增长，负责平台的日常运营和推广策略制定。热爱与用户沟通，不断收集反馈优化平台服务。'
    },
    {
      name: '赵六',
      title: '客户服务主管',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=female&3',
      bio: '拥有多年客服经验，致力于为用户提供专业、贴心的服务。负责平台用户投诉处理和纠纷解决，确保交易安全。'
    },
  ];

  return (
    <div className="about-container">
      <div className="about-hero">
        <div className="hero-content">
          <Title level={1} className="hero-title">关于我们</Title>
          <Paragraph className="hero-description">
            "交物通"是一个专注于校园二手交易的平台，致力于为广大师生提供安全、便捷、高效的物品交易服务。
          </Paragraph>
        </div>
      </div>

      <div className="about-section">
        <Row gutter={[32, 32]}>
          <Col xs={24} md={12}>
            <div className="mission-content">
              <Title level={2} className="section-title">
                <AimOutlined /> 我们的使命
              </Title>
              <Paragraph className="mission-text">
                让闲置物品流通起来，让校园生活更加便利。我们致力于为校园师生提供安全、便捷的二手物品交易平台，
                通过创新的技术和服务，解决校园二手交易中的痛点问题，创造绿色、环保、共享的校园生活方式。
              </Paragraph>
              <div className="mission-stats">
                <div className="stat-item">
                  <Title level={2}>10,000+</Title>
                  <Text>注册用户</Text>
                </div>
                <div className="stat-item">
                  <Title level={2}>50+</Title>
                  <Text>覆盖院校</Text>
                </div>
                <div className="stat-item">
                  <Title level={2}>5,000+</Title>
                  <Text>月交易量</Text>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="about-image">
              <Image 
                src="https://img.freepik.com/free-vector/team-work-concept-illustration_114360-678.jpg" 
                alt="我们的使命"
                preview={false}
                className="rounded-image"
              />
            </div>
          </Col>
        </Row>
      </div>

      <Divider className="fancy-divider" />

      <div className="about-section">
        <Title level={2} className="section-title text-center">
          <HistoryOutlined /> 我们的历程
        </Title>
        <Row justify="center">
          <Col xs={24} md={18} lg={16}>
            <Timeline mode="alternate" className="history-timeline">
              <Timeline.Item color="#00B8A9">
                <Card className="timeline-card">
                  <Title level={4}>2021年9月</Title>
                  <Paragraph>"交物通"项目立项，开始调研校园二手交易市场</Paragraph>
                </Card>
              </Timeline.Item>
              <Timeline.Item color="#00B8A9">
                <Card className="timeline-card">
                  <Title level={4}>2022年3月</Title>
                  <Paragraph>网站1.0版本上线，提供基本的二手物品交易功能</Paragraph>
                </Card>
              </Timeline.Item>
              <Timeline.Item color="#00B8A9">
                <Card className="timeline-card">
                  <Title level={4}>2022年9月</Title>
                  <Paragraph>移动端APP发布，用户可以随时随地交易物品</Paragraph>
                </Card>
              </Timeline.Item>
              <Timeline.Item color="#00B8A9">
                <Card className="timeline-card">
                  <Title level={4}>2023年1月</Title>
                  <Paragraph>引入第三方支付和担保交易，保障交易安全</Paragraph>
                </Card>
              </Timeline.Item>
              <Timeline.Item color="#00B8A9">
                <Card className="timeline-card">
                  <Title level={4}>2023年6月</Title>
                  <Paragraph>平台2.0版本上线，全面升级用户体验和交易流程</Paragraph>
                </Card>
              </Timeline.Item>
              <Timeline.Item color="#00B8A9">
                <Card className="timeline-card">
                  <Title level={4}>至今</Title>
                  <Paragraph>不断优化产品，为用户提供更好的校园二手交易服务</Paragraph>
                </Card>
              </Timeline.Item>
            </Timeline>
          </Col>
        </Row>
      </div>

      <Divider className="fancy-divider" />

      <div className="about-section team-section">
        <Title level={2} className="section-title text-center">
          <TeamOutlined /> 我们的团队
        </Title>
        <Paragraph className="text-center team-intro">
          我们拥有一支充满激情和创造力的团队，致力于为用户打造最佳的校园二手交易体验。
        </Paragraph>
        <Row gutter={[24, 24]} className="team-members">
          {teamMembers.map((member, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card className="team-card" hoverable>
                <div className="team-member">
                  <Avatar src={member.avatar} size={100} className="member-avatar" />
                  <Title level={4} className="member-name">{member.name}</Title>
                  <Text type="secondary" className="member-title">{member.title}</Text>
                  <Paragraph className="member-bio">{member.bio}</Paragraph>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Divider className="fancy-divider" />

      <div className="about-section contact-section">
        <Row gutter={[32, 32]}>
          <Col xs={24} md={12}>
            <Title level={2} className="section-title">
              联系我们
            </Title>
            <Paragraph>
              如果您有任何问题、建议或合作意向，欢迎随时联系我们。我们将在24小时内回复您的咨询。
            </Paragraph>
            <div className="contact-info">
              <Space direction="vertical" size="large">
                <div className="contact-item">
                  <EnvironmentOutlined className="contact-icon" />
                  <div>
                    <Text strong>地址</Text>
                    <Paragraph>北京市海淀区中关村大街1号</Paragraph>
                  </div>
                </div>
                <div className="contact-item">
                  <PhoneOutlined className="contact-icon" />
                  <div>
                    <Text strong>电话</Text>
                    <Paragraph>123-456-7890</Paragraph>
                  </div>
                </div>
                <div className="contact-item">
                  <MailOutlined className="contact-icon" />
                  <div>
                    <Text strong>邮箱</Text>
                    <Paragraph>contact@campus-trading.com</Paragraph>
                  </div>
                </div>
                <div className="contact-item">
                  <GlobalOutlined className="contact-icon" />
                  <div>
                    <Text strong>网站</Text>
                    <Paragraph>www.campus-trading.com</Paragraph>
                  </div>
                </div>
              </Space>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="about-image">
              <Image 
                src="https://img.freepik.com/free-vector/flat-design-illustration-customer-support_23-2148887720.jpg" 
                alt="联系我们"
                preview={false}
                className="rounded-image"
              />
            </div>
          </Col>
        </Row>
      </div>

      <div className="about-cta">
        <Title level={2} className="text-center">加入我们，让闲置流通起来</Title>
        <Paragraph className="text-center">
          无论您是想出售闲置物品，还是寻找心仪的二手商品，交物通都能满足您的需求。
        </Paragraph>
        <div className="cta-buttons">
          <Button type="primary" size="large" shape="round">立即注册</Button>
          <Button size="large" shape="round">了解更多</Button>
        </div>
      </div>
    </div>
  );
};

export default About; 