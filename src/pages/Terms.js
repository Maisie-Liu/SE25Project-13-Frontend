import React from 'react';
import { Layout, Typography, Card, Divider, Anchor, List } from 'antd';
import { 
  FileProtectOutlined, 
  SafetyCertificateOutlined,
  AlertOutlined,
  LockOutlined,
  BulbOutlined
} from '@ant-design/icons';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Link } = Anchor;

const Terms = () => {
  return (
    <Layout className="terms-container">
      <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
        <div className="page-header" style={{ textAlign: 'center', marginBottom: 40 }}>
          <FileProtectOutlined style={{ fontSize: 48, color: 'var(--primary-color)', marginBottom: 16 }} />
          <Title level={2}>服务条款</Title>
          <Paragraph style={{ fontSize: 16, maxWidth: 700, margin: '0 auto' }}>
            欢迎使用校园二手交易平台。请仔细阅读以下条款，使用我们的平台即表示您同意接受这些条款的约束。
            最后更新日期: 2025年7月1日
          </Paragraph>
        </div>

        <div className="terms-content" style={{ display: 'flex', gap: '24px' }}>
          <div style={{ width: 200, position: 'sticky', top: 24 }}>
            <Card>
              <Anchor offsetTop={80}>
                <Link href="#introduction" title="1. 引言" />
                <Link href="#definitions" title="2. 定义" />
                <Link href="#eligibility" title="3. 使用资格" />
                <Link href="#account" title="4. 账户责任" />
                <Link href="#content" title="5. 内容规范" />
                <Link href="#trading" title="6. 交易规则" />
                <Link href="#payment" title="7. 支付条款" />
                <Link href="#liability" title="8. 责任限制" />
                <Link href="#privacy" title="9. 隐私政策" />
                <Link href="#termination" title="10. 终止条款" />
                <Link href="#changes" title="11. 条款变更" />
                <Link href="#contact" title="12. 联系我们" />
              </Anchor>
            </Card>
          </div>

          <div style={{ flex: 1 }}>
            <Card id="introduction">
              <Title level={3}>1. 引言</Title>
              <Divider />
              <Paragraph>
                校园二手交易平台（以下简称"本平台"）是由XYZ科技有限公司提供的线上二手物品交易服务。
                本条款构成您与本平台之间具有法律约束力的协议。通过访问或使用本平台，您确认已阅读、理解并同意遵守本条款。
                如果您不同意这些条款的任何部分，请不要使用我们的平台。
              </Paragraph>
            </Card>

            <Card id="definitions" style={{ marginTop: 24 }}>
              <Title level={3}>2. 定义</Title>
              <Divider />
              <List
                itemLayout="horizontal"
                split={false}
                dataSource={[
                  {
                    term: '平台',
                    definition: '指校园二手交易平台网站、应用程序及其相关服务。'
                  },
                  {
                    term: '用户',
                    definition: '指注册并使用本平台的个人或实体，包括买家和卖家。'
                  },
                  {
                    term: '内容',
                    definition: '指用户在平台上发布的所有信息，包括但不限于物品描述、图片、评论等。'
                  },
                  {
                    term: '交易',
                    definition: '指通过本平台促成的物品买卖行为。'
                  },
                  {
                    term: '托管服务',
                    definition: '指平台提供的资金托管服务，确保交易安全。'
                  }
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={<Text strong>{item.term}</Text>}
                      description={item.definition}
                    />
                  </List.Item>
                )}
              />
            </Card>

            <Card id="eligibility" style={{ marginTop: 24 }}>
              <Title level={3}>3. 使用资格</Title>
              <Divider />
              <Paragraph>
                3.1 您必须年满18周岁或在您所在司法管辖区内具有足够的法定年龄，能够签订具有约束力的合同。
              </Paragraph>
              <Paragraph>
                3.2 如您是在校学生，您必须遵守学校相关规定使用本平台。
              </Paragraph>
              <Paragraph>
                3.3 您不得将本平台用于任何非法目的或违反本条款的行为。
              </Paragraph>
              <Paragraph>
                3.4 本平台保留拒绝任何人访问或使用服务的权利，理由包括但不限于违反本条款。
              </Paragraph>
            </Card>

            <Card id="account" style={{ marginTop: 24 }}>
              <Title level={3}>4. 账户责任</Title>
              <Divider />
              <Paragraph>
                4.1 您必须提供准确、完整和最新的个人信息以创建账户。
              </Paragraph>
              <Paragraph>
                4.2 您有责任保护您的账户密码安全，并对使用您账户进行的所有活动负全部责任。
              </Paragraph>
              <Paragraph>
                4.3 如发现任何未经授权使用您账户的情况，您应立即通知平台。
              </Paragraph>
              <Paragraph>
                4.4 平台保留在发现违规行为时暂停或终止账户的权利。
              </Paragraph>
            </Card>

            <Card id="content" style={{ marginTop: 24 }}>
              <Title level={3}>5. 内容规范</Title>
              <Divider />
              <Paragraph>
                <BulbOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} /> 
                <Text strong>发布规则</Text>
              </Paragraph>
              <Paragraph style={{ marginLeft: 24 }}>
                5.1 用户发布的所有内容必须真实、准确且不具有误导性。
              </Paragraph>
              <Paragraph style={{ marginLeft: 24 }}>
                5.2 禁止发布任何非法、有害、威胁、辱骂、骚扰、诽谤、侵犯隐私、侵犯知识产权或其他不适当的内容。
              </Paragraph>
              <Paragraph style={{ marginLeft: 24 }}>
                5.3 禁止发布出售受限或禁止物品的信息，包括但不限于毒品、武器、假冒商品等。
              </Paragraph>
              <Paragraph>
                <BulbOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} /> 
                <Text strong>内容责任</Text>
              </Paragraph>
              <Paragraph style={{ marginLeft: 24 }}>
                5.4 您对通过您的账户发布的所有内容负全部责任。
              </Paragraph>
              <Paragraph style={{ marginLeft: 24 }}>
                5.5 平台有权但无义务审核、编辑或删除任何不符合本条款的内容。
              </Paragraph>
              <Paragraph style={{ marginLeft: 24 }}>
                5.6 您授予平台全球范围内、免费的、非排他性的许可，允许平台使用、复制、修改、发布您发布的内容，用于运营、改进和推广服务。
              </Paragraph>
            </Card>

            <Card id="trading" style={{ marginTop: 24 }}>
              <Title level={3}>6. 交易规则</Title>
              <Divider />
              <Paragraph>
                <AlertOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} /> 
                <Text strong>一般规则</Text>
              </Paragraph>
              <Paragraph style={{ marginLeft: 24 }}>
                6.1 本平台仅作为买卖双方的中介服务提供商，不直接参与用户之间的交易。
              </Paragraph>
              <Paragraph style={{ marginLeft: 24 }}>
                6.2 用户应遵循诚实守信的原则进行交易，确保所交易物品的描述准确无误。
              </Paragraph>
              <Paragraph style={{ marginLeft: 24 }}>
                6.3 平台鼓励但不强制要求用户使用平台提供的托管支付服务完成交易。
              </Paragraph>
              <Paragraph>
                <AlertOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} /> 
                <Text strong>卖家责任</Text>
              </Paragraph>
              <Paragraph style={{ marginLeft: 24 }}>
                6.4 卖家必须确保其有权出售物品，且物品符合所有适用的法律法规。
              </Paragraph>
              <Paragraph style={{ marginLeft: 24 }}>
                6.5 卖家应提供物品的准确描述，包括任何瑕疵或问题。
              </Paragraph>
              <Paragraph style={{ marginLeft: 24 }}>
                6.6 卖家在收到付款后应按约定时间发货或交付物品。
              </Paragraph>
              <Paragraph>
                <AlertOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} /> 
                <Text strong>买家责任</Text>
              </Paragraph>
              <Paragraph style={{ marginLeft: 24 }}>
                6.7 买家应在购买前仔细阅读物品描述，确认自己了解物品状况。
              </Paragraph>
              <Paragraph style={{ marginLeft: 24 }}>
                6.8 买家应按约定方式支付货款并遵守交易协议。
              </Paragraph>
              <Paragraph style={{ marginLeft: 24 }}>
                6.9 买家收到物品后应及时确认，如有问题应在合理时间内提出。
              </Paragraph>
            </Card>

            <Card id="payment" style={{ marginTop: 24 }}>
              <Title level={3}>7. 支付条款</Title>
              <Divider />
              <Paragraph>
                <SafetyCertificateOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} /> 
                <Text strong>托管支付</Text>
              </Paragraph>
              <Paragraph style={{ marginLeft: 24 }}>
                7.1 平台提供托管支付服务，买家的付款将被暂时托管，直到买家确认收到物品并满意后才会释放给卖家。
              </Paragraph>
              <Paragraph style={{ marginLeft: 24 }}>
                7.2 使用托管服务的交易，平台将收取交易金额的一定比例作为服务费。具体费率以平台公示为准。
              </Paragraph>
              <Paragraph>
                <SafetyCertificateOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} /> 
                <Text strong>直接支付</Text>
              </Paragraph>
              <Paragraph style={{ marginLeft: 24 }}>
                7.3 用户也可选择线下直接支付方式完成交易，但平台不对此类交易提供保障服务。
              </Paragraph>
              <Paragraph style={{ marginLeft: 24 }}>
                7.4 对于直接支付方式产生的纠纷，平台将提供有限的调解服务，但不承担任何责任。
              </Paragraph>
              <Paragraph>
                <SafetyCertificateOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} /> 
                <Text strong>退款政策</Text>
              </Paragraph>
              <Paragraph style={{ marginLeft: 24 }}>
                7.5 如买家在收到物品后发现与描述严重不符，可在48小时内申请退款。
              </Paragraph>
              <Paragraph style={{ marginLeft: 24 }}>
                7.6 平台将审核退款申请，并根据情况决定是否支持退款请求。
              </Paragraph>
            </Card>

            <Card id="liability" style={{ marginTop: 24 }}>
              <Title level={3}>8. 责任限制</Title>
              <Divider />
              <Paragraph>
                8.1 本平台按"现状"和"可用性"提供，不对服务的适用性、可靠性、及时性、安全性或可用性作任何明示或暗示的保证。
              </Paragraph>
              <Paragraph>
                8.2 平台不对用户之间的交易行为承担责任，包括但不限于物品质量、交付和付款等方面的纠纷。
              </Paragraph>
              <Paragraph>
                8.3 平台不对用户因使用本服务而遭受的任何直接、间接、附带、特殊、惩罚性或后果性损害承担责任。
              </Paragraph>
              <Paragraph>
                8.4 在法律允许的最大范围内，平台的总体责任限制在用户为相关交易支付的费用金额内。
              </Paragraph>
            </Card>

            <Card id="privacy" style={{ marginTop: 24 }}>
              <Title level={3}>9. 隐私政策</Title>
              <Divider />
              <Paragraph>
                <LockOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} /> 
                <Text strong>信息收集</Text>
              </Paragraph>
              <Paragraph style={{ marginLeft: 24 }}>
                9.1 平台会收集用户提供的个人信息，包括但不限于姓名、联系方式、学校信息等。
              </Paragraph>
              <Paragraph style={{ marginLeft: 24 }}>
                9.2 平台还会自动收集使用数据，如IP地址、浏览器类型、访问时间等。
              </Paragraph>
              <Paragraph>
                <LockOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} /> 
                <Text strong>信息使用</Text>
              </Paragraph>
              <Paragraph style={{ marginLeft: 24 }}>
                9.3 收集的信息将用于提供、维护和改进服务，处理交易，以及与用户沟通。
              </Paragraph>
              <Paragraph style={{ marginLeft: 24 }}>
                9.4 平台不会将用户个人信息出售给第三方，但可能与合作伙伴共享匿名的统计数据。
              </Paragraph>
              <Paragraph>
                <LockOutlined style={{ color: 'var(--primary-color)', marginRight: 8 }} /> 
                <Text strong>信息保护</Text>
              </Paragraph>
              <Paragraph style={{ marginLeft: 24 }}>
                9.5 平台采取合理的安全措施保护用户信息，防止未经授权的访问、使用或披露。
              </Paragraph>
              <Paragraph style={{ marginLeft: 24 }}>
                9.6 详细的隐私政策可在平台"隐私政策"页面查阅。
              </Paragraph>
            </Card>

            <Card id="termination" style={{ marginTop: 24 }}>
              <Title level={3}>10. 终止条款</Title>
              <Divider />
              <Paragraph>
                10.1 用户可以随时停止使用服务或关闭账户，但需要履行已完成的交易义务。
              </Paragraph>
              <Paragraph>
                10.2 平台保留在以下情况下暂停或终止用户访问服务的权利：
              </Paragraph>
              <Paragraph style={{ marginLeft: 24 }}>
                a) 违反本条款或其他平台规则
              </Paragraph>
              <Paragraph style={{ marginLeft: 24 }}>
                b) 涉嫌欺诈或其他非法活动
              </Paragraph>
              <Paragraph style={{ marginLeft: 24 }}>
                c) 长期不活跃
              </Paragraph>
              <Paragraph style={{ marginLeft: 24 }}>
                d) 平台认为必要的其他情况
              </Paragraph>
              <Paragraph>
                10.3 终止后，用户对平台内容的访问权限将被撤销，但本条款中关于责任限制、知识产权等部分仍将继续有效。
              </Paragraph>
            </Card>

            <Card id="changes" style={{ marginTop: 24 }}>
              <Title level={3}>11. 条款变更</Title>
              <Divider />
              <Paragraph>
                11.1 平台保留随时修改本条款的权利，修改后的条款将在平台上公布。
              </Paragraph>
              <Paragraph>
                11.2 重大变更将通过电子邮件或平台通知的方式告知用户。
              </Paragraph>
              <Paragraph>
                11.3 变更生效后，继续使用平台服务即表示您接受修改后的条款。
              </Paragraph>
            </Card>

            <Card id="contact" style={{ marginTop: 24 }}>
              <Title level={3}>12. 联系我们</Title>
              <Divider />
              <Paragraph>
                如您对本服务条款有任何疑问，或需要就平台服务提出建议或投诉，请通过以下方式联系我们：
              </Paragraph>
              <Paragraph>
                <strong>电子邮件：</strong> terms@campus-trading.com<br/>
                <strong>客服电话：</strong> 123-456-7890<br/>
                <strong>通信地址：</strong> 中国某省某市某区某街道123号XYZ科技有限公司，邮编：100000
              </Paragraph>
              <Paragraph>
                我们会在收到您的问题后尽快回复。
              </Paragraph>
            </Card>

            <Card style={{ marginTop: 24, textAlign: 'center' }}>
              <Paragraph type="secondary">
                © {new Date().getFullYear()} 校园二手交易平台 版权所有<br/>
                本条款最后更新于：2025年7月1日
              </Paragraph>
            </Card>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default Terms; 