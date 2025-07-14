import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { 
  Layout, 
  Button, 
  Avatar, 
  Space, 
  Menu, 
  Badge, 
  Dropdown,
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
  SearchOutlined,
  CommentOutlined
} from '@ant-design/icons';
import { selectIsAuthenticated, selectUser } from '../../store/slices/authSlice';
import { logout } from '../../store/actions/authActions';
import { 
  selectUnreadCount,
  selectUnreadCommentCount,
  selectUnreadFavoriteCount,
  selectUnreadOrderCount,
  selectUnreadChatCount
} from '../../store/slices/messageSlice';
import { fetchUnreadMessagesCount, fetchUnreadMessagesByTypeCount } from '../../store/actions/messageActions';

const { Header: AntHeader } = Layout;
const { Search } = Input;

// 使用styled-components创建自定义组件
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
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
  font-family: 'Ma Shan Zheng', cursive;
  font-size: 32px;
  font-weight: normal;
  color: #fff;
  position: relative;
  display: inline-block;
  letter-spacing: 1px;
`;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const [headerSearch, setHeaderSearch] = useState('');
  
  // 获取未读消息数量
  const unreadCount = useSelector(selectUnreadCount);
  const unreadCommentCount = useSelector(selectUnreadCommentCount);
  const unreadFavoriteCount = useSelector(selectUnreadFavoriteCount);
  const unreadOrderCount = useSelector(selectUnreadOrderCount);
  const unreadChatCount = useSelector(selectUnreadChatCount);
  
  // 计算总未读消息数
  const totalUnreadCount = (Number(unreadCommentCount) || 0) + 
                          (Number(unreadFavoriteCount) || 0) + 
                          (Number(unreadOrderCount) || 0) + 
                          (Number(unreadChatCount) || 0);
  
  useEffect(() => {
    if (location.pathname === '/items') {
      setHeaderSearch('');
    }
  }, [location.pathname]);
  
  // 获取未读消息数量
  useEffect(() => {
    if (isAuthenticated) {
      // 立即获取一次未读消息数量
      const fetchUnreadCounts = () => {
        dispatch(fetchUnreadMessagesCount());
        dispatch(fetchUnreadMessagesByTypeCount('COMMENT'));
        dispatch(fetchUnreadMessagesByTypeCount('FAVORITE'));
        dispatch(fetchUnreadMessagesByTypeCount('ORDER'));
        dispatch(fetchUnreadMessagesByTypeCount('CHAT'));
      };
      
      fetchUnreadCounts();
      
      // 设置轮询，每30秒更新一次未读消息数量
      const intervalId = setInterval(fetchUnreadCounts, 30000);
      
      // 清理函数
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [dispatch, isAuthenticated]);
  
  const handleSearch = (value) => {
    if (value.trim()) {
      navigate(`/items?keyword=${encodeURIComponent(value.trim())}`);
    }
  };
  
  const handleLogout = () => {
    dispatch(logout());
    // 不再 navigate('/login')
  };
  
  // 在Header组件内部添加如下useEffect
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // 定义菜单项数组，符合Ant Design v5的要求
  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
      onClick: () => navigate('/profile')
    },
    {
      key: 'orders',
      icon: <ShoppingOutlined />,
      label: '我的订单',
      onClick: () => navigate('/my/orders')
    },
    {
      key: 'items',
      icon: <AppstoreOutlined />,
      label: '我的物品',
      onClick: () => navigate('/my/items')
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
  
  const categories = [
    { name: '电子产品', link: '/items?category=electronics' },
    { name: '教材', link: '/items?category=books' },
    { name: '自行车', link: '/items?category=bikes' },
    { name: '运动鞋', link: '/items?category=shoes' },
    { name: '手机配件', link: '/items?category=accessories' }
  ];

  return (
    <div className="header-wrapper">
      <AntHeader className="header">
        <div className="container">
          <div className="header-left">
            <LogoContainer>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <LogoIcon>
                  <FontAwesomeIcon icon={faExchangeAlt} />
                </LogoIcon>
                <LogoText>交物通</LogoText>
              </Link>
            </LogoContainer>
            
            <div className="header-search">
              <Search
                placeholder="搜索物品"
                allowClear
                enterButton={<SearchOutlined style={{ fontSize: '18px' }} />}
                size="large"
                value={headerSearch}
                onChange={e => setHeaderSearch(e.target.value)}
                onSearch={handleSearch}
                className="header-search-box"
                style={{ width: '100%' }}
              />
              {/* <div className="header-tags">
                {categories.map((category, index) => (
                  <Link to={category.link} key={index}>
                    <Tag 
                      color={index === 0 ? '#00B8A9' : 'default'}
                      style={{ 
                        cursor: 'pointer', 
                        marginRight: '10px',
                        transition: 'all 0.3s',
                        borderRadius: '4px',
                        padding: '2px 8px',
                        fontSize: '12px',
                        border: 'none'
                      }}
                    >
                      {category.name}
                    </Tag>
                  </Link>
                ))}
              </div> */}
            </div>
          </div>
          
          <div className="header-right">
            <div className="nav-menu">
              <Button type="link" onClick={() => navigate('/')} className="nav-button">
                <HomeOutlined /> 首页
              </Button>
              <Button type="link" onClick={() => navigate('/items')} className="nav-button">
                <AppstoreOutlined /> 全部物品
              </Button>
              <Button type="link" onClick={() => navigate('/requests')} className="nav-button">
                <CommentOutlined /> 求购论坛
              </Button>
              <Button type="link" onClick={() => navigate('/help')} className="nav-button">
                <QuestionCircleOutlined /> 服务中心
              </Button>
            </div>
            
            <div className="header-actions">
              <Space size="middle">
                {isAuthenticated ? (
                  <>
                    <Badge count={totalUnreadCount > 0 ? totalUnreadCount : 0} size="small" className="notification-badge">
                      <Button 
                        type="text" 
                        icon={<MessageOutlined />} 
                        className="icon-button"
                        onClick={() => navigate('/my/messages')}
                      />
                    </Badge>
                    <Button 
                      type="text" 
                      icon={<HeartOutlined />} 
                      className="icon-button"
                      onClick={() => navigate('/my/favorites')}
                    />
                    <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
                      <div className="user-avatar-container">
                        <Avatar 
                          size="default" 
                          icon={<UserOutlined />} 
                          src={user?.avatarUrl} 
                          className="user-avatar"
                        />
                        <span className="username">{user?.username || '用户'}</span>
                      </div>
                    </Dropdown>
                  </>
                ) : (
                  <>
                    <Button ghost onClick={() => navigate('/login')}>登录</Button>
                    <Button type="primary" onClick={() => navigate('/register')}>注册</Button>
                  </>
                )}
              </Space>
            </div>
          </div>
        </div>
      </AntHeader>
    </div>
  );
};

export default Header; 