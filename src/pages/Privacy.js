import React from 'react';
import { Typography, Card, Divider, Space, Anchor, Row, Col, Badge, Tag } from 'antd';
import { 
  LockOutlined, 
  SecurityScanOutlined, 
  SafetyCertificateOutlined, 
  EyeOutlined, 
  SolutionOutlined, 
  GlobalOutlined, 
  StarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Paragraph, Text } = Typography;
const { Link } = Anchor;

// 自定义样式组件
const PrivacyHeader = styled.div`
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f7f5 100%);
  padding: 40px 20px;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 184, 169, 0.1);
`;

const PrivacyCard = styled(Card)`
  border-radius: 10px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 184, 169, 0.15);
    transform: translateY(-2px);
  }
  
  .ant-card-head {
    background: linear-gradient(to right, rgba(0, 184, 169, 0.05), transparent);
    border-bottom: 1px solid rgba(0, 184, 169, 0.1);
  }
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-color);
  opacity: 0.1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  
  .icon {
    font-size: 20px;
    color: var(--primary-color);
  }
  
  .title {
    font-size: 18px;
    font-weight: 600;
    margin-left: 12px;
  }
`;

const AnchorSidebar = styled.div`
  position: sticky;
  top: 24px;
  
  .ant-card {
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  
  .ant-anchor-link {
    padding: 7px 0 7px 16px;
    
    &:hover {
      background: rgba(0, 184, 169, 0.05);
      border-radius: 4px;
    }
  }
  
  .ant-anchor-link-active {
    background: rgba(0, 184, 169, 0.1);
    border-radius: 4px;
    
    .ant-anchor-link-title {
      color: var(--primary-color);
      font-weight: 500;
    }
  }
`;

const HighlightBox = styled.div`
  background: ${props => props.type === 'warning' ? 'rgba(250, 173, 20, 0.1)' : 'rgba(0, 184, 169, 0.05)'};
  border-left: 4px solid ${props => props.type === 'warning' ? '#faad14' : 'var(--primary-color)'};
  padding: 12px 16px;
  border-radius: 4px;
  margin: 16px 0;
`;

const ContactCard = styled(Card)`
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f7f5 100%);
  border: none;
  border-radius: 10px;
  
  .contact-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    
    .icon {
      color: var(--primary-color);
      margin-right: 10px;
      font-size: 16px;
    }
  }
`;

const Privacy = () => {
  return (
    <div className="privacy-page container" style={{ padding: '24px 0 40px' }}>
      <PrivacyHeader>
        <Badge count="重要" offset={[0, 10]} style={{ backgroundColor: 'var(--primary-color)' }}>
          <LockOutlined style={{ fontSize: 48, color: 'var(--primary-color)', marginBottom: 16 }} />
        </Badge>
        <Title level={2} style={{ margin: '16px 0' }}>隐私政策</Title>
        <Text style={{ fontSize: 16 }}>我们重视您的隐私，并致力于保护您的个人信息</Text>
        <div style={{ marginTop: 12 }}>
        <Text type="secondary">最后更新：{new Date().toLocaleDateString('zh-CN')}</Text>
      </div>
      </PrivacyHeader>
      
      <Row gutter={24}>
        <Col xs={24} md={7} lg={6}>
          <AnchorSidebar>
            <Card title="目录导航" size="small">
              <Anchor offsetTop={80} targetOffset={80}>
              <Link href="#introduction" title="1. 引言" />
              <Link href="#information" title="2. 信息收集" />
              <Link href="#usage" title="3. 信息使用" />
              <Link href="#sharing" title="4. 信息共享" />
              <Link href="#protection" title="5. 信息保护" />
              <Link href="#cookies" title="6. Cookie使用" />
                <Link href="#reputation" title="7. 信誉分系统" />
                <Link href="#rights" title="8. 用户权利" />
                <Link href="#children" title="9. 未成年人保护" />
                <Link href="#changes" title="10. 政策变更" />
                <Link href="#contact" title="11. 联系我们" />
            </Anchor>
          </Card>
            
            <Card style={{ marginTop: 16 }} bodyStyle={{ padding: 16 }}>
              <HighlightBox>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <ExclamationCircleOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} />
                  <Text strong>重要提示</Text>
        </div>
                <Text>使用我们的服务即表示您同意本隐私政策的条款。如有疑问，请联系我们的客服团队。</Text>
              </HighlightBox>
            </Card>
          </AnchorSidebar>
        </Col>
        
        <Col xs={24} md={17} lg={18}>
          <PrivacyCard id="introduction">
            <Title level={3}>1. 引言</Title>
            <Divider style={{ margin: '12px 0 20px' }} />
            
            <SectionTitle>
              <IconWrapper>
                <LockOutlined className="icon" />
              </IconWrapper>
              <span className="title">隐私保障承诺</span>
            </SectionTitle>
            
            <Paragraph style={{ marginLeft: 24 }}>
              1.1 交物通（"我们"、"平台"）重视您的隐私，并致力于保护您的个人信息。本隐私政策旨在说明我们如何收集、使用、共享和保护您的信息。
            </Paragraph>
            <Paragraph style={{ marginLeft: 24 }}>
              1.2 使用我们的服务即表示您同意本隐私政策的条款。如果您不同意本政策，请勿使用我们的服务。
            </Paragraph>
            <Paragraph style={{ marginLeft: 24 }}>
              1.3 本政策适用于交物通平台提供的所有服务，包括网站和移动应用程序。
            </Paragraph>
            
            <HighlightBox>
              <CheckCircleOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} />
              <Text>我们承诺以透明的方式处理您的个人信息，并让您了解我们如何使用这些信息。</Text>
            </HighlightBox>
          </PrivacyCard>
          
          <PrivacyCard id="information">
            <Title level={3}>2. 信息收集</Title>
            <Divider style={{ margin: '12px 0 20px' }} />
            
            <SectionTitle>
              <IconWrapper>
                <SecurityScanOutlined className="icon" />
              </IconWrapper>
              <span className="title">个人信息</span>
            </SectionTitle>
            
            <Paragraph style={{ marginLeft: 24 }}>
              2.1 我们可能会收集您直接提供给我们的信息，包括但不限于：
              <ul>
                <li>个人身份信息：姓名、电子邮件地址、手机号码、学校信息等</li>
                <li>账户信息：用户名、密码（加密存储）</li>
                <li>交易信息：发布的物品信息、订单信息等</li>
                <li>用户内容：评论、评价、消息等</li>
                <li>用户行为：交易记录、信誉评分等</li>
              </ul>
            </Paragraph>
            
            <SectionTitle>
              <IconWrapper>
                <SafetyCertificateOutlined className="icon" />
              </IconWrapper>
              <span className="title">自动收集的信息</span>
            </SectionTitle>
            
            <Paragraph style={{ marginLeft: 24 }}>
              2.2 当您使用我们的服务时，我们可能会自动收集某些信息，包括但不限于：
              <ul>
                <li>设备信息：设备类型、操作系统、浏览器类型等</li>
                <li>日志信息：IP地址、访问时间、浏览记录等</li>
                <li>位置信息：您的大致位置（如果您授权）</li>
                <li>Cookie和类似技术收集的信息</li>
              </ul>
            </Paragraph>
          </PrivacyCard>
          
          <PrivacyCard id="usage">
            <Title level={3}>3. 信息使用</Title>
            <Divider style={{ margin: '12px 0 20px' }} />
            
            <SectionTitle>
              <IconWrapper>
                <EyeOutlined className="icon" />
              </IconWrapper>
              <span className="title">服务提供</span>
            </SectionTitle>
            
            <Paragraph style={{ marginLeft: 24 }}>
              3.1 我们使用收集的信息来：
              <ul>
                <li>提供、维护和改进我们的服务</li>
                <li>处理和记录交易</li>
                <li>验证用户身份和防止欺诈</li>
                <li>计算和维护用户信誉分</li>
                <li>与您沟通并提供客户支持</li>
                <li>向您发送服务通知和更新</li>
              </ul>
            </Paragraph>
            
            <SectionTitle>
              <IconWrapper>
                <EyeOutlined className="icon" />
              </IconWrapper>
              <span className="title">服务优化</span>
            </SectionTitle>
            
            <Paragraph style={{ marginLeft: 24 }}>
              3.2 我们也可能使用您的信息来：
              <ul>
                <li>分析和监控服务使用情况</li>
                <li>开发新功能和服务</li>
                <li>为您提供个性化推荐和内容</li>
                <li>进行调查和研究以改进用户体验</li>
              </ul>
            </Paragraph>
          </PrivacyCard>
          
          <PrivacyCard id="sharing">
            <Title level={3}>4. 信息共享</Title>
            <Divider style={{ margin: '12px 0 20px' }} />
            
            <SectionTitle>
              <IconWrapper>
                <GlobalOutlined className="icon" />
              </IconWrapper>
              <span className="title">与第三方共享</span>
            </SectionTitle>
            
            <Paragraph style={{ marginLeft: 24 }}>
              4.1 我们不会出售您的个人信息。我们可能在以下情况下共享您的信息：
              <ul>
                <li>经您明确同意</li>
                <li>与交易相关方共享必要的信息以促成交易</li>
                <li>与提供技术或分析服务的服务提供商共享，这些提供商有义务保护您的信息</li>
                <li>在法律要求或为保护权利的情况下</li>
              </ul>
            </Paragraph>
            
            <SectionTitle>
              <IconWrapper>
                <GlobalOutlined className="icon" />
              </IconWrapper>
              <span className="title">匿名数据</span>
            </SectionTitle>
            
            <Paragraph style={{ marginLeft: 24 }}>
              4.2 我们可能会共享匿名或汇总的用户数据（不包含个人身份信息），用于分析、改进服务或其他商业目的。
            </Paragraph>
            
            <HighlightBox type="warning">
              <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />
              <Text>请注意，一旦您选择在平台上公开分享您的个人信息（如在物品描述中），该信息可能被其他用户访问。</Text>
            </HighlightBox>
          </PrivacyCard>
          
          <PrivacyCard id="protection">
            <Title level={3}>5. 信息保护</Title>
            <Divider style={{ margin: '12px 0 20px' }} />
            
            <SectionTitle>
              <IconWrapper>
                <LockOutlined className="icon" />
              </IconWrapper>
              <span className="title">安全措施</span>
            </SectionTitle>
            
            <Paragraph style={{ marginLeft: 24 }}>
              5.1 我们采取各种安全技术和程序来保护您的个人信息，防止未经授权的访问、使用或披露，包括但不限于：
              <ul>
                <li>使用加密技术保护数据传输和存储</li>
                <li>实施访问控制机制</li>
                <li>定期审查和更新安全措施</li>
              </ul>
            </Paragraph>
            
            <SectionTitle>
              <IconWrapper>
                <LockOutlined className="icon" />
              </IconWrapper>
              <span className="title">数据保留</span>
            </SectionTitle>
            
            <Paragraph style={{ marginLeft: 24 }}>
              5.2 我们会在必要的时间内保留您的个人信息，以实现本政策中描述的目的，除非法律要求或允许更长的保留期限。
            </Paragraph>
          </PrivacyCard>
          
          <PrivacyCard id="cookies">
            <Title level={3}>6. Cookie使用</Title>
            <Divider style={{ margin: '12px 0 20px' }} />
            
            <Paragraph style={{ marginLeft: 24 }}>
              6.1 我们使用Cookie和类似技术来收集和存储信息，以提供更好的用户体验，包括：
              <ul>
                <li>记住您的登录状态</li>
                <li>了解和保存您的偏好设置</li>
                <li>分析网站流量和性能</li>
                <li>优化内容推荐</li>
              </ul>
            </Paragraph>
            
            <Paragraph style={{ marginLeft: 24 }}>
              6.2 您可以通过浏览器设置控制和删除Cookie，但这可能会影响某些功能的可用性。
            </Paragraph>
          </PrivacyCard>
          
          <PrivacyCard id="reputation">
            <Title level={3}>7. 信誉分系统</Title>
            <Divider style={{ margin: '12px 0 20px' }} />
            
            <SectionTitle>
              <IconWrapper>
                <StarOutlined className="icon" />
              </IconWrapper>
              <span className="title">信誉分收集与计算</span>
            </SectionTitle>
            
            <Paragraph style={{ marginLeft: 24 }}>
              7.1 我们会收集与您的交易行为相关的数据，用于计算信誉分，包括：
              <ul>
                <li>交易完成率：成功完成的交易比例</li>
                <li>用户评价：其他用户给予的评分（1-5星）</li>
                <li>平台活跃度：定期登录和使用平台</li>
                <li>违规行为：违反平台规则会扣减信誉分</li>
                <li>账户历史：账户使用时长和交易历史</li>
              </ul>
            </Paragraph>
            
            <SectionTitle>
              <IconWrapper>
                <StarOutlined className="icon" />
              </IconWrapper>
              <span className="title">信誉分展示</span>
            </SectionTitle>
            
            <Paragraph style={{ marginLeft: 24 }}>
              7.2 您的信誉分将在以下场景中对其他用户可见：
              <ul>
                <li>您的个人公开资料页面</li>
                <li>您发布的物品详情页面</li>
                <li>交易洽谈过程中</li>
              </ul>
              这有助于其他用户评估与您交易的可信度。
            </Paragraph>
            
            <Paragraph style={{ marginLeft: 24 }}>
              7.3 我们会采取措施确保信誉分系统的公平性，并提供申诉机制，让您可以对不公正的评价提出异议。
            </Paragraph>
            
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', background: 'rgba(0, 184, 169, 0.05)', borderRadius: 8 }}>
                <Tag color="green">优秀</Tag>
                <div style={{ margin: '0 8px', width: 100, height: 8, background: '#f0f0f0', borderRadius: 4 }}>
                  <div style={{ width: '90%', height: '100%', background: 'linear-gradient(90deg, #52c41a, #52c41a)', borderRadius: 4 }}></div>
                </div>
                <Text style={{ marginLeft: 8 }}>130-150分</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', background: 'rgba(0, 184, 169, 0.05)', borderRadius: 8, marginLeft: 16 }}>
                <Tag color="orange">警告</Tag>
                <div style={{ margin: '0 8px', width: 100, height: 8, background: '#f0f0f0', borderRadius: 4 }}>
                  <div style={{ width: '30%', height: '100%', background: 'linear-gradient(90deg, #faad14, #faad14)', borderRadius: 4 }}></div>
                </div>
                <Text style={{ marginLeft: 8 }}>30-60分</Text>
              </div>
            </div>
          </PrivacyCard>
          
          <PrivacyCard id="rights">
            <Title level={3}>8. 用户权利</Title>
            <Divider style={{ margin: '12px 0 20px' }} />
            
            <SectionTitle>
              <IconWrapper>
                <SolutionOutlined className="icon" />
              </IconWrapper>
              <span className="title">管理个人信息</span>
            </SectionTitle>
            
            <Paragraph style={{ marginLeft: 24 }}>
              8.1 您有权：
              <ul>
                <li>访问和查看您的个人信息</li>
                <li>更正不准确或不完整的信息</li>
                <li>删除您的账户和相关信息（受法律和合理业务要求限制）</li>
                <li>限制或反对某些信息处理</li>
                <li>将您的信息导出（在技术可行的情况下）</li>
                <li>查看您的信誉分计算依据并申请复核</li>
              </ul>
            </Paragraph>
            
            <Paragraph style={{ marginLeft: 24 }}>
              8.2 您可以通过账户设置或联系我们的客服团队行使这些权利。
            </Paragraph>
            
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Card size="small" title="如何查看我的数据" extra={<QuestionCircleOutlined />}>
                  <Text>登录账户 → 个人中心 → 账户安全 → 我的数据</Text>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="如何删除账户" extra={<QuestionCircleOutlined />}>
                  <Text>登录账户 → 个人中心 → 账户安全 → 注销账户</Text>
          </Card>
              </Col>
            </Row>
          </PrivacyCard>
          
          <PrivacyCard id="children">
            <Title level={3}>9. 未成年人保护</Title>
            <Divider style={{ margin: '12px 0 20px' }} />
            
            <Paragraph style={{ marginLeft: 24 }}>
              9.1 我们的服务不面向16岁以下的儿童。我们不会故意收集16岁以下儿童的个人信息。
            </Paragraph>
            
            <Paragraph style={{ marginLeft: 24 }}>
              9.2 如果我们得知已收集了16岁以下儿童的个人信息，我们会采取合理措施尽快删除此类信息。
            </Paragraph>
            
            <HighlightBox>
              <ExclamationCircleOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} />
              <Text>如果您是父母或监护人，发现您的孩子未经您同意向我们提供了个人信息，请联系我们删除相关信息。</Text>
            </HighlightBox>
          </PrivacyCard>
          
          <PrivacyCard id="changes">
            <Title level={3}>10. 政策变更</Title>
            <Divider style={{ margin: '12px 0 20px' }} />
            
            <Paragraph style={{ marginLeft: 24 }}>
              10.1 我们可能会不时更新本隐私政策。如有重大变更，我们会通过在网站上发布通知或向您发送电子邮件等方式通知您。
            </Paragraph>
            
            <Paragraph style={{ marginLeft: 24 }}>
              10.2 我们鼓励您定期查看本政策，以了解我们如何保护您的信息。
            </Paragraph>
            
            <div style={{ background: 'rgba(0, 184, 169, 0.05)', padding: '12px 16px', borderRadius: 8, marginTop: 16 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Text strong>上次更新</Text>
                  <div>{new Date().toLocaleDateString('zh-CN')}</div>
                </Col>
                <Col span={8}>
                  <Text strong>生效日期</Text>
                  <div>{new Date().toLocaleDateString('zh-CN')}</div>
                </Col>
                <Col span={8}>
                  <Text strong>版本</Text>
                  <div>V1.0</div>
                </Col>
              </Row>
            </div>
          </PrivacyCard>
          
          <PrivacyCard id="contact">
            <Title level={3}>11. 联系我们</Title>
            <Divider style={{ margin: '12px 0 20px' }} />
            
            <Paragraph style={{ marginLeft: 24 }}>
              11.1 如果您对本隐私政策有任何问题、意见或投诉，请联系我们：
            </Paragraph>
            
            <ContactCard bordered={false} style={{ marginTop: 16, marginBottom: 16 }}>
              <div className="contact-item">
                <MailOutlined className="icon" />
                <Text>电子邮件：privacy@campus-trading.com</Text>
              </div>
              <div className="contact-item">
                <PhoneOutlined className="icon" />
                <Text>电话：123-456-7890</Text>
              </div>
              <div className="contact-item">
                <EnvironmentOutlined className="icon" />
                <Text>地址：校园交易平台隐私办公室</Text>
              </div>
            </ContactCard>
            
            <Paragraph style={{ marginLeft: 24 }}>
              11.2 我们会在收到您的请求后30天内回复。
            </Paragraph>
          </PrivacyCard>
        </Col>
      </Row>
    </div>
  );
};

export default Privacy; 