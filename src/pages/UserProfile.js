import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Card, Avatar, Upload, message, Tabs, List, Spin, Typography, Tag, Divider, Switch, Row, Col } from 'antd';
import { UserOutlined, UploadOutlined, LockOutlined, MailOutlined, PhoneOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { fetchCurrentUser, updateUserProfile, changePassword, uploadAvatar, getPersonalizedRecommendSetting, setPersonalizedRecommendSetting, getUserInterestProfile } from '../store/actions/authActions';
import {
  selectUser,
  selectAuthLoading,
  selectPersonalizedRecommend,
  selectUserInterestProfile,
  selectUserInterestProfileLoading
} from '../store/slices/authSlice';
import { fetchUserOrders } from '../store/actions/orderActions';
import { selectOrders } from '../store/slices/orderSlice';
import { Link } from 'react-router-dom';
import './UserProfile.css';
import { Pie } from '@ant-design/plots';

const { TabPane } = Tabs;
const { Title, Paragraph } = Typography;

const UserProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);
  const myOrders = useSelector(selectOrders);
  const allowPersonalizedRecommend = useSelector(selectPersonalizedRecommend);
  const userInterestProfile = useSelector(selectUserInterestProfile);
  const userInterestProfileLoading = useSelector(selectUserInterestProfileLoading);
  
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('profile');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    dispatch(fetchCurrentUser());
    dispatch(fetchUserOrders({}));
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        username: user.username,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
      });
      if (user.avatarUrl) {
        setAvatarUrl(user.avatarUrl);
      }
    }
  }, [user, profileForm]);

  useEffect(() => {
    dispatch(getPersonalizedRecommendSetting());
    dispatch(getUserInterestProfile());
  }, [dispatch]);

  const handleProfileUpdate = (values) => {
    const updatedProfile = {
      ...values,
      avatarUrl: avatarUrl || user.avatarUrl,
    };
    dispatch(updateUserProfile(updatedProfile))
      .then(() => {
        message.success('个人资料更新成功');
      })
      .catch(() => {
        message.error('更新失败，请重试');
      });
  };

  const handlePasswordChange = (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('两次输入的新密码不一致');
      return;
    }
    
    dispatch(changePassword({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    }))
      .then(() => {
        message.success('密码修改成功');
        passwordForm.resetFields();
      })
      .catch(() => {
        message.error('密码修改失败，请检查原密码是否正确');
      });
  };

  const handleAvatarChange = async ({ file }) => {
    if (file.status === 'uploading') return;
    // 这里不再处理，全部交给 beforeAvatarUpload
  };

  const beforeAvatarUpload = async (file) => {
    const isImage = file.type.startsWith('image/');
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isImage) {
      message.error('只能上传图片文件');
      return Upload.LIST_IGNORE;
    }
    if (!isLt5M) {
      message.error('图片大小不能超过5MB');
      return Upload.LIST_IGNORE;
    }
    // 上传图片到后端
    const formData = new FormData();
    formData.append('file', file);
    try {
      const imageUrl = await dispatch(uploadAvatar(formData)).unwrap();
      setAvatarUrl(imageUrl);
      message.success('头像上传成功');
      dispatch(fetchCurrentUser());
    } catch (e) {
      message.error('头像上传失败');
    }
    // 阻止 Upload 组件自动上传
    return Upload.LIST_IGNORE;
  };

  // 收集收到的评价
  const buyerComments = myOrders.filter(
    o => o.buyerComment && user && Number(o.buyerId) === Number(user.id)
  );
  const sellerComments = myOrders.filter(
    o => o.sellerComment && user && Number(o.sellerId) === Number(user.id)
  );

  const handleSwitchChange = async (checked) => {
    try {
      await dispatch(setPersonalizedRecommendSetting(checked));
      message.success(checked ? '已开启个性化推荐' : '已关闭个性化推荐，平台将不再采集你的行为数据');
    } catch (e) {
      message.error('设置失败');
    }
  };

  // 生成同色系渐变色数组（浅主色 -> 主色）
  function getGradientColors(n) {
    // 主色
    const base = { r: 0, g: 184, b: 169 };
    // 浅主色（主色和白色混合70%主色）
    const light = {
      r: Math.round(255 * 0.7 + base.r * 0.3),
      g: Math.round(255 * 0.7 + base.g * 0.3),
      b: Math.round(255 * 0.7 + base.b * 0.3)
    };
    const colors = [];
    for (let i = 0; i < n; i++) {
      const percent = n === 1 ? 1 : i / (n - 1);
      const r = Math.round(light.r * (1 - percent) + base.r * percent);
      const g = Math.round(light.g * (1 - percent) + base.g * percent);
      const b = Math.round(light.b * (1 - percent) + base.b * percent);
      colors.push(`rgb(${r},${g},${b})`);
    }
    return colors;
  }

  // 生成类别名数组和颜色映射
  const categoryIdToName = userInterestProfile?.categoryIdToName || {};
  const categoryInterest = userInterestProfile?.categoryInterest || {};
  // 先将categoryId和categoryName按兴趣值从小到大排序
  const sortedCategoryArr = Object.keys(categoryIdToName)
    .map(id => ({
      id,
      name: categoryIdToName[id],
      interest: categoryInterest[id] ?? 0
    }))
    .sort((a, b) => a.interest - b.interest);
  const categoryIds = sortedCategoryArr.map(item => item.id);
  const categoryNames = sortedCategoryArr.map(item => item.name);
  const colors = getGradientColors(categoryNames.length);

  if (loading || !user) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  console.log('user', user);
  console.log('myOrders', myOrders);
  console.log('buyerComments', buyerComments);
  console.log('sellerComments', sellerComments);

  return (
    <div className="user-profile-container">
      <Card className="profile-card">
        <Tabs activeKey={activeTab} onChange={setActiveTab} className="profile-tabs">
          <TabPane tab="个人资料" key="profile">
            <Row gutter={[24, 24]} className="profile-content">
              <Col xs={24} sm={24} md={8} lg={8} xl={6} className="profile-avatar-col">
                <div className="profile-avatar-container">
                  <Avatar 
                    size={120} 
                    src={avatarUrl || user.avatarUrl} 
                    icon={<UserOutlined />} 
                    className="profile-avatar"
                  />
                  <Upload
                    name="image"
                    showUploadList={false}
                    beforeUpload={beforeAvatarUpload}
                    onChange={handleAvatarChange}
                  >
                    <Button icon={<UploadOutlined />} className="upload-btn">更换头像</Button>
                  </Upload>
                  <div className="user-info">
                    <Title level={4}>{user.username}</Title>
                    <p>注册时间：{new Date(user.createTime).toLocaleDateString()}</p>
                  </div>
                </div>
              </Col>
              
              <Col xs={24} sm={24} md={16} lg={16} xl={18} className="profile-form-col">
                <Form
                  form={profileForm}
                  layout="vertical"
                  onFinish={handleProfileUpdate}
                  className="profile-form"
                >
                  <Form.Item
                    name="username"
                    label="用户名"
                    rules={[{ required: true, message: '请输入用户名' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="用户名" className="profile-input" />
                  </Form.Item>
                  
                  <Form.Item
                    name="email"
                    label="邮箱"
                    rules={[
                      { required: true, message: '请输入邮箱' },
                      { type: 'email', message: '请输入有效的邮箱地址' }
                    ]}
                  >
                    <Input prefix={<MailOutlined />} placeholder="邮箱地址" className="profile-input" />
                  </Form.Item>
                  
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="phone"
                        label="手机号码"
                      >
                        <Input prefix={<PhoneOutlined />} placeholder="手机号码" className="profile-input" />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Form.Item
                    name="bio"
                    label="个人简介"
                  >
                    <Input.TextArea 
                      rows={4} 
                      placeholder="介绍一下自己吧" 
                      className="profile-textarea"
                      prefix={<InfoCircleOutlined />}
                    />
                  </Form.Item>
                  
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} className="submit-btn">
                      保存修改
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </TabPane>
          
          <TabPane tab="修改密码" key="password">
            <Row gutter={[24, 24]} className="profile-content">
              <Col xs={24} sm={24} md={8} lg={8} xl={6} className="password-info-col">
                <div className="password-info">
                  <Title level={4}>密码安全</Title>
                  <Divider />
                  <Paragraph>
                    定期更换密码可以提高账户安全性。建议使用包含字母、数字和特殊字符的组合作为密码。
                  </Paragraph>
                  <div className="password-tips">
                    <ul>
                      <li>密码长度至少6位</li>
                      <li>建议包含大小写字母</li>
                      <li>建议包含数字和特殊字符</li>
                    </ul>
                  </div>
                </div>
              </Col>
              
              <Col xs={24} sm={24} md={16} lg={16} xl={18} className="password-form-col">
                <Form
                  form={passwordForm}
                  layout="vertical"
                  onFinish={handlePasswordChange}
                  className="password-form"
                >
                  <Form.Item
                    name="oldPassword"
                    label="当前密码"
                    rules={[{ required: true, message: '请输入当前密码' }]}
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="当前密码" className="profile-input" />
                  </Form.Item>
                  
                  <Form.Item
                    name="newPassword"
                    label="新密码"
                    rules={[
                      { required: true, message: '请输入新密码' },
                      { min: 6, message: '密码长度不能少于6个字符' }
                    ]}
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="新密码" className="profile-input" />
                  </Form.Item>
                  
                  <Form.Item
                    name="confirmPassword"
                    label="确认新密码"
                    rules={[
                      { required: true, message: '请再次输入新密码' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('两次输入的密码不一致'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="确认新密码" className="profile-input" />
                  </Form.Item>
                  
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} className="submit-btn">
                      修改密码
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </TabPane>
          
          <TabPane tab="收到的评价" key="comments">
          <Row gutter={[24, 24]} className="profile-content">
              <Col span={24}>
                <Card className="comments-card">
                  <div className="comments-header">
                    <Title level={4}>我的评价记录</Title>
                    <div className="comments-stats">
                      <Tag color="#7d989b">总评价: {buyerComments.length + sellerComments.length}</Tag>
                      <Tag color="#a69b8a">买家评价: {sellerComments.length}</Tag>
                      <Tag color="#b89795">卖家评价: {buyerComments.length}</Tag>
                    </div>
                  </div>
                  
                  <Tabs defaultActiveKey="buyer" className="comments-tabs" tabBarStyle={{ marginBottom: 24 }}>
                    <TabPane 
                      tab={
                        <span className="tab-with-tag">
                          <span className="tab-tag tab-tag-buyer"></span>
                          作为买家收到的评价
                        </span>
                      } 
                      key="buyer"
                    >
                      {buyerComments && buyerComments.length > 0 ? (
                        <List
                          className="comments-list"
                          itemLayout="vertical"
                          dataSource={buyerComments}
                          renderItem={order => (
                            <List.Item className="comment-item">
                              <div className="comment-header">
                                <div className="comment-user">
                                  <span className="user-name">{order.sellerName || '匿名卖家'}</span>
                                </div>
                                <div className="comment-order">
                                  <div className="order-info">
                                    <span className="order-label">订单号</span>
                                    <span className="order-number">{order.orderNo}</span>
                                  </div>
                                  <span className="comment-time">
                                    {order.updateTime ? new Date(order.updateTime).toLocaleString() : ''}
                                  </span>
                                </div>
                              </div>
                              <div className="comment-content">
                                <div className="comment-rating">
                                  <Tag color="#7d989b" className="rating-tag">卖家评价</Tag>
                                </div>
                                <Paragraph className="comment-text">{order.buyerComment}</Paragraph>
                              </div>
                              <div className="comment-item-info">
                                <span>物品：{order.itemName || (order.item && order.item.name)}</span>
                                <span>交易金额：¥{order.itemPrice || order.amount}</span>
                              </div>
                            </List.Item>
                          )}
                        />
                      ) : (
                        <div className="empty-comments">
                          <img src="/empty-comment.png" alt="暂无评价" className="empty-image" />
                          <p>暂无卖家对您的评价</p>
                          <Button type="primary" className="empty-action-btn">去购买商品</Button>
                        </div>
                      )}
                    </TabPane>
                    
                    <TabPane 
                      tab={
                        <span className="tab-with-tag">
                          <span className="tab-tag tab-tag-seller"></span>
                          作为卖家收到的评价
                        </span>
                      } 
                      key="seller"
                    >
                      {sellerComments && sellerComments.length > 0 ? (
                        <List
                          className="comments-list"
                          itemLayout="vertical"
                          dataSource={sellerComments}
                          renderItem={order => (
                            <List.Item className="comment-item">
                              <div className="comment-header">
                                <div className="comment-user">
                                  <span className="user-name">{order.buyerName || '匿名买家'}</span>
                                </div>
                                <div className="comment-order">
                                  <div className="order-info">
                                    <span className="order-label">订单号</span>
                                    <span className="order-number">{order.orderNo}</span>
                                  </div>
                                  <span className="comment-time">
                                    {order.updateTime ? new Date(order.updateTime).toLocaleString() : ''}
                                  </span>
                                </div>
                              </div>
                              <div className="comment-content">
                                <div className="comment-rating">
                                  <Tag color="#a69b8a" className="rating-tag">买家评价</Tag>
                                </div>
                                <Paragraph className="comment-text">{order.sellerComment}</Paragraph>
                              </div>
                              <div className="comment-item-info">
                                <span>物品：{order.itemName || (order.item && order.item.name)}</span>
                                <span>交易金额：¥{order.itemPrice || order.amount}</span>
                              </div>
                            </List.Item>
                          )}
                        />
                      ) : (
                        <div className="empty-comments">
                          <img src="/empty-comment.png" alt="暂无评价" className="empty-image" />
                          <p>暂无买家对您的评价</p>
                          <Button type="primary" className="empty-action-btn">去发布物品</Button>
                        </div>
                      )}
                    </TabPane>
                  </Tabs>
                </Card>
              </Col>
            </Row>
          </TabPane>
          
          <TabPane tab="设置" key="settings">
            <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>个性化推荐与数据采集</span>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Switch checked={allowPersonalizedRecommend} onChange={handleSwitchChange} />
                <span style={{ marginLeft: 8, color: '#888' }}>
                  {allowPersonalizedRecommend ? '已开启' : '已关闭'}
                </span>
              </div>
            </div>
          </TabPane>
          
          <TabPane tab="兴趣画像" key="interest">
            {allowPersonalizedRecommend ? (
              userInterestProfileLoading ? (
                <Spin />
              ) : userInterestProfile && userInterestProfile.categoryInterest && userInterestProfile.categoryIdToName ? (
                <div
                   style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                >
                   <Title level={3} style={{ width: '100%', textAlign: 'center', marginBottom: 24 }}>你的兴趣画像</Title>
                   <Pie
                    data={categoryIds.map((catId) => ({
                      categoryName: categoryIdToName[catId],
                      value: categoryInterest[catId] ?? 0
                    }))}
                    angleField="value"
                    colorField="categoryName"
                    radius={1}
                    innerRadius={0.6}
                    autoFit={false}
                    height={400}
                    legend={false}
                    label={{
                      position: 'spider',
                      text: ({ categoryName}) => `${categoryName}`
                    }}
                    tooltip={false}
                    scale={{
                      color: {
                        range: colors
                      }
                    }}
                    statistic={false}
                    style={{margin: '0 auto', inset: 1, display: 'block'}}
                  />
                </div>
              ) : (
                <div style={{ color: '#888' }}>暂无兴趣画像数据</div>
              )
            ) : (
              <div style={{ color: '#888' }}>你已关闭个性化推荐与数据采集，平台不会展示你的兴趣画像。</div>
            )}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default UserProfile; 