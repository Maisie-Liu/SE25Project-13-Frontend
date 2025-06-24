import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button, Typography, Alert, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '../store/actions/authActions';
import { selectIsAuthenticated, selectAuthLoading, selectAuthError, clearError } from '../store/slices/authSlice';

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  // 如果已经登录，重定向到首
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // 清除错误信息
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [dispatch, error]);

  // 处理登录
  const handleLogin = (values) => {
    dispatch(login(values));
  };

  return (
    <div className="container" style={{ marginTop: 50 }}>
      <Card style={{ maxWidth: 400, margin: '0 auto' }}>
        <Title level={2} className="text-center">登录</Title>
        
        {error && (
          <Alert
            message="登录失败"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={handleLogin}
          layout="vertical"
          className="login-form"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名" 
              size="large" 
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="密码" 
              size="large" 
            />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="login-form-button" 
              loading={loading}
              size="large"
            >
              登录
            </Button>
          </Form.Item>
          
          <div className="text-center">
            <span>还没有账号？</span>
            <Link to="/register">立即注册</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 