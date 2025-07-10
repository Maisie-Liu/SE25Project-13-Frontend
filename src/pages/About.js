import React from 'react';
import { Typography, Row, Col, Card, Divider, Avatar, Space, Button, Timeline, Image, Steps } from 'antd';
import { TeamOutlined, HistoryOutlined, AimOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined, GlobalOutlined } from '@ant-design/icons';
import './About.css';

const { Title, Paragraph, Text } = Typography;

const About = () => {
  const teamMembers = [
    {
      name: '00',
      title: '团队负责人',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=male&0',
      bio: '软件工程专业大二学生，热爱编程，擅长项目管理和系统架构设计'
    },
    {
      name: '小羊',
      title: '后端开发',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=male&1',
      bio: '软件工程专业大二学生，Java与Python全栈工程师，喜欢挑战未知技术领域。善于将新技术应用到实际项目中，对微服务架构和云原生开发有独特见解，是团队中的技术探索者。'
    },
    {
      name: '痛痛',
      title: '后端开发',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=female&2',
      bio: '软件工程专业大二学生，后端技术专家，擅长数据库设计和API开发。'
    },
    {
      name: 'xiaote',
      title: '前端开发',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=female&3',
      bio: '软件工程专业大二学生，React狂热爱好者，对UI/UX设计有独特见解。课余时间喜欢参加各类编程竞赛，梦想是开发出让用户眼前一亮的应用。'
    },
  ];

  const timelineItems = [
    {
      title: '6.22',
      description: '项目组成立'
    },
    {
      title: '6.28',
      description: '呈现界面原型'
    },
    {
      title: '7.10',
      description: '呈现技术原型'
    },
    {
      title: '7.18',
      description: '给出最终成型版本'
    }
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
        <div className="history-timeline-horizontal">
          <Steps 
            current={3} 
            progressDot 
            className="horizontal-timeline"
            items={timelineItems.map(item => ({
              title: item.title,
              description: item.description
            }))}
          />
        </div>
      </div>

      <Divider className="fancy-divider" />

      <div className="about-section team-section">
        <Title level={2} className="section-title text-center">
          <TeamOutlined /> 我们的团队
        </Title>
        <Paragraph className="text-center team-intro">
          我们是一支来自校园的年轻团队，充满热情和创意，致力于用技术解决校园二手交易的痛点。
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