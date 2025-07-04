import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Typography, 
  Button, 
  Empty, 
  Spin, 
  Card, 
  Avatar, 
  List,
  Badge,
  Input,
  message,
  Tooltip,
  Divider,
  Row,
  Col,
  Statistic
} from 'antd';
import { 
  ArrowLeftOutlined, 
  MessageOutlined,
  CommentOutlined,
  EyeOutlined,
  SearchOutlined,
  UserOutlined,
  ShopOutlined,
  SendOutlined,
  PlusOutlined,
  PictureOutlined,
  SmileOutlined,
  UnorderedListOutlined,
  FieldTimeOutlined
} from '@ant-design/icons';
import { format, formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { 
  fetchChatMessages, 
  fetchAllUserChatMessages,
  markMessageAsRead, 
  markAllMessagesByTypeAsRead,
  fetchUnreadMessagesByTypeCount
} from '../store/actions/messageActions';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { TextArea } = Input;

const MessageChats = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // 获取当前登录用户id
  const currentUserId = useSelector(state => state.auth.user?.id);
  const currentUser = useSelector(state => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [unreadCount, setUnreadCount] = useState(0);
  
  // 新增状态
  const [chatGroups, setChatGroups] = useState({}); // 按聊天ID分组的消息
  const [selectedChatId, setSelectedChatId] = useState(null); // 当前选中的聊天ID
  const [newMessage, setNewMessage] = useState(''); // 新消息输入框内容
  
  // 获取聊天消息
  useEffect(() => {
    const loadChatMessages = async () => {
      setLoading(true);
      try {
        console.log('开始获取聊天消息，页码:', pagination.current - 1, '每页数量:', pagination.pageSize);
        // 使用fetchAllUserChatMessages替代fetchChatMessages，获取包含自己发送的消息
        const result = await dispatch(fetchAllUserChatMessages(pagination.current - 1, pagination.pageSize));
        console.log('fetchAllUserChatMessages返回结果:', result);
        const response = result.payload || result;
        console.log('处理后的响应数据:', response);
        
        // 处理嵌套的响应格式
        if (response && response.code === 200 && response.data) {
          console.log('聊天消息内容:', response.data);
          const messages = response.data.list || [];
          setChatMessages(messages);
          
          // 打印当前用户ID和消息发送者ID，用于调试
          console.log('当前用户ID:', currentUserId);
          messages.forEach(msg => {
            console.log('消息ID:', msg.id, '发送者ID:', msg.sender?.id, '是否是自己:', Number(msg.sender?.id) === Number(currentUserId));
          });
          
          // 按聊天ID分组消息
          const groups = {};
          messages.forEach(msg => {
            if (!groups[msg.chatId]) {
              // 确定对方用户
              const otherUser = Number(msg.sender?.id) !== Number(currentUserId) ? msg.sender : null;
              
              groups[msg.chatId] = {
                chatId: msg.chatId,
                messages: [],
                otherUser: otherUser,
                itemId: msg.itemId,
                itemName: msg.itemName,
                itemImage: msg.itemImage,
                unreadCount: 0,
                lastMessage: null,
                lastMessageTime: null
              };
            }
            
            // 添加消息到对应分组
            groups[msg.chatId].messages.push(msg);
            
            // 更新未读数
            if (!msg.read && Number(msg.sender?.id) !== Number(currentUserId)) {
              groups[msg.chatId].unreadCount += 1;
            }
            
            // 更新最后一条消息和时间
            if (!groups[msg.chatId].lastMessageTime || new Date(msg.createdAt) > new Date(groups[msg.chatId].lastMessageTime)) {
              groups[msg.chatId].lastMessage = msg.content;
              groups[msg.chatId].lastMessageTime = msg.createdAt;
            }
          });
          
          // 按最后消息时间排序
          Object.values(groups).forEach(group => {
            group.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          });
          
          setChatGroups(groups);
          
          // 如果没有选中的聊天，默认选择第一个
          if (!selectedChatId && Object.keys(groups).length > 0) {
            setSelectedChatId(Object.keys(groups)[0]);
          }
          
          setPagination({
            ...pagination,
            total: response.data.total || 0
          });
        } else {
          console.error('响应数据格式不正确:', response);
          message.error('获取数据格式错误');
        }
        
        // 获取未读消息数量
        const unreadResult = await dispatch(fetchUnreadMessagesByTypeCount('CHAT'));
        const unreadResponse = unreadResult.payload || unreadResult;
        if (unreadResponse && unreadResponse.data !== undefined) {
          setUnreadCount(unreadResponse.data);
        }
      } catch (error) {
        console.error('获取聊天消息失败:', error);
        message.error('获取聊天消息失败');
      } finally {
        setLoading(false);
      }
    };
    
    loadChatMessages();
  }, [dispatch, pagination.current, pagination.pageSize, currentUserId]);
  
  // 标记为已读
  const markAsRead = async (messageId) => {
    try {
      await dispatch(markMessageAsRead(messageId));
      
      // 更新本地状态
      setChatMessages(prev => 
        prev.map(msg => msg.id === messageId ? {...msg, read: true} : msg)
      );
      
      // 更新未读数量
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // 更新分组中的未读数
      const updatedGroups = {...chatGroups};
      Object.keys(updatedGroups).forEach(chatId => {
        const group = updatedGroups[chatId];
        const messageIndex = group.messages.findIndex(msg => msg.id === messageId);
        if (messageIndex >= 0) {
          group.messages[messageIndex].read = true;
          group.unreadCount = Math.max(0, group.unreadCount - 1);
        }
      });
      setChatGroups(updatedGroups);
      
      message.success('已标记为已读');
    } catch (error) {
      console.error('标记已读失败:', error);
      message.error('标记已读失败');
    }
  };
  
  // 标记聊天中所有消息为已读
  const markChatAsRead = async (chatId) => {
    const group = chatGroups[chatId];
    if (!group || group.unreadCount === 0) return;
    
    try {
      // 找出该聊天中所有未读消息
      const unreadMessages = group.messages.filter(msg => !msg.read && Number(msg.sender?.id) !== Number(currentUserId));
      
      // 逐个标记为已读
      for (const msg of unreadMessages) {
        await dispatch(markMessageAsRead(msg.id));
      }
      
      // 更新本地状态
      setChatMessages(prev => 
        prev.map(msg => msg.chatId === chatId && !msg.read ? {...msg, read: true} : msg)
      );
      
      // 更新未读数量
      setUnreadCount(prev => Math.max(0, prev - unreadMessages.length));
      
      // 更新分组中的未读数
      const updatedGroups = {...chatGroups};
      if (updatedGroups[chatId]) {
        updatedGroups[chatId].messages.forEach(msg => {
          if (!msg.read) msg.read = true;
        });
        updatedGroups[chatId].unreadCount = 0;
      }
      setChatGroups(updatedGroups);
      
    } catch (error) {
      console.error('标记聊天已读失败:', error);
      message.error('标记聊天已读失败');
    }
  };
  
  // 格式化时间
  const formatTime = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: zhCN });
    } catch (error) {
      const d = new Date(date);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
    }
  };
  
  // 格式化消息时间（聊天界面用）
  const formatMessageTime = (date) => {
    try {
      const messageDate = new Date(date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      // 如果是今天的消息，只显示时间
      if (messageDate.toDateString() === today.toDateString()) {
        return format(messageDate, 'HH:mm');
      }
      // 如果是昨天的消息，显示"昨天 时间"
      else if (messageDate.toDateString() === yesterday.toDateString()) {
        return `昨天 ${format(messageDate, 'HH:mm')}`;
      }
      // 其他情况显示完整日期和时间
      else {
        return format(messageDate, 'yyyy-MM-dd HH:mm');
      }
    } catch (error) {
      const d = new Date(date);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
    }
  };
  
  // 过滤聊天组
  const getFilteredChatGroups = () => {
    let filtered = Object.values(chatGroups);
    
    // 按关键词搜索
    if (keyword) {
      filtered = filtered.filter(
        group => 
          (group.lastMessage && group.lastMessage.includes(keyword)) ||
          (group.itemName && group.itemName.includes(keyword)) ||
          (group.otherUser && group.otherUser.username && group.otherUser.username.includes(keyword))
      );
    }
    
    // 按最后消息时间排序
    return filtered.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
  };
  
  const filteredChatGroups = getFilteredChatGroups();
  const totalUnreadCount = Object.values(chatGroups).reduce((total, group) => total + group.unreadCount, 0);
  
  // 所有聊天消息标为已读
  const markAllAsRead = async () => {
    if (totalUnreadCount === 0) return;
    
    try {
      await dispatch(markAllMessagesByTypeAsRead('CHAT'));
      
      // 更新本地状态
      setChatMessages(prev => 
        prev.map(msg => ({...msg, read: true}))
      );
      
      // 更新分组中的未读数
      const updatedGroups = {...chatGroups};
      Object.keys(updatedGroups).forEach(chatId => {
        updatedGroups[chatId].messages.forEach(msg => {
          msg.read = true;
        });
        updatedGroups[chatId].unreadCount = 0;
      });
      setChatGroups(updatedGroups);
      
      setUnreadCount(0);
      
      message.success('已将所有聊天消息标记为已读');
    } catch (error) {
      console.error('标记全部已读失败:', error);
      message.error('标记全部已读失败');
    }
  };
  
  // 发送新消息（这里只是模拟，实际需要调用API）
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChatId) {
      return;
    }
    
    // 这里应该调用API发送消息
    message.success('消息发送功能尚未实现');
    setNewMessage('');
  };
  
  // 查看物品详情
  const viewItemDetail = (itemId) => {
    if (itemId) {
      navigate(`/items/${itemId}`);
    }
  };
  
  // 选择聊天
  const selectChat = (chatId) => {
    setSelectedChatId(chatId);
    markChatAsRead(chatId);
  };
  
  // 获取当前选中的聊天
  const selectedChat = selectedChatId ? chatGroups[selectedChatId] : null;
  
  return (
    <div className="chat-page">
      <div className="chat-header">
        <Button 
          type="link" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/my/messages')}
          style={{ padding: 0 }}
        />
        <Title level={3} className="chat-title">
          <MessageOutlined /> 私聊消息
          {totalUnreadCount > 0 && (
            <Badge count={totalUnreadCount} style={{ marginLeft: '10px', backgroundColor: '#722ed1' }} />
          )}
        </Title>
        
        <div className="chat-actions">
          <Button 
            type="primary" 
            icon={<MessageOutlined />}
            disabled={totalUnreadCount === 0}
            onClick={markAllAsRead}
          >
            全部已读
          </Button>
        </div>
      </div>
      
      <div className="chat-container">
        {/* 左侧聊天列表 */}
        <div className="chat-sidebar">
          <div className="chat-search">
            <Search 
              placeholder="搜索聊天、消息或用户" 
              allowClear 
              onSearch={value => setKeyword(value)} 
            />
          </div>
          
          {loading ? (
            <div className="loading-container">
              <Spin size="large" />
            </div>
          ) : filteredChatGroups.length > 0 ? (
            <List
              className="chat-list"
              dataSource={filteredChatGroups}
              renderItem={group => (
                <List.Item 
                  className={`chat-list-item ${selectedChatId === group.chatId ? 'selected' : ''}`}
                  onClick={() => selectChat(group.chatId)}
                >
                  <div className="chat-list-avatar">
                    <Badge count={group.unreadCount} offset={[-5, 5]}>
                      <Avatar 
                        src={group.otherUser?.avatarUrl} 
                        icon={<UserOutlined />} 
                        size={46}
                      />
                    </Badge>
                  </div>
                  <div className="chat-list-content">
                    <div className="chat-list-header">
                      <Text strong className="chat-list-name">
                        {group.otherUser?.username || '未知用户'}
                      </Text>
                      <Text type="secondary" className="chat-list-time">
                        {formatMessageTime(group.lastMessageTime)}
                      </Text>
                    </div>
                    <div className="chat-list-message">
                      <Text type="secondary" ellipsis>
                        {group.lastMessage || '暂无消息'}
                      </Text>
                    </div>
                    <div className="chat-list-item-info">
                      <Text type="secondary" className="chat-item-name" ellipsis>
                        物品: {group.itemName || '未知物品'}
                      </Text>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <Empty description="暂无聊天记录" />
          )}
        </div>
        
        {/* 右侧聊天内容 */}
        <div className="chat-main">
          {selectedChat ? (
            <>
              {/* 聊天头部 */}
              <div className="chat-main-header">
                <div className="chat-main-user">
                  <Avatar 
                    src={selectedChat.otherUser?.avatarUrl} 
                    icon={<UserOutlined />} 
                    size={32}
                  />
                  <Text strong style={{ marginLeft: 8 }}>
                    {selectedChat.otherUser?.username || '未知用户'}
                  </Text>
                </div>
                <div className="chat-main-actions">
                  <Button 
                    type="text" 
                    icon={<ShopOutlined />}
                    onClick={() => viewItemDetail(selectedChat.itemId)}
                  >
                    查看物品
                  </Button>
                </div>
              </div>
              
              {/* 聊天物品信息 */}
              <div className="chat-item-info">
                <div className="chat-item-image">
                  <img 
                    src={selectedChat.itemImage || 'https://via.placeholder.com/60?text=No+Image'} 
                    alt={selectedChat.itemName} 
                  />
                </div>
                <div className="chat-item-details">
                  <Text strong>{selectedChat.itemName || '未知物品'}</Text>
                </div>
              </div>
              
              {/* 聊天消息区域 */}
              <div className="chat-messages-container">
                {selectedChat.messages.length > 0 ? (
                  <div className="chat-messages">
                    {selectedChat.messages.map((msg, index) => {
                      // 调试输出
                      console.log('渲染消息:', msg.id, '发送者ID:', msg.sender?.id, '当前用户ID:', currentUserId, '是否是自己:', Number(msg.sender?.id) === Number(currentUserId));
                      
                      const isSelf = Number(msg.sender?.id) === Number(currentUserId);
                      const showTime = index === 0 || 
                        new Date(msg.createdAt) - new Date(selectedChat.messages[index-1].createdAt) > 5 * 60 * 1000;
                      
                      return (
                        <React.Fragment key={msg.id}>
                          {showTime && (
                            <div className="chat-time-divider">
                              <span>{formatMessageTime(msg.createdAt)}</span>
                            </div>
                          )}
                          <div className={`chat-message ${isSelf ? 'self' : 'other'}`}>
                            {!isSelf && (
                              <div className="chat-avatar">
                                <Avatar 
                                  src={msg.sender?.avatarUrl} 
                                  icon={<UserOutlined />} 
                                  size={36}
                                />
                              </div>
                            )}
                            <div className="chat-bubble">
                              <div className="chat-content">{msg.content}</div>
                            </div>
                            {isSelf && (
                              <div className="chat-avatar">
                                <Avatar 
                                  src={currentUser?.avatarUrl} 
                                  icon={<UserOutlined />} 
                                  size={36}
                                />
                              </div>
                            )}
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                ) : (
                  <Empty description="暂无聊天记录" />
                )}
              </div>
              
              {/* 聊天输入区域 */}
              <div className="chat-input-area">
                <div className="chat-toolbar">
                  <Button type="text" icon={<SmileOutlined />} />
                  <Button type="text" icon={<PictureOutlined />} />
                </div>
                <div className="chat-input">
                  <TextArea 
                    placeholder="输入消息..." 
                    autoSize={{ minRows: 2, maxRows: 4 }}
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onPressEnter={(e) => {
                      if (!e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                </div>
                <div className="chat-send">
                  <Button 
                    type="primary" 
                    icon={<SendOutlined />} 
                    onClick={sendMessage}
                  >
                    发送
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="chat-empty">
              <Empty description="请选择一个聊天" />
            </div>
          )}
        </div>
      </div>
      
      {/* 添加CSS样式 */}
      <style jsx="true">{`
        .chat-page {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 64px);
          background-color: #f5f5f5;
        }
        
        .chat-header {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          background-color: #fff;
          border-bottom: 1px solid #e8e8e8;
          height: 60px;
        }
        
        .chat-title {
          margin: 0 0 0 10px !important;
          flex: 1;
        }
        
        .chat-container {
          display: flex;
          flex: 1;
          overflow: hidden;
        }
        
        .chat-sidebar {
          width: 280px;
          border-right: 1px solid #e8e8e8;
          background-color: #fff;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .chat-search {
          padding: 10px;
          border-bottom: 1px solid #e8e8e8;
        }
        
        .chat-list {
          flex: 1;
          overflow-y: auto;
        }
        
        .chat-list-item {
          display: flex;
          padding: 12px;
          cursor: pointer;
          transition: background-color 0.3s;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .chat-list-item:hover {
          background-color: #f5f5f5;
        }
        
        .chat-list-item.selected {
          background-color: #e6f7ff;
        }
        
        .chat-list-avatar {
          margin-right: 12px;
          flex-shrink: 0;
        }
        
        .chat-list-content {
          flex: 1;
          min-width: 0;
          overflow: hidden;
        }
        
        .chat-list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }
        
        .chat-list-name {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .chat-list-time {
          font-size: 12px;
          flex-shrink: 0;
          margin-left: 8px;
        }
        
        .chat-list-message {
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .chat-list-item-info {
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          background-color: #f5f5f5;
          overflow: hidden;
        }
        
        .chat-main-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 20px;
          background-color: #fff;
          border-bottom: 1px solid #e8e8e8;
          height: 60px;
          flex-shrink: 0;
        }
        
        .chat-main-user {
          display: flex;
          align-items: center;
        }
        
        .chat-item-info {
          display: flex;
          padding: 10px 20px;
          background-color: #fff;
          border-bottom: 1px solid #e8e8e8;
          flex-shrink: 0;
        }
        
        .chat-item-image {
          width: 50px;
          height: 50px;
          margin-right: 10px;
          flex-shrink: 0;
        }
        
        .chat-item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 4px;
        }
        
        .chat-item-details {
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: center;
        }
        
        .chat-messages-container {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          background-color: #f5f5f5;
        }
        
        .chat-messages {
          display: flex;
          flex-direction: column;
        }
        
        .chat-time-divider {
          text-align: center;
          margin: 10px 0;
        }
        
        .chat-time-divider span {
          background-color: #f0f0f0;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 12px;
          color: #999;
        }
        
        .chat-message {
          display: flex;
          margin-bottom: 15px;
          align-items: flex-start;
          width: 100%;
        }
        
        .chat-message.self {
          flex-direction: row-reverse;
        }
        
        .chat-avatar {
          margin: 0 8px;
          flex-shrink: 0;
        }
        
        .chat-bubble {
          max-width: 70%;
          padding: 10px 15px;
          border-radius: 18px;
          word-break: break-word;
          position: relative;
        }
        
        .chat-message.other .chat-bubble {
          background-color: #fff;
          border: 1px solid #e8e8e8;
          border-top-left-radius: 4px;
        }
        
        .chat-message.self .chat-bubble {
          background-color: #95ec69;
          border-top-right-radius: 4px;
        }
        
        .chat-content {
          font-size: 14px;
          line-height: 1.6;
        }
        
        .chat-input-area {
          background-color: #fff;
          border-top: 1px solid #e8e8e8;
          padding: 12px 20px;
          flex-shrink: 0;
        }
        
        .chat-toolbar {
          display: flex;
          margin-bottom: 10px;
        }
        
        .chat-input {
          margin-bottom: 10px;
        }
        
        .chat-input .ant-input {
          border-radius: 18px;
          resize: none;
        }
        
        .chat-send {
          display: flex;
          justify-content: flex-end;
        }
        
        .chat-send .ant-btn {
          border-radius: 18px;
        }
        
        .chat-empty {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          background-color: #fff;
        }
        
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default MessageChats; 