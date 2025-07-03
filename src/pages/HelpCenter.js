import React from 'react';
import { Layout, Typography, Collapse, Card, Row, Col, Divider, Button } from 'antd';
import { 
  QuestionCircleOutlined, 
  ShoppingOutlined, 
  SafetyOutlined,
  DollarOutlined,
  SolutionOutlined,
  MessageOutlined,
  RocketOutlined
} from '@ant-design/icons';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const HelpCenter = () => {
  return (
    <Layout className="help-center-container">
      <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
        <div className="page-header" style={{ textAlign: 'center', marginBottom: 40 }}>
          <QuestionCircleOutlined style={{ fontSize: 48, color: 'var(--primary-color)', marginBottom: 16 }} />
          <Title level={2}>帮助中心</Title>
          <Paragraph style={{ fontSize: 16, maxWidth: 600, margin: '0 auto' }}>
            欢迎来到校园二手交易平台帮助中心，在这里您可以找到使用平台的各种指南和常见问题解答。
          </Paragraph>
        </div>

        <Card title="快速导航" style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Card 
                hoverable 
                className="guide-card"
                onClick={() => document.getElementById('buying-guide').scrollIntoView({ behavior: 'smooth' })}
              >
                <ShoppingOutlined style={{ fontSize: 24, color: 'var(--primary-color)', marginBottom: 8 }} />
                <div className="guide-title">购买指南</div>
                <div className="guide-desc">如何在平台上搜索和购买商品</div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card 
                hoverable 
                className="guide-card"
                onClick={() => document.getElementById('selling-guide').scrollIntoView({ behavior: 'smooth' })}
              >
                <DollarOutlined style={{ fontSize: 24, color: 'var(--primary-color)', marginBottom: 8 }} />
                <div className="guide-title">出售指南</div>
                <div className="guide-desc">如何发布和管理您的二手物品</div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card 
                hoverable 
                className="guide-card"
                onClick={() => document.getElementById('safety-guide').scrollIntoView({ behavior: 'smooth' })}
              >
                <SafetyOutlined style={{ fontSize: 24, color: 'var(--primary-color)', marginBottom: 8 }} />
                <div className="guide-title">安全指南</div>
                <div className="guide-desc">保障交易安全的注意事项</div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card 
                hoverable 
                className="guide-card"
                onClick={() => document.getElementById('account-guide').scrollIntoView({ behavior: 'smooth' })}
              >
                <SolutionOutlined style={{ fontSize: 24, color: 'var(--primary-color)', marginBottom: 8 }} />
                <div className="guide-title">账户管理</div>
                <div className="guide-desc">如何管理您的个人账户设置</div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card 
                hoverable 
                className="guide-card"
                onClick={() => document.getElementById('contact-us').scrollIntoView({ behavior: 'smooth' })}
              >
                <MessageOutlined style={{ fontSize: 24, color: 'var(--primary-color)', marginBottom: 8 }} />
                <div className="guide-title">联系客服</div>
                <div className="guide-desc">遇到问题？联系我们的客服团队</div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card 
                hoverable 
                className="guide-card"
                onClick={() => document.getElementById('faq').scrollIntoView({ behavior: 'smooth' })}
              >
                <RocketOutlined style={{ fontSize: 24, color: 'var(--primary-color)', marginBottom: 8 }} />
                <div className="guide-title">常见问题</div>
                <div className="guide-desc">用户常见问题解答</div>
              </Card>
            </Col>
          </Row>
        </Card>

        <div id="buying-guide">
          <Title level={3} style={{ marginTop: 40 }}>
            <ShoppingOutlined /> 购买指南
          </Title>
          <Divider />
          <Collapse defaultActiveKey={['1']} expandIconPosition="right">
            <Panel header="如何搜索商品" key="1">
              <Paragraph>
                1. 在首页顶部的搜索框中输入关键词<br/>
                2. 使用左侧的分类导航栏选择特定类别<br/>
                3. 使用筛选功能按价格、上架时间等条件筛选<br/>
                4. 浏览搜索结果并点击感兴趣的商品查看详情
              </Paragraph>
            </Panel>
            <Panel header="如何联系卖家" key="2">
              <Paragraph>
                在商品详情页面，您可以找到"联系卖家"按钮。点击后，系统会为您建立与卖家的私信通道，保护双方隐私的同时便于沟通。
              </Paragraph>
            </Panel>
            <Panel header="如何下单购买" key="3">
              <Paragraph>
                1. 在商品详情页点击"立即购买"按钮<br/>
                2. 确认订单信息和配送地址<br/>
                3. 选择支付方式并完成支付<br/>
                4. 等待卖家发货
              </Paragraph>
            </Panel>
          </Collapse>
        </div>

        <div id="selling-guide">
          <Title level={3} style={{ marginTop: 40 }}>
            <DollarOutlined /> 出售指南
          </Title>
          <Divider />
          <Collapse defaultActiveKey={['1']} expandIconPosition="right">
            <Panel header="如何发布物品" key="1">
              <Paragraph>
                1. 登录您的账户<br/>
                2. 点击顶部导航栏的"发布物品"按钮<br/>
                3. 填写物品信息，包括标题、描述、价格、分类等<br/>
                4. 上传清晰的物品照片（建议多角度拍摄）<br/>
                5. 点击"发布"按钮完成发布
              </Paragraph>
            </Panel>
            <Panel header="如何设置合适的价格" key="2">
              <Paragraph>
                1. 参考市场上类似二手物品的价格<br/>
                2. 考虑物品的使用年限和磨损程度<br/>
                3. 考虑物品的原始价值和稀缺性<br/>
                4. 预留一定的议价空间
              </Paragraph>
            </Panel>
            <Panel header="如何提高物品的曝光率" key="3">
              <Paragraph>
                1. 使用清晰、吸引人的图片<br/>
                2. 撰写详细、准确的商品描述<br/>
                3. 选择合适的分类和关键词<br/>
                4. 定期更新或刷新您的物品<br/>
                5. 合理定价以吸引更多潜在买家
              </Paragraph>
            </Panel>
          </Collapse>
        </div>

        <div id="safety-guide">
          <Title level={3} style={{ marginTop: 40 }}>
            <SafetyOutlined /> 安全指南
          </Title>
          <Divider />
          <Collapse defaultActiveKey={['1']} expandIconPosition="right">
            <Panel header="交易安全提示" key="1">
              <Paragraph>
                1. 尽量使用平台提供的托管交易功能<br/>
                2. 面交时选择安全、公共的场所<br/>
                3. 保留所有交易聊天记录<br/>
                4. 收到物品后及时确认并完成交易<br/>
                5. 如遇异常情况，立即联系平台客服
              </Paragraph>
            </Panel>
            <Panel header="如何辨别诈骗行为" key="2">
              <Paragraph>
                1. 价格明显低于市场价的商品要谨慎<br/>
                2. 卖家要求在平台外完成交易<br/>
                3. 卖家催促快速付款或使用不安全的支付方式<br/>
                4. 卖家无法提供额外的物品照片或信息<br/>
                5. 卖家个人信息模糊或不一致
              </Paragraph>
            </Panel>
            <Panel header="如何使用托管交易" key="3">
              <Paragraph>
                1. 在下单时选择"托管交易"选项<br/>
                2. 买家将款项支付给平台托管<br/>
                3. 卖家发货后上传物流信息<br/>
                4. 买家收到物品并确认无误后，平台将款项释放给卖家<br/>
                5. 如有纠纷，可申请平台介入调解
              </Paragraph>
            </Panel>
          </Collapse>
        </div>

        <div id="account-guide">
          <Title level={3} style={{ marginTop: 40 }}>
            <SolutionOutlined /> 账户管理
          </Title>
          <Divider />
          <Collapse defaultActiveKey={['1']} expandIconPosition="right">
            <Panel header="如何修改个人资料" key="1">
              <Paragraph>
                1. 点击右上角的用户头像<br/>
                2. 选择"个人中心"<br/>
                3. 点击"编辑资料"按钮<br/>
                4. 修改您的个人信息<br/>
                5. 点击"保存"完成更新
              </Paragraph>
            </Panel>
            <Panel header="如何修改密码" key="2">
              <Paragraph>
                1. 进入"个人中心"<br/>
                2. 选择"账户安全"选项<br/>
                3. 点击"修改密码"<br/>
                4. 输入当前密码和新密码<br/>
                5. 确认提交修改
              </Paragraph>
            </Panel>
            <Panel header="如何管理我的收藏" key="3">
              <Paragraph>
                1. 进入"个人中心"<br/>
                2. 选择"我的收藏"<br/>
                3. 查看所有收藏的物品<br/>
                4. 点击物品可查看详情<br/>
                5. 点击取消收藏图标可移除收藏
              </Paragraph>
            </Panel>
          </Collapse>
        </div>

        <div id="faq">
          <Title level={3} style={{ marginTop: 40 }}>
            <RocketOutlined /> 常见问题
          </Title>
          <Divider />
          <Collapse defaultActiveKey={['1']} expandIconPosition="right">
            <Panel header="如何注册账号" key="1">
              <Paragraph>
                点击网站右上角的"注册"按钮，按照提示填写相关信息，包括用户名、邮箱和密码，完成验证后即可成功注册账号。
              </Paragraph>
            </Panel>
            <Panel header="忘记密码怎么办" key="2">
              <Paragraph>
                点击登录页面的"忘记密码"链接，输入您的注册邮箱，系统将发送一封密码重置邮件到您的邮箱，按照邮件指引重置密码。
              </Paragraph>
            </Panel>
            <Panel header="如何删除已发布的物品" key="3">
              <Paragraph>
                进入"个人中心"，选择"我的物品"，找到需要删除的物品，点击操作栏中的"删除"按钮，确认后即可删除。
              </Paragraph>
            </Panel>
            <Panel header="如何投诉其他用户" key="4">
              <Paragraph>
                如您遇到不良用户或违规行为，请在对方主页或相关物品页面点击"举报"按钮，选择举报理由并提交。我们的管理团队会尽快处理您的投诉。
              </Paragraph>
            </Panel>
            <Panel header="交易过程中遇到问题怎么办" key="5">
              <Paragraph>
                如在交易过程中遇到纠纷或问题，请及时联系我们的客服团队。您可以通过页面底部的"联系我们"或发送邮件至contact@campus-trading.com获取帮助。
              </Paragraph>
            </Panel>
          </Collapse>
        </div>

        <div id="contact-us">
          <Title level={3} style={{ marginTop: 40 }}>
            <MessageOutlined /> 联系客服
          </Title>
          <Divider />
          <Card style={{ textAlign: 'center', padding: '20px' }}>
            <Paragraph style={{ fontSize: 16 }}>
              如果您在使用过程中遇到任何问题或需要帮助，请随时联系我们的客服团队。
            </Paragraph>
            <Paragraph>
              <strong>客服邮箱：</strong> contact@campus-trading.com<br/>
              <strong>客服电话：</strong> 123-456-7890<br/>
              <strong>工作时间：</strong> 周一至周五 9:00-18:00
            </Paragraph>
            <Button type="primary" size="large" icon={<MessageOutlined />} style={{ marginTop: 16 }}>
              在线咨询
            </Button>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default HelpCenter; 