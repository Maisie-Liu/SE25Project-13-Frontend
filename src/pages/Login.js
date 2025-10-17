import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button, Typography, Alert, Row, Col, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, ShoppingOutlined, SafetyOutlined, TeamOutlined, CommentOutlined } from '@ant-design/icons';
import { login, fetchCurrentUser } from '../store/actions/authActions';
import { selectIsAuthenticated, selectAuthLoading, selectAuthError, clearError } from '../store/slices/authSlice';
import styled from 'styled-components';
import './Login.css';

const { Title, Text, Paragraph } = Typography;

// 样式组件
const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: #f5f7fa;
  position: relative;
  overflow: hidden;
`;

const FloatingBubble = styled.div`
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(64, 196, 196, 0.6), rgba(64, 196, 196, 0.4));
  box-shadow: 0 8px 32px rgba(64, 196, 196, 0.3);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  z-index: 0;
  animation: float 8s infinite ease-in-out;
  
  &.bubble-1 {
    width: 150px;
    height: 150px;
    top: 10%;
    left: 8%;
    animation-delay: 0s;
    opacity: 0.85;
  }
  
  &.bubble-2 {
    width: 180px;
    height: 180px;
    top: 60%;
    left: 15%;
    animation-delay: 2s;
    opacity: 0.75;
  }
  
  &.bubble-3 {
    width: 120px;
    height: 120px;
    top: 25%;
    right: 15%;
    animation-delay: 4s;
    opacity: 0.8;
  }
  
  &.bubble-4 {
    width: 160px;
    height: 160px;
    bottom: 15%;
    right: 8%;
    animation-delay: 6s;
    opacity: 0.7;
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-25px) rotate(10deg);
    }
  }
`;

const LoginCard = styled.div`
  width: 900px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.12), 0 10px 20px rgba(0, 0, 0, 0.08);
  background: #fff;
  display: flex;
  position: relative;
  z-index: 1;
`;

const LeftPanel = styled.div`
  flex: 1;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  padding: 50px;
  background-image: linear-gradient(135deg, #40c4c4 0%, #38b6b6 100%);
  overflow: hidden;
`;

const RightPanel = styled.div`
  flex: 1;
  padding: 40px;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const LogoContainer = styled.div`
  margin-bottom: 30px;
  display: flex;
  align-items: center;
`;

const LogoIcon = styled.div`
  font-size: 24px;
  margin-right: 10px;
  color: #fff;
  background: #40c4c4;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(64, 196, 196, 0.4);
  transform: rotate(-10deg);
`;

const LogoText = styled.span`
  font-family: 'Ma Shan Zheng', cursive;
  font-size: 36px;
  font-weight: normal;
  color: #fff;
  position: relative;
  display: inline-block;
  letter-spacing: 1px;
`;

const FormContainer = styled.div`
  width: 100%;
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 50px;
  font-size: 16px;
  margin-top: 10px;
  border-radius: 8px;
  background: #40c4c4;
  border-color: #40c4c4;
  
  &:hover, &:focus {
    background: #38b6b6;
    border-color: #38b6b6;
  }
`;

const Divider = styled.div`
  position: relative;
  height: 1px;
  background: #e8e8e8;
  margin: 24px 0;
  
  &:after {
    content: "或";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    padding: 0 10px;
    color: #8c8c8c;
    font-size: 14px;
  }
`;

const RegisterLink = styled(Link)`
  color: #40c4c4;
  font-weight: 500;
  
  &:hover {
    color: #38b6b6;
    text-decoration: underline;
  }
`;

const Circle = styled.div`
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  
  &.circle1 {
    width: 200px;
    height: 200px;
    top: -50px;
    right: -50px;
  }
  
  &.circle2 {
    width: 150px;
    height: 150px;
    bottom: -30px;
    left: 50px;
  }
`;

const WelcomeText = styled(Title)`
  &.ant-typography {
    color: white;
    margin-bottom: 16px;
  }
`;

const SubText = styled(Text)`
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  display: block;
  margin-bottom: 30px;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  
  .anticon {
    margin-right: 10px;
    color: white;
    font-size: 16px;
    background: rgba(255, 255, 255, 0.2);
    padding: 8px;
    border-radius: 50%;
  }
  
  span {
    color: rgba(255, 255, 255, 0.9);
    font-size: 14px;
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  // 如果已经登录，重定向到首页
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCurrentUser());
      navigate('/');
    }
  }, [isAuthenticated, navigate, dispatch]);

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
    <LoginContainer>
      {/* 装饰性气泡元素 */}
      <FloatingBubble className="bubble-1" />
      <FloatingBubble className="bubble-2" />
      <FloatingBubble className="bubble-3" />
      <FloatingBubble className="bubble-4" />
      
      <LoginCard className="login-card">
        <LeftPanel className="left-panel">
          <Circle className="circle1" />
          <Circle className="circle2" />
          
          <LogoContainer>
            <LogoIcon>
              <ShoppingOutlined />
            </LogoIcon>
            <LogoText>交物通</LogoText>
          </LogoContainer>
          
          <WelcomeText level={2}>欢迎来到校园二手交易平台测试</WelcomeText>
          <SubText>让闲置物品流通起来，让校园生活更加便利</SubText>
          
          <FeatureItem className="platform-feature">
            <SafetyOutlined />
            <span>安全可靠的交易环境</span>
          </FeatureItem>
          <FeatureItem className="platform-feature">
            <ShoppingOutlined />
            <span>丰富的校园二手物品</span>
          </FeatureItem>
          <FeatureItem className="platform-feature">
            <TeamOutlined />
            <span>广大校园用户群体</span>
          </FeatureItem>
          <FeatureItem className="platform-feature">
            <CommentOutlined />
            <span>便捷的沟通交流方式</span>
          </FeatureItem>
          
          <Paragraph style={{ color: 'rgba(255,255,255,0.7)', marginTop: 30, fontSize: 13 }}>
            加入我们，发现校园闲置的无限可能
          </Paragraph>
        </LeftPanel>
        
        <RightPanel className="right-panel">
          <Title level={2} style={{ marginBottom: 30, textAlign: 'center' }}>登录</Title>
          
          {error && (
            <Alert
              message="登录失败"
              description={error}
              type="error"
              showIcon
              style={{ marginBottom: 24 }}
            />
          )}
          
          <FormContainer>
            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={handleLogin}
              size="large"
              layout="vertical"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
                className="login-form-item"
              >
                <Input 
                  prefix={<UserOutlined style={{ color: '#40c4c4' }} />} 
                  placeholder="用户名" 
                  size="large" 
                  style={{ height: 50, borderRadius: 8 }}
                />
              </Form.Item>
              
              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
                className="login-form-item"
              >
                <Input.Password 
                  prefix={<LockOutlined style={{ color: '#40c4c4' }} />} 
                  placeholder="密码" 
                  size="large"
                  style={{ height: 50, borderRadius: 8 }}
                />
              </Form.Item>
              
              <Form.Item name="remember" valuePropName="checked">
                <Checkbox>记住我</Checkbox>
                <Link
                  style={{
                    float: 'right',
                    color: '#40c4c4',
                  }}
                  to="/forgot-password"
                >
                  忘记密码?
                </Link>
              </Form.Item>
              
              <Form.Item>
                <StyledButton 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  className="login-button login-btn-shine"
                >
                  登录
                </StyledButton>
              </Form.Item>
            </Form>
            
            <Divider />
            
            <div style={{ textAlign: 'center' }}>
              <Text>test2还没有账号？</Text> <RegisterLink to="/register">立即注册</RegisterLink>
            </div>
          </FormContainer>
        </RightPanel>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login; 