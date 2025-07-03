import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt, faTags } from '@fortawesome/free-solid-svg-icons';
import { 
  Layout, 
  Menu, 
  Button, 
  Avatar, 
  Dropdown, 
  Space,
  Badge,
  Tooltip,
  Input,
  Tag
} from 'antd';
import { 
  UserOutlined, 
  ShoppingOutlined, 
  LogoutOutlined, 
  BellOutlined,
  HeartOutlined,
  MessageOutlined,
  HomeOutlined,
  AppstoreOutlined,
  QuestionCircleOutlined,
  ShoppingCartOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { selectIsAuthenticated, selectUser } from '../../store/slices/authSlice';
import { logout } from '../../store/actions/authActions';

const { Header: AntHeader } = Layout;
const { Search } = Input;

// 使用styled-components创建自定义组件
const LogoContainer = styled.div`
  margin-right: 30px;
  display: flex;
  align-items: center;
  position: relative;
`;

const LogoIcon = styled.div`
  font-size: 18px;
  margin-right: 10px;
  color: #fff;
  background: #00B8A9;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 184, 169, 0.3);
  transform: rotate(-10deg);
`;

const LogoText = styled.span`
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  position: relative;
  display: inline-block;
  letter-spacing: 1px;
  max-width: 120px;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2px;
    height: 2px;
    background: #00B8A9;
    opacity: 0.7;
    border-radius: 50%;
  }
`;

const StyledHeader = styled(AntHeader)`
  background: #1a365d;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 0 16px;
  height: 60px;
  line-height: 60px;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  margin-top: 8px;
  white-space: nowrap;
`;

const StyledTag = styled(Tag)`
  cursor: pointer;
  margin-right: 8px;
  margin-bottom: 0;
  transition: all 0.3s;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 12px;
  border: none;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

const SearchContainer = styled.div`
  width: 400px;
  
  .ant-input-search-button {
    background: #00B8A9;
    border: none;
    box-shadow: 0 2px 6px rgba(0, 184, 169, 0.4);
    height: 38px;
  }
  
  .ant-input-affix-wrapper {
    border-radius: 8px 0 0 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.07);
    height: 38px;
    border: none;
  }
  
  .ant-input-search-button {
    border-radius: 0 8px 8px 0;
  }
`;

const HeaderSearchWrap = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const HeaderButton = styled(Button)`
  &.icon-button {
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }
    
    .anticon {
      font-size: 16px;
    }
  }
`;

const UserMenu = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: 24px;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .user-avatar {
    border: 2px solid rgba(255, 255, 255, 0.5);
    margin-right: 6px;
  }
  
  .username {
    color: #fff;
    margin: 0 6px 0 0;
    font-weight: 500;
  }
`;

const AuthButton = styled(Button)`
  height: 32px;
  border-radius: 6px;
  
  &.ant-btn-primary {
    background: #00B8A9;
    border: none;
    box-shadow: 0 3px 6px rgba(0, 184, 169, 0.4);
  }
  
  &.ant-btn-ghost {
    border-color: rgba(255, 255, 255, 0.7);
    
    &:hover {
      border-color: #fff;
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  
  // 热门搜索关键词
  const hotKeywords = ['电子产品', '教材', '自行车', '运动鞋', '手机配件'];
  
  // 处理搜索
  const handleSearch = (value) => {
    navigate(`/items?keyword=${encodeURIComponent(value)}`);
  };

  // 处理登出
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // 用户下拉菜单项
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => navigate('/profile')
    },
    {
      key: 'myItems',
      icon: <ShoppingOutlined />,
      label: '我的物品',
      onClick: () => navigate('/my/items')
    },
    {
      key: 'myOrders',
      icon: <ShoppingCartOutlined />,
      label: '我的订单',
      onClick: () => navigate('/my/orders')
    },
    {
      key: 'myFavorites',
      icon: <HeartOutlined />,
      label: '我的收藏',
      onClick: () => navigate('/my/favorites')
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout
    }
  ];

  // 主菜单项
  const mainMenuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: '首页',
      onClick: () => navigate('/')
    },
    {
      key: 'items',
      icon: <AppstoreOutlined />,
      label: '全部物品',
      onClick: () => navigate('/items')
    },
    {
      key: 'publish',
      icon: <ShoppingOutlined />,
      label: '发布物品',
      onClick: () => navigate('/items/publish')
    },
    {
      key: 'help',
      icon: <QuestionCircleOutlined />,
      label: '帮助中心',
      onClick: () => navigate('/help')
    }
  ];

  return (
    <div className="header-wrapper">
      <StyledHeader className="header">
        <div className="container" style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0 4px' }}>
          <LogoContainer>
            <Link to="/">
              <LogoIcon>
                <FontAwesomeIcon icon={faExchangeAlt} />
              </LogoIcon>
            </Link>
            <Link to="/">
              <LogoText>交物通</LogoText>
            </Link>
          </LogoContainer>
          
          <HeaderSearchWrap>
            <SearchContainer>
              <Search
                placeholder="搜索物品"
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
                className="header-search-box"
              />
            </SearchContainer>
            <TagContainer>
              {hotKeywords.map((keyword, index) => (
                <StyledTag 
                  key={index} 
                  onClick={() => handleSearch(keyword)}
                  color={index === 0 ? '#00B8A9' : index === 1 ? '#00B8A9' : index === 2 ? '#00B8A9' : index === 3 ? '#00B8A9' : '#00B8A9'}
                >
                  {keyword}
                </StyledTag>
              ))}
            </TagContainer>
          </HeaderSearchWrap>
          
          <Menu 
            mode="horizontal" 
            theme="dark" 
            items={mainMenuItems}
            className="main-menu" 
            style={{ background: 'transparent', border: 'none', justifyContent: 'flex-end' }}
          />
          
          <div className="header-actions">
            <Space size="small">
              {isAuthenticated ? (
                <>
                  <Badge count={3} size="small">
                    <HeaderButton 
                      type="text" 
                      icon={<BellOutlined />} 
                      className="icon-button"
                      onClick={() => navigate('/notifications')}
                    />
                  </Badge>
                  <Badge count={2} size="small">
                    <HeaderButton 
                      type="text" 
                      icon={<MessageOutlined />} 
                      className="icon-button"
                      onClick={() => navigate('/messages')}
                    />
                  </Badge>
                  <Badge count={5} size="small">
                    <HeaderButton 
                      type="text" 
                      icon={<HeartOutlined />} 
                      className="icon-button"
                      onClick={() => navigate('/favorites')}
                    />
                  </Badge>
                  <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                    <UserMenu>
                      <Avatar 
                        src={user?.avatar} 
                        icon={<UserOutlined />} 
                        size="small" 
                        className="user-avatar"
                      />
                      <span className="username">{user?.username || '用户'}</span>
                    </UserMenu>
                  </Dropdown>
                </>
              ) : (
                <Space size="small">
                  <AuthButton ghost onClick={() => navigate('/login')}>登录</AuthButton>
                  <AuthButton type="primary" onClick={() => navigate('/register')}>注册</AuthButton>
                </Space>
              )}
            </Space>
          </div>
        </div>
      </StyledHeader>
    </div>
  );
};

export default Header; 