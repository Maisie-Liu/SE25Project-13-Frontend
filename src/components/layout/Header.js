import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Layout, 
  Menu, 
  Button, 
  Input, 
  Avatar, 
  Dropdown, 
  Space,
  Badge 
} from 'antd';
import { 
  UserOutlined, 
  ShoppingOutlined, 
  LogoutOutlined, 
  SettingOutlined,
  SearchOutlined,
  PlusOutlined,
  BellOutlined,
  DownOutlined
} from '@ant-design/icons';
import { selectIsAuthenticated, selectUser } from '../../store/slices/authSlice';
import { logout } from '../../store/actions/authActions';

const { Header: AntHeader } = Layout;
const { Search } = Input;

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const [searchKeyword, setSearchKeyword] = useState('');

  // 处理搜索
  const handleSearch = (value) => {
    navigate(`/items?keyword=${encodeURIComponent(value)}`);
  };

  // 处理登出
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // 用户下拉菜单
  const userMenu = [
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
      icon: <ShoppingOutlined />,
      label: '我的订单',
      onClick: () => navigate('/my/orders')
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
      onClick: () => navigate('/profile')
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

  return (
    <AntHeader className="header">
      <div className="container">
        <div className="flex-between" style={{ height: '100%' }}>
          <div className="logo" style={{ width: 120 }}>
            <Link to="/" style={{ color: '#1890ff', fontSize: '18px', fontWeight: 'bold' }}>
              校园二手
            </Link>
          </div>
          
          <div className="search-box" style={{ width: '40%' }}>
            <Search
              placeholder="搜索物品..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
            />
          </div>
          
          <Menu mode="horizontal" style={{ border: 'none', flex: 1, justifyContent: 'center' }}>
            <Menu.Item key="home" onClick={() => navigate('/')}>
              首页
            </Menu.Item>
            <Menu.Item key="items" onClick={() => navigate('/items')}>
              全部物品
            </Menu.Item>
            <Menu.Item key="categories">
              <Dropdown
                menu={{
                  items: [
                    { key: '1', label: <Link to="/items?category=1">电子产品</Link> },
                    { key: '2', label: <Link to="/items?category=2">图书教材</Link> },
                    { key: '3', label: <Link to="/items?category=3">生活用品</Link> },
                    { key: '4', label: <Link to="/items?category=4">服装鞋帽</Link> },
                    { key: '5', label: <Link to="/items?category=5">运动户外</Link> },
                    { key: '6', label: <Link to="/items?category=6">其他物品</Link> },
                  ]
                }}
              >
                <Space>
                  分类
                  <DownOutlined />
                </Space>
              </Dropdown>
            </Menu.Item>
          </Menu>
          
          <div className="user-actions">
            {isAuthenticated ? (
              <Space size="middle">
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/items/publish')}
                >
                  发布物品
                </Button>
                <Badge count={0} dot>
                  <Button 
                    shape="circle" 
                    icon={<BellOutlined />} 
                    onClick={() => navigate('/notifications')}
                  />
                </Badge>
                <Dropdown menu={{ items: userMenu }} placement="bottomRight">
                  <Space className="cursor-pointer">
                    <Avatar 
                      src={user?.avatar} 
                      icon={!user?.avatar && <UserOutlined />}
                    />
                    <span>{user?.nickname || user?.username || '用户'}</span>
                    <DownOutlined />
                  </Space>
                </Dropdown>
              </Space>
            ) : (
              <Space>
                <Button onClick={() => navigate('/login')}>登录</Button>
                <Button type="primary" onClick={() => navigate('/register')}>注册</Button>
              </Space>
            )}
          </div>
        </div>
      </div>
    </AntHeader>
  );
};

export default Header; 