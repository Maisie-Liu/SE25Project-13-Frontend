import React from 'react';
import { Typography, Card, Divider, Space, Anchor } from 'antd';
import { LockOutlined, SecurityScanOutlined, SafetyCertificateOutlined, EyeOutlined, SolutionOutlined, GlobalOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Link } = Anchor;

const Privacy = () => {
  return (
    <div className="privacy-page">
      <div style={{ textAlign: 'center', margin: '24px 0' }}>
        <Title level={2}>隐私政策</Title>
        <Text type="secondary">最后更新：{new Date().toLocaleDateString('zh-CN')}</Text>
      </div>
      
      <div className="privacy-content" style={{ display: 'flex', gap: '24px' }}>
        <div style={{ width: 200, position: 'sticky', top: 24 }}>
          <Card>
            <Anchor offsetTop={80}>
              <Link href="#introduction" title="1. 引言" />
              <Link href="#information" title="2. 信息收集" />
              <Link href="#usage" title="3. 信息使用" />
              <Link href="#sharing" title="4. 信息共享" />
              <Link href="#protection" title="5. 信息保护" />
              <Link href="#cookies" title="6. Cookie使用" />
              <Link href="#rights" title="7. 用户权利" />
              <Link href="#children" title="8. 未成年人保护" />
              <Link href="#changes" title="9. 政策变更" />
              <Link href="#contact" title="10. 联系我们" />
            </Anchor>
          </Card>
        </div>
        
        <div style={{ flex: 1 }}>
          <Card id="introduction">
            <Title level={3}>1. 引言</Title>
            <Divider />
            <Paragraph>
              <LockOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} />
              <Text strong>隐私保障承诺</Text>
            </Paragraph>
            <Paragraph style={{ marginLeft: 24 }}>
              1.1 交物通（"我们"、"平台"）重视您的隐私，并致力于保护您的个人信息。本隐私政策旨在说明我们如何收集、使用、共享和保护您的信息。
            </Paragraph>
            <Paragraph style={{ marginLeft: 24 }}>
              1.2 使用我们的服务即表示您同意本隐私政策的条款。如果您不同意本政策，请勿使用我们的服务。
            </Paragraph>
            <Paragraph style={{ marginLeft: 24 }}>
              1.3 本政策适用于交物通平台提供的所有服务，包括网站和移动应用程序。
            </Paragraph>
          </Card>
          
          <Card id="information" style={{ marginTop: 24 }}>
            <Title level={3}>2. 信息收集</Title>
            <Divider />
            <Paragraph>
              <SecurityScanOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} />
              <Text strong>个人信息</Text>
            </Paragraph>
            <Paragraph style={{ marginLeft: 24 }}>
              2.1 我们可能会收集您直接提供给我们的信息，包括但不限于：
              <ul>
                <li>个人身份信息：姓名、电子邮件地址、手机号码、学校信息等</li>
                <li>账户信息：用户名、密码（加密存储）</li>
                <li>交易信息：发布的物品信息、订单信息、支付信息等</li>
                <li>用户内容：评论、评价、消息等</li>
              </ul>
            </Paragraph>
            <Paragraph>
              <SafetyCertificateOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} />
              <Text strong>自动收集的信息</Text>
            </Paragraph>
            <Paragraph style={{ marginLeft: 24 }}>
              2.2 当您使用我们的服务时，我们可能会自动收集某些信息，包括但不限于：
              <ul>
                <li>设备信息：设备类型、操作系统、浏览器类型等</li>
                <li>日志信息：IP地址、访问时间、浏览记录等</li>
                <li>位置信息：您的大致位置（如果您授权）</li>
                <li>Cookie和类似技术收集的信息</li>
              </ul>
            </Paragraph>
          </Card>
          
          <Card id="usage" style={{ marginTop: 24 }}>
            <Title level={3}>3. 信息使用</Title>
            <Divider />
            <Paragraph>
              <EyeOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} />
              <Text strong>服务提供</Text>
            </Paragraph>
            <Paragraph style={{ marginLeft: 24 }}>
              3.1 我们使用收集的信息来：
              <ul>
                <li>提供、维护和改进我们的服务</li>
                <li>处理和完成交易</li>
                <li>验证用户身份和防止欺诈</li>
                <li>与您沟通并提供客户支持</li>
                <li>向您发送服务通知和更新</li>
              </ul>
            </Paragraph>
            <Paragraph>
              <EyeOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} />
              <Text strong>服务优化</Text>
            </Paragraph>
            <Paragraph style={{ marginLeft: 24 }}>
              3.2 我们也可能使用您的信息来：
              <ul>
                <li>分析和监控服务使用情况</li>
                <li>开发新功能和服务</li>
                <li>为您提供个性化推荐和内容</li>
                <li>进行调查和研究以改进用户体验</li>
              </ul>
            </Paragraph>
          </Card>
          
          <Card id="sharing" style={{ marginTop: 24 }}>
            <Title level={3}>4. 信息共享</Title>
            <Divider />
            <Paragraph>
              <GlobalOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} />
              <Text strong>与第三方共享</Text>
            </Paragraph>
            <Paragraph style={{ marginLeft: 24 }}>
              4.1 我们不会出售您的个人信息。我们可能在以下情况下共享您的信息：
              <ul>
                <li>经您明确同意</li>
                <li>与交易相关方共享必要的信息以完成交易</li>
                <li>与提供技术、支付或分析服务的服务提供商共享，这些提供商有义务保护您的信息</li>
                <li>在法律要求或为保护权利的情况下</li>
              </ul>
            </Paragraph>
            <Paragraph>
              <GlobalOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} />
              <Text strong>匿名数据</Text>
            </Paragraph>
            <Paragraph style={{ marginLeft: 24 }}>
              4.2 我们可能会共享匿名或汇总的用户数据（不包含个人身份信息），用于分析、改进服务或其他商业目的。
            </Paragraph>
          </Card>
          
          <Card id="protection" style={{ marginTop: 24 }}>
            <Title level={3}>5. 信息保护</Title>
            <Divider />
            <Paragraph>
              <LockOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} />
              <Text strong>安全措施</Text>
            </Paragraph>
            <Paragraph style={{ marginLeft: 24 }}>
              5.1 我们采取各种安全技术和程序来保护您的个人信息，防止未经授权的访问、使用或披露，包括但不限于：
              <ul>
                <li>使用加密技术保护数据传输和存储</li>
                <li>实施访问控制机制</li>
                <li>定期审查和更新安全措施</li>
              </ul>
            </Paragraph>
            <Paragraph>
              <LockOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} />
              <Text strong>数据保留</Text>
            </Paragraph>
            <Paragraph style={{ marginLeft: 24 }}>
              5.2 我们会在必要的时间内保留您的个人信息，以实现本政策中描述的目的，除非法律要求或允许更长的保留期限。
            </Paragraph>
          </Card>
          
          <Card id="cookies" style={{ marginTop: 24 }}>
            <Title level={3}>6. Cookie使用</Title>
            <Divider />
            <Paragraph style={{ marginLeft: 24 }}>
              6.1 我们使用Cookie和类似技术来收集和存储信息，以提供更好的用户体验，包括：
              <ul>
                <li>记住您的登录状态</li>
                <li>了解和保存您的偏好设置</li>
                <li>分析网站流量和性能</li>
                <li>优化广告和内容推荐</li>
              </ul>
            </Paragraph>
            <Paragraph style={{ marginLeft: 24 }}>
              6.2 您可以通过浏览器设置控制和删除Cookie，但这可能会影响某些功能的可用性。
            </Paragraph>
          </Card>
          
          <Card id="rights" style={{ marginTop: 24 }}>
            <Title level={3}>7. 用户权利</Title>
            <Divider />
            <Paragraph>
              <SolutionOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} />
              <Text strong>管理个人信息</Text>
            </Paragraph>
            <Paragraph style={{ marginLeft: 24 }}>
              7.1 您有权：
              <ul>
                <li>访问和查看您的个人信息</li>
                <li>更正不准确或不完整的信息</li>
                <li>删除您的账户和相关信息（受法律和合理业务要求限制）</li>
                <li>限制或反对某些信息处理</li>
                <li>将您的信息导出（在技术可行的情况下）</li>
              </ul>
            </Paragraph>
            <Paragraph style={{ marginLeft: 24 }}>
              7.2 您可以通过账户设置或联系我们的客服团队行使这些权利。
            </Paragraph>
          </Card>
          
          <Card id="children" style={{ marginTop: 24 }}>
            <Title level={3}>8. 未成年人保护</Title>
            <Divider />
            <Paragraph style={{ marginLeft: 24 }}>
              8.1 我们的服务不面向16岁以下的儿童。我们不会故意收集16岁以下儿童的个人信息。
            </Paragraph>
            <Paragraph style={{ marginLeft: 24 }}>
              8.2 如果我们得知已收集了16岁以下儿童的个人信息，我们会采取合理措施尽快删除此类信息。
            </Paragraph>
          </Card>
          
          <Card id="changes" style={{ marginTop: 24 }}>
            <Title level={3}>9. 政策变更</Title>
            <Divider />
            <Paragraph style={{ marginLeft: 24 }}>
              9.1 我们可能会不时更新本隐私政策。如有重大变更，我们会通过在网站上发布通知或向您发送电子邮件等方式通知您。
            </Paragraph>
            <Paragraph style={{ marginLeft: 24 }}>
              9.2 我们鼓励您定期查看本政策，以了解我们如何保护您的信息。
            </Paragraph>
          </Card>
          
          <Card id="contact" style={{ marginTop: 24 }}>
            <Title level={3}>10. 联系我们</Title>
            <Divider />
            <Paragraph style={{ marginLeft: 24 }}>
              10.1 如果您对本隐私政策有任何问题、意见或投诉，请联系我们：
              <Space direction="vertical" style={{ marginTop: 12 }}>
                <Text>电子邮件：privacy@campus-trading.com</Text>
                <Text>电话：123-456-7890</Text>
                <Text>地址：校园交易平台隐私办公室</Text>
              </Space>
            </Paragraph>
            <Paragraph style={{ marginLeft: 24 }}>
              10.2 我们会在收到您的请求后30天内回复。
            </Paragraph>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Privacy; 