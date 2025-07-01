import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Card, Avatar, Upload, message, Tabs, List, Spin } from 'antd';
import { UserOutlined, UploadOutlined, LockOutlined } from '@ant-design/icons';
import { fetchCurrentUser, updateUserProfile, changePassword, uploadAvatar } from '../store/actions/authActions';
import { selectUser, selectAuthLoading } from '../store/slices/authSlice';
import { fetchMyItems } from '../store/actions/itemActions';
import { fetchUserOrders } from '../store/actions/orderActions';
import { selectItems } from '../store/slices/itemSlice';
import { selectOrders } from '../store/slices/orderSlice';
import { Link } from 'react-router-dom';

const { TabPane } = Tabs;

const UserProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);
  const myItems = useSelector(selectItems);
  const myOrders = useSelector(selectOrders);
  
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('profile');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    dispatch(fetchCurrentUser());
    dispatch(fetchMyItems());
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

  if (loading || !user) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="user-profile-container">
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="个人资料" key="profile">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
              <Avatar 
                size={100} 
                src={avatarUrl || user.avatarUrl} 
                icon={<UserOutlined />} 
                style={{ marginBottom: 16 }}
              />
              <Upload
                name="image"
                showUploadList={false}
                beforeUpload={beforeAvatarUpload}
                onChange={handleAvatarChange}
                style={{ display: 'inline-block' }}
              >
                <Button icon={<UploadOutlined />}>更换头像</Button>
              </Upload>
            </div>
            
            <Form
              form={profileForm}
              layout="vertical"
              onFinish={handleProfileUpdate}
            >
              <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="用户名" />
              </Form.Item>
              
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input placeholder="邮箱地址" />
              </Form.Item>
              
              <Form.Item
                name="phone"
                label="手机号码"
              >
                <Input placeholder="手机号码" />
              </Form.Item>
              
              <Form.Item
                name="bio"
                label="个人简介"
              >
                <Input.TextArea rows={4} placeholder="介绍一下自己吧" />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  保存修改
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          
          <TabPane tab="修改密码" key="password">
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handlePasswordChange}
            >
              <Form.Item
                name="oldPassword"
                label="当前密码"
                rules={[{ required: true, message: '请输入当前密码' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="当前密码" />
              </Form.Item>
              
              <Form.Item
                name="newPassword"
                label="新密码"
                rules={[
                  { required: true, message: '请输入新密码' },
                  { min: 6, message: '密码长度不能少于6个字符' }
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="新密码" />
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
                <Input.Password prefix={<LockOutlined />} placeholder="确认新密码" />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  修改密码
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          
          <TabPane tab="我的物品" key="items">
            {myItems && myItems.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={myItems}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <Link key="edit" to={`/items/edit/${item.id}`}>编辑</Link>,
                      <Link key="view" to={`/items/${item.id}`}>查看</Link>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={item.images && item.images.length > 0 ? item.images[0] : null} shape="square" size={64} />}
                      title={<Link to={`/items/${item.id}`}>{item.title}</Link>}
                      description={
                        <div>
                          <p>价格: ¥{item.price}</p>
                          <p>分类: {item.category}</p>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p>您还没有发布过物品</p>
                <Button type="primary">
                  <Link to="/items/publish">发布新物品</Link>
                </Button>
              </div>
            )}
          </TabPane>
          
          <TabPane tab="我的订单" key="orders">
            {myOrders && myOrders.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={myOrders}
                renderItem={order => (
                  <List.Item
                    actions={[
                      <Link key="view" to={`/orders/${order.id}`}>查看详情</Link>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={order.item.images && order.item.images.length > 0 ? order.item.images[0] : null} shape="square" size={64} />}
                      title={<Link to={`/orders/${order.id}`}>{order.item.title}</Link>}
                      description={
                        <div>
                          <p>价格: ¥{order.amount}</p>
                          <p>状态: {
                            order.status === 'PENDING' ? '待支付' : 
                            order.status === 'PAID' ? '已支付' : 
                            order.status === 'COMPLETED' ? '已完成' : 
                            '已取消'
                          }</p>
                          <p>角色: {order.role === 'BUYER' ? '买家' : '卖家'}</p>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p>您还没有任何订单</p>
                <Button type="primary">
                  <Link to="/items">浏览物品</Link>
                </Button>
              </div>
            )}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default UserProfile; 