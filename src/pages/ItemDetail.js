import React, { useEffect, useState, useCallback } from 'react';
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
import { fetchItemById } from '../store/actions/itemActions';
import { createOrder } from '../store/actions/orderActions';
import { addFavorite, removeFavorite, checkIsFavorite, removeFavoriteByItemId } from '../store/actions/favoriteActions';
import { selectIsAuthenticated } from '../store/slices/authSlice';
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
  
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [orderForm] = Form.useForm();
  const [isFavorite, setIsFavorite] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  
  // 评论相关
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyingId, setReplyingId] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyingUserId, setReplyingUserId] = useState(null);
  const [replyingUsername, setReplyingUsername] = useState('');
  
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
        tradeType: values.tradeType,
        tradeLocation: values.tradeLocation,
        buyerMessage: values.buyerMessage
      };
      
      await dispatch(createOrder(orderData)).unwrap();
      message.success('预订成功');
      setOrderModalVisible(false);
      // 刷新物品状态
      dispatch(fetchItemById(id));
    } catch (error) {
      message.error('预订失败: ' + error);
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
      if (isFavorite) {
        if (currentFavorite && currentFavorite.id) {
          await dispatch(removeFavorite(currentFavorite.id)).unwrap();
        } else {
          // 如果没有收藏ID，则使用物品ID删除收藏
          await dispatch(removeFavoriteByItemId(id)).unwrap();
        }
        setIsFavorite(false);
        message.success('取消收藏成功');
      } else {
        const result = await dispatch(addFavorite(id)).unwrap();
        // 确保更新currentFavorite
        if (result) {
          // 重新获取收藏状态
          await dispatch(checkIsFavorite(id)).unwrap();
        }
        setIsFavorite(true);
        message.success('收藏成功');
      }
    } catch (error) {
      message.error('操作失败: ' + (error || ''));
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
  
  return (
    <div className="container" style={{ padding: '20px 0' }}>
      <Card>
        <Row gutter={[24, 24]}>
          {/* 物品图片 */}
          <Col xs={24} sm={24} md={12} lg={10}>
            <Image.PreviewGroup>
              <div style={{ textAlign: 'center' }}>
                <img
                  src={item.images && item.images.length > 0 ? item.images[0] : undefined}
                  alt={item.name}
                  style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                {item.images && item.images.slice(1).map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${item.name}-${index+1}`}
                    width={80}
                    height={80}
                    style={{ marginRight: 8, objectFit: 'cover' }}
                  />
                ))}
              </div>
            </Image.PreviewGroup>
          </Col>
          
          {/* 物品信息 */}
          <Col xs={24} sm={24} md={12} lg={14}>
            <Title level={2}>{item.name}</Title>
            
            <Divider />
            
            <Title level={3} type="danger" style={{ marginBottom: 24 }}>
              ￥{item.price?.toFixed(2)}
            </Title>
            
            <Descriptions column={1} bordered>
              <Descriptions.Item label="物品分类">{item.categoryName}</Descriptions.Item>
              <Descriptions.Item label="新旧程度">{<ConditionTag condition={item.condition} />}</Descriptions.Item>
              <Descriptions.Item label="浏览量">{item.popularity || 0}</Descriptions.Item>
              <Descriptions.Item label="卖家信息">
                <Space>
                  <Avatar size="small" icon={<UserOutlined />} src={item.userAvatar} />
                  {item.username}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="发布时间">{formatTime(item.createTime)}</Descriptions.Item>
              <Descriptions.Item label="物品状态">
                {item.status === 1 ? (
                  <Tag color="green">可预订</Tag>
                ) : item.status === 2 ? (
                  <Tag color="orange">已预订</Tag>
                ) : item.status === 3 ? (
                  <Tag color="red">已售出</Tag>
                ) : (
                  <Tag color="default">未上架</Tag>
                )}
              </Descriptions.Item>
            </Descriptions>
            
            <div style={{ marginTop: 24 }}>
              <Space>
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<ShoppingCartOutlined />}
                  onClick={handleOrder}
                  disabled={item.status !== 1}
                >
                  立即预订
                </Button>
                
                <Button
                  type="text"
                  icon={isFavorite ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                  onClick={handleToggleFavorite}
                  loading={favoriteLoading}
                  disabled={favoriteLoading}
                >
                  {isFavorite ? '已收藏' : '收藏'}
                </Button>
              </Space>
            </div>
            
            <div style={{ marginTop: 16 }}>
              
    
            </div>
            
            {/* 评论区 */}
            <Divider orientation="left">评论区</Divider>
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
          </Col>
        </Row>
        
        <Divider orientation="left">物品详情</Divider>
        
        <div style={{ padding: '0 16px' }}>
          <Paragraph style={{ whiteSpace: 'pre-wrap', fontSize: 16 }}>
            {item.description || '暂无描述'}
          </Paragraph>
        </div>
      </Card>
      
      {/* 预订弹窗 */}
      <Modal
        title="预订物品"
        open={orderModalVisible}
        onCancel={() => setOrderModalVisible(false)}
        footer={null}
      >
        <Form
          form={orderForm}
          layout="vertical"
          onFinish={handleSubmitOrder}
          initialValues={{
            tradeType: 1, // 默认线下交易
          }}
        >
          <Form.Item
            name="tradeType"
            label="交易方式"
            rules={[{ required: true, message: '请选择交易方式' }]}
          >
            <Radio.Group>
              <Radio value={1}>线下交易</Radio>
              <Radio value={2}>定金托管</Radio>
            </Radio.Group>
          </Form.Item>
          
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