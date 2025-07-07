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
      return format(new Date(date), 'MM-dd HH:mm');
    } catch (error) {
      const d = new Date(date);
      return `${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
    }
  };
  
  // 根据关键字过滤聊天
  const getFilteredChatGroups = () => {
    const groups = Object.values(chatGroups);
    if (!keyword) return groups;
    
    return groups.filter(group => {
      const matchUser = group.otherUser?.username?.toLowerCase().includes(keyword.toLowerCase());
      const matchItem = group.itemName?.toLowerCase().includes(keyword.toLowerCase());
      const matchMessage = group.lastMessage?.toLowerCase().includes(keyword.toLowerCase());
      return matchUser || matchItem || matchMessage;
    });
  };
  
  const filteredChatGroups = getFilteredChatGroups();
  
  // 标记所有消息为已读
  const markAllAsRead = async () => {
    if (unreadCount === 0) return;
    
    try {
      await dispatch(markAllMessagesByTypeAsRead('CHAT'));
      
      // 更新本地状态
      setChatMessages(prev => 
        prev.map(msg => ({...msg, read: true}))
      );
      
      // 更新未读数量
      setUnreadCount(0);
      
      // 更新分组中的未读数
      const updatedGroups = {...chatGroups};
      Object.keys(updatedGroups).forEach(chatId => {
        updatedGroups[chatId].messages.forEach(msg => {
          msg.read = true;
        });
        updatedGroups[chatId].unreadCount = 0;
      });
      setChatGroups(updatedGroups);
      
      message.success('已全部标记为已读');
    } catch (error) {
      console.error('标记全部已读失败:', error);
      message.error('标记全部已读失败');
    }
  };
  
  // 发送消息
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChatId) return;
    
    // 这里应该调用发送消息的API
    console.log('发送消息:', newMessage, '到聊天:', selectedChatId);
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
    <div className="chat-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            type="link" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/my/messages')}
            style={{ padding: 0 }}
          />
          <Title level={3} style={{ margin: 0, marginLeft: '10px' }}>
            <MessageOutlined /> 私聊消息
            {unreadCount > 0 && (
              <Badge count={unreadCount} style={{ marginLeft: '10px', backgroundColor: '#722ed1' }} />
            )}
          </Title>
        </div>
        
        <div>
          <Button 
            type="primary" 
            icon={<MessageOutlined />}
            disabled={unreadCount === 0}
            onClick={markAllAsRead}
          >
            全部已读
          </Button>
        </div>
      </div>
      
      <div style={{ display: 'flex', height: 'calc(100vh - 180px)', gap: '20px' }}>
        {/* 左侧聊天列表 */}
        <div style={{ width: '300px', display: 'flex', flexDirection: 'column', border: '1px solid #eee', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ padding: '10px' }}>
            <Search 
              placeholder="搜索聊天、消息或用户" 
              allowClear 
              onSearch={value => setKeyword(value)} 
              style={{ width: '100%' }}
            />
          </div>
          
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Spin size="large" />
            </div>
          ) : filteredChatGroups.length > 0 ? (
            <div style={{ flex: 1, overflow: 'auto' }}>
              <List
                dataSource={filteredChatGroups}
                renderItem={group => (
                  <List.Item 
                    style={{ 
                      padding: '12px', 
                      cursor: 'pointer',
                      backgroundColor: selectedChatId === group.chatId ? '#e6f7ff' : 'transparent',
                      borderBottom: '1px solid #f0f0f0'
                    }}
                    onClick={() => selectChat(group.chatId)}
                  >
                    <List.Item.Meta
                      avatar={
                        <Badge count={group.unreadCount} offset={[-5, 5]}>
                          <Avatar 
                            src={group.otherUser?.avatarUrl} 
                            icon={<UserOutlined />} 
                            size={46}
                          />
                        </Badge>
                      }
                      title={
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Text strong style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {group.otherUser?.username || '未知用户'}
                          </Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {formatMessageTime(group.lastMessageTime)}
                          </Text>
                        </div>
                      }
                      description={
                        <>
                          <div style={{ color: '#999', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {group.lastMessage || '暂无消息'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#999', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            物品: {group.itemName || '未知物品'}
                          </div>
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Empty description="暂无聊天记录" />
            </div>
          )}
        </div>
        
        {/* 右侧聊天内容 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid #eee', borderRadius: '4px', overflow: 'hidden' }}>
          {selectedChat ? (
            <>
              {/* 聊天头部 */}
              <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', height: '60px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    src={selectedChat.otherUser?.avatarUrl} 
                    icon={<UserOutlined />} 
                    size={32}
                  />
                  <Text strong style={{ marginLeft: 8 }}>
                    {selectedChat.otherUser?.username || '未知用户'}
                  </Text>
                </div>
                <div>
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
              <div style={{ padding: '10px 20px', display: 'flex', borderBottom: '1px solid #eee' }}>
                <div style={{ width: '50px', height: '50px', marginRight: '10px' }}>
                  <img 
                    src={selectedChat.itemImage || 'https://via.placeholder.com/60?text=No+Image'} 
                    alt={selectedChat.itemName} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Text strong>{selectedChat.itemName || '未知物品'}</Text>
                </div>
              </div>
              
              {/* 聊天消息区域 */}
              <div style={{ flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#f5f5f5' }}>
                {selectedChat.messages.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {selectedChat.messages.map((msg, index) => {
                      const isSelf = Number(msg.sender?.id) === Number(currentUserId);
                      const showTime = index === 0 || 
                        new Date(msg.createdAt) - new Date(selectedChat.messages[index-1].createdAt) > 5 * 60 * 1000;
                      
                      return (
                        <React.Fragment key={msg.id}>
                          {showTime && (
                            <div style={{ textAlign: 'center', margin: '10px 0' }}>
                              <span style={{ backgroundColor: '#f0f0f0', padding: '2px 8px', borderRadius: '10px', fontSize: '12px', color: '#999' }}>
                                {formatMessageTime(msg.createdAt)}
                              </span>
                            </div>
                          )}
                          <div 
                            style={{ 
                              display: 'flex', 
                              marginBottom: '15px', 
                              alignItems: 'flex-start',
                              flexDirection: isSelf ? 'row-reverse' : 'row'
                            }}
                          >
                            <Avatar 
                              src={isSelf ? currentUser?.avatarUrl : msg.sender?.avatarUrl} 
                              icon={<UserOutlined />} 
                              size={36}
                              style={{ margin: '0 8px' }}
                            />
                            <div 
                              style={{ 
                                maxWidth: '70%', 
                                padding: '10px 15px', 
                                borderRadius: '18px',
                                backgroundColor: isSelf ? '#95ec69' : '#fff',
                                border: isSelf ? 'none' : '1px solid #e8e8e8',
                                borderTopLeftRadius: isSelf ? '18px' : '4px',
                                borderTopRightRadius: isSelf ? '4px' : '18px'
                              }}
                            >
                              <div style={{ fontSize: '14px', lineHeight: 1.6 }}>
                                {msg.content}
                              </div>
                            </div>
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
              <div style={{ backgroundColor: '#fff', borderTop: '1px solid #e8e8e8', padding: '12px 20px' }}>
                <div style={{ display: 'flex', marginBottom: '10px' }}>
                  <Button type="text" icon={<SmileOutlined />} />
                  <Button type="text" icon={<PictureOutlined />} />
                </div>
                <TextArea
                  placeholder="输入消息..."
                  autoSize={{ minRows: 2, maxRows: 4 }}
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  style={{ marginBottom: '10px', borderRadius: '18px', resize: 'none' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    type="primary" 
                    icon={<SendOutlined />} 
                    onClick={sendMessage}
                    style={{ borderRadius: '18px' }}
                  >
                    发送
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', backgroundColor: '#fff' }}>
              <Empty description="请选择一个聊天" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageChats; 