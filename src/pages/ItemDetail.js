import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Row, Col, Card, Typography, Button, Image, Tag, Descriptions, Divider, 
  Spin, message, Modal, Form, Input, Radio, Space, Avatar
} from 'antd';
import { 
  ShoppingCartOutlined, HeartOutlined, HeartFilled, 
  EnvironmentOutlined, CommentOutlined, ShareAltOutlined,
  UserOutlined, ClockCircleOutlined, SafetyOutlined
} from '@ant-design/icons';
import { fetchItemById, updateUserProfileInterest } from '../store/actions/itemActions';
import { createOrder } from '../store/actions/orderActions';
import { selectIsAuthenticated, selectUser } from '../store/slices/authSlice';
import { addFavorite, removeFavorite, checkIsFavorite, removeFavoriteByItemId } from '../store/actions/favoriteActions';
import { selectItemDetail, selectItemLoading } from '../store/slices/itemSlice';
import { selectCurrentFavorite } from '../store/slices/favoriteSlice';
import CommentList from '../components/comment/CommentList';
import CommentForm from '../components/comment/CommentForm';
import axios from '../utils/axios';
import ConditionTag from '../components/condition/ConditionTag';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const item = useSelector(selectItemDetail);
  const loading = useSelector(selectItemLoading);
  const currentFavorite = useSelector(selectCurrentFavorite);
  const user = useSelector(selectUser);
  
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [orderForm] = Form.useForm();
  const [isFavorite, setIsFavorite] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [mainIndex, setMainIndex] = useState(0);
  
  // 评论相关
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyingId, setReplyingId] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyingUserId, setReplyingUserId] = useState(null);
  const [replyingUsername, setReplyingUsername] = useState('');
  
  // 浏览量
  // const [viewCount, setViewCount] = useState(0); // 移除本地 viewCount 状态
  
  // 获取物品详情
  useEffect(() => {
    if (id && !hasLoaded) {
      dispatch(fetchItemById(id));
      
      // 检查是否已收藏
      if (isAuthenticated) {
        setFavoriteLoading(true);
        dispatch(checkIsFavorite(id))
          .unwrap()
          .then(response => {
            setIsFavorite(!!response);
          })
          .catch(() => {
            setIsFavorite(false);
          })
          .finally(() => {
            setFavoriteLoading(false);
          });
      }
      
      setHasLoaded(true);
    }
  }, [dispatch, id, hasLoaded, isAuthenticated]);
  
  // 重置加载状态（当 id 改变时）
  useEffect(() => {
    setHasLoaded(false);
    setIsFavorite(false);
  }, [id]);
  
  // 获取评论
  const fetchComments = async () => {
    if (!id) return;
    setCommentLoading(true);
    try {
      const res = await axios.get(`/comments/items/${id}`);
      setComments(res.data.data || []);
    } catch (e) {
      message.error('获取评论失败');
    } finally {
      setCommentLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [id]);
  
  // 处理预订
  const handleOrder = () => {
    if (!isAuthenticated) {
      message.warning('请先登录');
      navigate('/login');
      return;
    }
    if (item.userId === user?.id) {
      message.error('不能购买自己的商品');
      return;
    }
    if (item.status !== 1) {
      message.warning('该物品当前不可预订');
      return;
    }
    setOrderModalVisible(true);
  };
  
  // 提交预订
  const handleSubmitOrder = async (values) => {
    if (!isAuthenticated) {
      message.warning('请先登录');
      navigate('/login');
      return;
    }
    setSubmitting(true);
    try {
      const orderData = {
        itemId: id,
        tradeType: 1, // 只允许线下交易
        tradeLocation: values.tradeLocation,
        buyerMessage: values.buyerMessage
      };
      await dispatch(createOrder(orderData)).unwrap();
      message.success('预订成功');
      setOrderModalVisible(false);
      dispatch(fetchItemById(id));
    } catch (error) {
      message.error(error?.message || error?.response?.data?.message || '预订失败');
    } finally {
      setSubmitting(false);
    }
  };
  
  // 使用useCallback包装处理收藏函数，防止重复渲染
  const handleToggleFavorite = useCallback(async () => {
    if (!isAuthenticated) {
      message.warning('请先登录');
      navigate('/login');
      return;
    }
    
    // 如果正在加载中，防止重复点击
    if (favoriteLoading) {
      return;
    }
    
    setFavoriteLoading(true);
    
    try {
      console.log("收藏操作 - 当前状态:", { isFavorite, currentFavorite, itemId: id });
      
      if (isFavorite) {
        // 取消收藏
        if (currentFavorite && currentFavorite.favoriteId) {
          console.log("取消收藏 - 使用favoriteId:", currentFavorite.favoriteId);
          await dispatch(removeFavorite(currentFavorite.favoriteId)).unwrap();
        } else {
          // 如果没有收藏ID，则使用物品ID删除收藏
          console.log("取消收藏 - 使用itemId:", id);
          await dispatch(removeFavoriteByItemId(id)).unwrap();
        }
        setIsFavorite(false);
        message.success('取消收藏成功');
      } else {
        // 添加收藏
        console.log("添加收藏 - itemId:", id);
        const result = await dispatch(addFavorite(id)).unwrap();
        console.log("添加收藏结果:", result);
        
        // 确保更新currentFavorite
        if (result) {
          // 重新获取收藏状态
          await dispatch(checkIsFavorite(id)).unwrap();
        }
        setIsFavorite(true);
        message.success('收藏成功');
      }
    } catch (error) {
      console.error("收藏操作失败:", error);
      message.error('操作失败: ' + (error?.message || '未知错误'));
    } finally {
      setFavoriteLoading(false);
    }
  }, [isAuthenticated, favoriteLoading, isFavorite, currentFavorite, id, dispatch, navigate]);
  
  // 格式化时间
  const formatTime = (time) => {
    if (!time) return '';
    return new Date(time).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // 发表评论
  const handleSubmitComment = async () => {
    if (!isAuthenticated) {
      message.warning('请先登录');
      navigate('/login');
      return;
    }
    if (!commentContent.trim()) {
      message.warning('评论内容不能为空');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post('/comments', {
        content: commentContent,
        itemId: id
      });
      setCommentContent('');
      fetchComments();
      message.success('评论成功');
    } catch (e) {
      message.error('评论失败');
    } finally {
      setSubmitting(false);
    }
  };

  // 回复评论
  const handleReply = (commentId, userId, username) => {
    setReplyingId(commentId);
    setReplyingUserId(userId);
    setReplyingUsername(username);
    setReplyContent('');
  };
  const handleSubmitReply = async (parentComment) => {
    if (!isAuthenticated) {
      message.warning('请先登录');
      navigate('/login');
      return;
    }
    if (!replyContent.trim()) {
      message.warning('回复内容不能为空');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post('/comments', {
        content: replyContent,
        itemId: id,
        parentId: parentComment.id,
        replyUserId: parentComment.userId
      });
      setReplyContent('');
      setReplyingId(null);
      fetchComments();
      message.success('回复成功');
    } catch (e) {
      message.error('回复失败');
    } finally {
      setSubmitting(false);
    }
  };
  
  // 在 ItemDetail 组件内添加私聊跳转逻辑
  const handleGoToChat = () => {
    if (!isAuthenticated) {
      message.warning('请先登录');
      navigate('/login');
      return;
    }
    if (item.userId === user?.id) {
      message.info('不能和自己私聊');
      return;
    }
    // 假设 chat 页面支持 /chat?userId=xxx 或 /chat/xxx
    navigate(`/chat?userId=${item.userId}&itemId=${item.id}`);
  };
  
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }
  
  if (!item) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Title level={3}>物品不存在或已被删除</Title>
        <Button type="primary" onClick={() => navigate('/')}>返回首页</Button>
      </div>
    );
  }
  
  // 获取图片数组，兼容 imageUrls 和 images 字段
  const images = item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls : item.images;
  
  return (
    <div className="container" style={{ padding: '20px 0' }}>
      <Card className="item-detail-card">
        <Row gutter={[32, 24]}>
          {/* 物品图片 */}
          <Col xs={24} sm={24} md={12} lg={10}>
            <div className="item-image-container">
            <Image.PreviewGroup>
                <div className="main-image-wrapper">
                  {images && images.length > 0 ? (
                    <img
                      src={images[mainIndex]}
                      alt={item.name}
                      className="main-item-image"
                />
                  ) : (
                    <div style={{width: '100%', height: '100%', background: '#f5f5f5', position: 'absolute', top: 0, left: 0}} />
                  )}
                </div>
              </Image.PreviewGroup>
            </div>
            
            {/* 缩略图 - 移到外部，不影响主图容器比例 */}
            {images && images.length > 1 && (
              <div className="thumbnail-list" style={{marginTop: '20px'}}>
                {images.map((img, index) => (
                  <div
                    key={index}
                    className={`thumbnail-container${mainIndex === index ? ' active' : ''}`}
                    onClick={() => setMainIndex(index)}
                  >
                    <img
                      src={img}
                      alt={`${item.name}-${index+1}`}
                      className={`thumbnail-image${mainIndex === index ? ' selected' : ''}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </Col>
          
          {/* 物品信息 */}
          <Col xs={24} sm={24} md={12} lg={14}>
            <div className="item-info-container">
              <div className="item-header">
            <Title level={2}>{item.name}</Title>
                <div className="item-status-tag">
                {item.status === 1 ? (
                  <Tag color="green">可预订</Tag>
                ) : item.status === 2 ? (
                  <Tag color="orange">已预订</Tag>
                ) : item.status === 3 ? (
                  <Tag color="red">已售出</Tag>
                ) : (
                  <Tag color="default">未上架</Tag>
                )}
                </div>
              </div>
              
              <div className="item-price-section">
                <Title level={3} type="danger">
                  ￥{item.price?.toFixed(2)}
                </Title>
              </div>
              
              {/* 物品描述 */}
              <div className="item-description-card">
                <div className="item-description-header">
                  <SafetyOutlined /> 物品描述
                </div>
                <Paragraph style={{ whiteSpace: 'pre-wrap', fontSize: 15, padding: '12px' }}>
                  {item.description || '暂无描述'}
                </Paragraph>
              </div>
              
              <div className="item-meta-info">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div className="item-meta-item">
                      <span className="item-meta-label">物品分类</span>
                      <span className="item-meta-value">{item.categoryName}</span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="item-meta-item">
                      <span className="item-meta-label">新旧程度</span>
                      <span className="item-meta-value"><ConditionTag condition={item.condition} /></span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="item-meta-item">
                      <span className="item-meta-label">浏览量</span>
                      <span className="item-meta-value">{item.popularity || 0}</span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="item-meta-item">
                      <span className="item-meta-label">库存</span>
                      <span className="item-meta-value">
                        {item.stock > 0 ? item.stock : <span style={{color:'red'}}>已售罄</span>}
                      </span>
                    </div>
                  </Col>
                </Row>
              </div>
              
              <div className="item-seller-info">
                <div className="seller-avatar" onClick={() => navigate(`/users/${item.userId}`)} style={{ cursor: 'pointer' }}>
                  <Avatar size="small" icon={<UserOutlined />} src={item.userAvatar} />
                </div>
                <div className="seller-details">
                  <span 
                    className="seller-name" 
                    onClick={() => navigate(`/users/${item.userId}`)} 
                    style={{ cursor: 'pointer' }}
                  >
                    {item.username}
                  </span>
                  <span className="publish-time">
                    <ClockCircleOutlined /> {formatTime(item.createTime)}
                  </span>
                </div>
              </div>
              
              <div className="item-actions">
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<ShoppingCartOutlined />}
                  onClick={handleOrder}
                  disabled={item.status !== 1 || item.stock <= 0}
                  className="order-button"
                >
                  立即预订
                </Button>
                
                <Button
                  className="favorite-button"
                  icon={isFavorite ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                  onClick={handleToggleFavorite}
                  loading={favoriteLoading}
                  disabled={favoriteLoading}
                >
                  {isFavorite ? '已收藏' : '收藏'}
                </Button>
            </div>
              
              {/* 评论区 - 上移 */}
              <div className="comments-section">
                <div className="comments-header">
                  <CommentOutlined /> 评论区
            </div>
            <CommentForm
              value={commentContent}
              onChange={setCommentContent}
              onSubmit={handleSubmitComment}
              submitting={submitting && !replyingId}
            />
            <CommentList
              comments={comments}
              onReply={handleReply}
              submitting={submitting && !!replyingId}
              replyContent={replyContent}
              onChangeReply={setReplyContent}
              onSubmitReply={handleSubmitReply}
              replyingId={replyingId}
            />
              </div>
            </div>
          </Col>
        </Row>
      </Card>
      
      {/* 预订弹窗 */}
      <Modal
        title="预订物品"
        open={orderModalVisible}
        onCancel={() => setOrderModalVisible(false)}
        footer={null}
        className="order-modal"
      >
        <Form
          form={orderForm}
          layout="vertical"
          onFinish={handleSubmitOrder}
          initialValues={{
            tradeType: 1, // 默认线下交易
          }}
        >
          {/* 删除交易方式选择，只保留线下交易 */}
          {/* <Form.Item
            name="tradeType"
            label="交易方式"
            rules={[{ required: true, message: '请选择交易方式' }]}
          >
            <Radio.Group>
              <Radio value={2}>线上交易</Radio>
              <Radio value={1}>线下交易</Radio>
            </Radio.Group>
          </Form.Item> */}
          <Form.Item
            name="tradeLocation"
            label="交易地点"
            rules={[{ required: true, message: '请输入交易地点' }]}
          >
            <Input 
              prefix={<EnvironmentOutlined />} 
              placeholder="请输入交易地点，如：学校图书馆门口" 
            />
          </Form.Item>
          <Form.Item
            name="buyerMessage"
            label="买家留言"
          >
            <TextArea 
              rows={4} 
              placeholder="可以留言给卖家，如：期望的交易时间、特殊要求等" 
            />
          </Form.Item>
          <Form.Item>
            <div style={{ textAlign: 'right' }}>
              <Button 
                style={{ marginRight: 8 }} 
                onClick={() => setOrderModalVisible(false)}
              >
                取消
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={submitting}
              >
                确认预订
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ItemDetail; 