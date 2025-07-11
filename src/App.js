import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, message } from 'antd';
import { selectIsAuthenticated, selectUser } from './store/slices/authSlice';
import { fetchCurrentUser } from './store/actions/authActions';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ItemDetail from './pages/ItemDetail';
import ItemList from './pages/ItemList';
import ItemPublish from './pages/ItemPublish';
import ItemEdit from './pages/ItemEdit';
import MyItems from './pages/MyItems';
import MyOrders from './pages/MyOrders';
import OrderDetail from './pages/OrderDetail';
import UserProfile from './pages/UserProfile';
import NotFound from './pages/NotFound';
import OrderManage from './pages/OrderManage';
import EscrowPayment from './pages/EscrowPayment';
import MyFavorites from './pages/MyFavorites';
import TestFavorites from './pages/TestFavorites';
import HelpCenter from './pages/HelpCenter';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Sitemap from './pages/Sitemap';
import Messages from './pages/Messages';
import MessageComments from './pages/MessageComments';
import MessageFavorites from './pages/MessageFavorites';
import MessageOrders from './pages/MessageOrders';
import MessageChats from './pages/MessageChats';
import Chat from './pages/Chat';
import About from './pages/About';
import UserPublicProfile from './pages/UserPublicProfile';
import RequestPublish from './pages/RequestPublish';
import RequestForum from './pages/RequestForum';
import './App.css';

const { Content } = Layout;

// 需要登录才能访问的路由
const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  if (!isAuthenticated) {
    message.error('请先登录');
    return <Navigate to="/login" />;
  }
  
  return children;
};

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  // 如果已登录，获取当前用户信息
  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isAuthenticated, user]);

  return (
    <Layout className="layout">
      <Header />
      <Content className="content">
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/items" element={<ItemList />} />
            <Route path="/items/:id" element={<ItemDetail />} />
            <Route 
              path="/items/publish" 
              element={
                <PrivateRoute>
                  <ItemPublish />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/items/edit/:id" 
              element={
                <PrivateRoute>
                  <ItemEdit />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/my/items" 
              element={
                <PrivateRoute>
                  <MyItems />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/my/orders" 
              element={
                <PrivateRoute>
                  <MyOrders />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/my/favorites" 
              element={
                <PrivateRoute>
                  <MyFavorites />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/my/messages" 
              element={
                <PrivateRoute>
                  <Messages />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/my/messages/comments" 
              element={
                <PrivateRoute>
                  <MessageComments />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/my/messages/favorites" 
              element={
                <PrivateRoute>
                  <MessageFavorites />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/my/messages/orders" 
              element={
                <PrivateRoute>
                  <MessageOrders />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/my/messages/chats" 
              element={
                <PrivateRoute>
                  <MessageChats />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/chat/:chatId" 
              element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/chat" 
              element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/comments/reply/:commentId" 
              element={
                <PrivateRoute>
                  <ItemDetail />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/test/favorites" 
              element={
                <PrivateRoute>
                  <TestFavorites />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/orders/:id" 
              element={
                <PrivateRoute>
                  <OrderDetail />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/orders/manage" 
              element={
                <PrivateRoute>
                  <OrderManage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/escrow/payment/:id" 
              element={
                <PrivateRoute>
                  <EscrowPayment />
                </PrivateRoute>
              } 
            />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="/about" element={<About />} />
            <Route path="/users/:userId" element={<UserPublicProfile />} />
            <Route path="/requests" element={<RequestForum />} />
            <Route 
              path="/publish-request" 
              element={
                <PrivateRoute>
                  <RequestPublish />
                </PrivateRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default App; 