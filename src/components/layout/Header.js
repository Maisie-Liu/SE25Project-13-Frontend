import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
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

  // 用户下拉菜单
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => navigate('/profile')}>
        <UserOutlined /> 个人中心
      </Menu.Item>
      <Menu.Item key="myItems" onClick={() => navigate('/my/items')}>
        <ShoppingOutlined /> 我的物品
      </Menu.Item>
      <Menu.Item key="myOrders" onClick={() => navigate('/my/orders')}>
        <ShoppingCartOutlined /> 我的订单
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout}>
        <LogoutOutlined /> 退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="header-wrapper">
      <AntHeader className="header">
        <div className="container" style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0 4px' }}>
          <div className="logo" style={{ marginRight: '24px' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
              <img 
                src="/logo.png" 
                alt="校园二手" 
                style={{ height: '38px', marginRight: '12px' }}
                onError={(e) => {e.target.style.display = 'none'}}
              />
              <span className="logo-text">校园二手</span>
            </Link>
          </div>
          
          {/* 搜索栏 */}
          <div className="header-search">
            <Search
              placeholder="搜索闲置"
              enterButton={<><SearchOutlined /> 搜索</>}
              size="large"
              onSearch={handleSearch}
              className="header-search-box"
              style={{ maxWidth: '450px' }}
            />
            <div className="hot-search-tags">
              {hotKeywords.map((keyword, index) => (
                <Tag 
                  key={index} 
                  onClick={() => handleSearch(keyword)}
                  className="hot-search-tag"
                >
                  {keyword}
                </Tag>
              ))}
            </div>
          </div>
          
          <Menu mode="horizontal" theme="dark" className="main-menu" style={{ flex: 1, background: 'transparent', border: 'none', justifyContent: 'flex-end' }}>
            <Menu.Item key="home" icon={<HomeOutlined />} onClick={() => navigate('/')}>
              首页
            </Menu.Item>
            <Menu.Item key="items" icon={<AppstoreOutlined />} onClick={() => navigate('/items')}>
              全部物品
            </Menu.Item>
            <Menu.Item key="publish" icon={<ShoppingOutlined />} onClick={() => navigate('/items/publish')}>
              发布物品
            </Menu.Item>
            <Menu.Item key="help" icon={<QuestionCircleOutlined />} onClick={() => navigate('/help')}>
              帮助中心
            </Menu.Item>
          </Menu>
          
          <div className="header-actions">
            <Space size="large">
              {isAuthenticated ? (
                <>
                  <Badge count={3} size="small">
                    <Button 
                      type="text" 
                      icon={<BellOutlined />} 
                      className="icon-button"
                      style={{ color: '#fff' }}
                      onClick={() => navigate('/notifications')}
                    />
                  </Badge>
                  <Badge count={2} size="small">
                    <Button 
                      type="text" 
                      icon={<MessageOutlined />} 
                      className="icon-button"
                      style={{ color: '#fff' }}
                      onClick={() => navigate('/messages')}
                    />
                  </Badge>
                  <Badge count={5} size="small">
                    <Button 
                      type="text" 
                      icon={<HeartOutlined />} 
                      className="icon-button"
                      style={{ color: '#fff' }}
                      onClick={() => navigate('/favorites')}
                    />
                  </Badge>
                  <Dropdown overlay={userMenu} placement="bottomRight" arrow>
                    <div className="user-avatar-container" style={{ cursor: 'pointer' }}>
                      <Avatar 
                        src={user?.avatar} 
                        icon={<UserOutlined />} 
                        size="default" 
                        className="user-avatar"
                      />
                      <span className="username" style={{ color: '#fff' }}>{user?.username || '用户'}</span>
                    </div>
                  </Dropdown>
                </>
              ) : (
                <Space>
                  <Button ghost onClick={() => navigate('/login')}>登录</Button>
                  <Button type="primary" onClick={() => navigate('/register')}>注册</Button>
                </Space>
              )}
            </Space>
          </div>
        </div>
      </AntHeader>
    </div>
  );
};

export default Header; 