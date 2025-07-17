import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  Button,
  Tag,
  Typography,
  Space,
  Divider,
  Select,
  Input,
  Avatar,
  Empty,
  Pagination,
  message,
  Popconfirm
} from 'antd';
import {
  MessageOutlined,
  EyeOutlined,
  LikeOutlined,
  UserOutlined,
  SearchOutlined,
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
  CommentOutlined,
  PlusOutlined
} from '@ant-design/icons';
import {
  fetchBuyRequests,
  deleteBuyRequest,
  fetchBuyRequestComments,
  createBuyRequestComment,
  deleteBuyRequestComment
} from '../store/actions/buyRequestActions';
import {selectCategories} from "../store/slices/categorySlice";
import {fetchCategories} from "../store/actions/categoryActions";
import ConditionTag from "../components/condition/ConditionTag";
import styled from 'styled-components';
const { Title, Paragraph } = Typography;
const { Option } = Select;
const { Search } = Input;

const ForumHeaderCard = styled(Card)`
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f7f5 100%);
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0,184,169,0.08);
  margin-bottom: 24px;
  border: none;
`;

const FilterBarCard = styled(Card)`
  border-radius: 10px;
  margin-bottom: 18px;
  box-shadow: 0 2px 8px rgba(0,184,169,0.06);
  border: none;
  .ant-select, .ant-input {
    border-radius: 8px !important;
  }
`;

const PostCard = styled(Card)`
  border-radius: 16px !important;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  margin-bottom: 0;
  padding: 0;
  transition: box-shadow 0.2s, transform 0.2s;
  cursor: pointer;
  &:hover {
    box-shadow: 0 8px 24px rgba(0,184,169,0.13);
    transform: translateY(-2px) scale(1.01);
  }
`;

const UserAvatar = styled(Avatar)`
  border: 2px solid #00b8a9;
`;

const StyledTag = styled(Tag)`
  font-size: 13px;
  border-radius: 6px;
  padding: 2px 10px;
  margin-right: 6px;
`;

const ForumEmpty = styled(Empty)`
  .ant-empty-image {
    height: 80px;
  }
`;

const CenteredPagination = styled.div`
  display: flex;
  justify-content: center;
  margin: 32px 0 12px 0;
`;

const RequestForum = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const categories = useSelector(selectCategories);
  const pageSize = 8;
  const userId = localStorage.getItem('userId');

  const { list, loading, total, comments } = useSelector(state => state.buyRequest);

  useEffect(() => {
    dispatch(fetchBuyRequests({
      keyword: searchText,
      categoryId: category,
      pageNum: currentPage - 1,
      pageSize,
      sort: sortBy
    }));
  }, [dispatch, searchText, category, currentPage, sortBy]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handlePublish = () => {
    navigate('/publish-request');
  };

  const handleEdit = (id) => {
    navigate(`/publish-request/${id}`);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteBuyRequest(id, userId));
    message.success('删除成功');
    dispatch(fetchBuyRequests({
      keyword: searchText,
      category,
      pageNum: currentPage - 1,
      pageSize,
      sort: sortBy
    }));
  };

  // 评论相关
  const [commentInput, setCommentInput] = useState({}); // { [id]: '' }
  const [commentLoading, setCommentLoading] = useState({});

  const handleShowComments = (id) => {
    if (!comments[id]) {
      dispatch(fetchBuyRequestComments(id, 0, 5));
    }
  };

  const handleCommentChange = (id, value) => {
    setCommentInput(prev => ({ ...prev, [id]: value }));
  };

  const handleCommentSubmit = async (id) => {
    if (!commentInput[id]) return;
    setCommentLoading(prev => ({ ...prev, [id]: true }));
    await dispatch(createBuyRequestComment({ buyRequestId: id, content: commentInput[id] }, userId));
    setCommentInput(prev => ({ ...prev, [id]: '' }));
    dispatch(fetchBuyRequestComments(id, 0, 5));
    setCommentLoading(prev => ({ ...prev, [id]: false }));
  };

  const handleDeleteComment = async (commentId, buyRequestId) => {
    await dispatch(deleteBuyRequestComment(commentId, userId));
    message.success('评论已删除');
    dispatch(fetchBuyRequestComments(buyRequestId, 0, 5));
  };

  // 筛选、排序选项
  const sortOptions = [
    { value: 'latest', label: '最新发布' },
    { value: 'price_low', label: '价格从低到高' },
    { value: 'price_high', label: '价格从高到低' }
  ];

  // 分类选项
  const categoryOptions = [
    { value: '', label: '全部分类' },
    ...(categories || []).map(c => ({ value: c.id, label: c.name }))
  ];

  return (
    <div className="request-forum-container" style={{ maxWidth: 900, margin: '0 auto', padding: '24px 8px' }}>
      <ForumHeaderCard bordered={false}>
        <Title level={2} className="forum-title" style={{ textAlign: 'center', fontWeight: 700, marginBottom: 8, letterSpacing: 2 }}>
          <MessageOutlined style={{ color: '#00b8a9', marginRight: 8 }} /> 求购论坛
        </Title>
        <Paragraph className="forum-description" style={{ textAlign: 'center', color: '#666', marginBottom: 0, fontSize: 15 }}>
          这里是同学们发布求购信息、交流评论的地方，帮助您快速找到所需物品。
        </Paragraph>
      </ForumHeaderCard>
      <FilterBarCard bordered={false}>
        <div className="post-filter-bar" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, marginBottom: 0 }}>
          <div className="filter-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="filter-label" style={{ color: '#888', fontWeight: 500 }}><FilterOutlined /> 筛选：</span>
            <Select
              placeholder="选择物品分类"
              style={{ width: 140 }}
              allowClear
              value={category}
              onChange={v => { setCategory(v); setCurrentPage(1); }}
            >
              {categoryOptions.map(opt => (
                <Option key={opt.value} value={opt.value}>{opt.label}</Option>
              ))}
            </Select>
            <Select
              value={sortBy}
              onChange={v => { setSortBy(v); setCurrentPage(1); }}
              style={{ width: 130 }}
            >
              {sortOptions.map(opt => (
                <Option value={opt.value} key={opt.value}>{opt.label}</Option>
              ))}
            </Select>
          </div>
          <div className="filter-group" style={{ flex: 1, minWidth: 220 }}>
            <Search
              placeholder="搜索求购信息"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onSearch={handleSearch}
              style={{ width: '100%' }}
              allowClear
              onClear={() => { setSearchText(''); setCurrentPage(1); }}
              enterButton
            />
          </div>
          <div className="post-actions" style={{ minWidth: 180, textAlign: 'right' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="create-post-button"
              onClick={handlePublish}
              style={{ borderRadius: 8, fontWeight: 600, height: 40, background: 'linear-gradient(90deg, #00b8a9, #0dd8c8)', border: 'none' }}
            >
              发布求购信息
            </Button>
          </div>
        </div>
      </FilterBarCard>
      {loading ? (
        <div style={{ textAlign: 'center', margin: 40 }}>
          加载中...
        </div>
      ) : list.length > 0 ? (
        <Row gutter={[0, 18]}>
          {list.map(post => (
            <Col xs={24} key={post.id}>
              <PostCard className="post-card" hoverable onClick={() => navigate(`/request/${post.id}`)}
                bodyStyle={{ padding: 20 }}
              >
                <div className="post-card-title" style={{ fontSize: 18, fontWeight: 600, marginBottom: 6, color: '#222' }}>
                  <MessageOutlined className="post-card-title-icon" style={{ color: '#00b8a9', marginRight: 6 }} /> {post.title}
                </div>
                <div className="post-meta" style={{ color: '#888', fontSize: 14, marginBottom: 4, display: 'flex', gap: 18 }}>
                  <StyledTag color="cyan">{post.categoryName}</StyledTag>
                  <StyledTag color="orange">期望价: ¥{post.expectedPrice}{post.negotiable ? ' (可议价)' : ''}</StyledTag>
                </div>
                <div className="post-tags" style={{ marginBottom: 6 }}>
                  <ConditionTag condition={post.condition} />
                </div>
                <div className="post-content" style={{ color: '#333', fontSize: 15, marginBottom: 10, lineHeight: 1.7, maxHeight: 60, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {post.description}
                </div>
                <div className="post-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                  <div className="post-user-info" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <UserAvatar
                      src={post.userAvatar}
                      size={32}
                      icon={<UserOutlined />}
                      className="post-user-avatar"
                    />
                    <span className="post-user-name" style={{ fontWeight: 500 }}>{post.username}</span>
                  </div>
                  <div className="post-actions-menu" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="post-action-item" style={{ color: '#888', fontSize: 15 }}>
                      <CommentOutlined className="post-action-icon" /> {post.commentCount}
                    </span>
                    {String(post.userId) === String(userId) && (
                      <span onClick={e => e.stopPropagation()}>
                        <Button
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => handleEdit(post.id)}
                          style={{ marginLeft: 8, borderRadius: 6 }}
                        >编辑</Button>
                        <Popconfirm
                          title="确定要删除该求购帖吗？"
                          onConfirm={() => handleDelete(post.id)}
                          okText="删除"
                          cancelText="取消"
                          onClick={e => e.stopPropagation()}
                        >
                          <Button
                            size="small"
                            icon={<DeleteOutlined />}
                            danger
                            style={{ marginLeft: 8, borderRadius: 6 }}
                          >删除</Button>
                        </Popconfirm>
                      </span>
                    )}
                  </div>
                </div>
              </PostCard>
            </Col>
          ))}
        </Row>
      ) : (
        <ForumEmpty
          description={<span style={{ color: '#888', fontSize: 16 }}>暂无求购信息，快来发布第一个吧！</span>}
        />
      )}
      {total > pageSize && (
        <CenteredPagination>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={setCurrentPage}
            showSizeChanger={false}
            style={{ margin: '0 auto' }}
          />
        </CenteredPagination>
      )}
    </div>
  );
};

export default RequestForum; 