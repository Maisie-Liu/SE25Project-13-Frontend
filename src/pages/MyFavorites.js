import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, Card, Button, Typography, Empty, Spin, Pagination, message, Tag, Popconfirm } from 'antd';
import { HeartFilled, ShoppingCartOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { fetchFavorites, removeFavorite } from '../store/actions/favoriteActions';
import { selectFavorites, selectFavoriteLoading, selectFavoriteError, selectFavoritePagination } from '../store/slices/favoriteSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';

const { Title, Text, Paragraph } = Typography;

const MyFavorites = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const favorites = useSelector(selectFavorites);
  const loading = useSelector(selectFavoriteLoading);
  const error = useSelector(selectFavoriteError);
  const pagination = useSelector(selectFavoritePagination);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 获取收藏列表
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavorites({ page: currentPage - 1, size: pageSize }))
        .unwrap()
        .catch(err => {
          message.error(`获取收藏列表失败: ${err}`);
        });
    } else {
      message.error('请先登录');
      navigate('/login');
    }
  }, [dispatch, currentPage, pageSize, isAuthenticated, navigate]);

  // 显示错误信息
  useEffect(() => {
    if (error) {
      message.error(`收藏列表错误: ${error}`);
    }
  }, [error]);

  // 处理分页变化
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  // 取消收藏
  const handleRemoveFavorite = (favoriteId) => {
    if (!favoriteId) {
      message.error('收藏ID不能为空');
      return;
    }
    
    dispatch(removeFavorite(favoriteId))
      .unwrap()
      .then(() => {
        message.success('取消收藏成功');
      })
      .catch((error) => {
        message.error('取消收藏失败: ' + (error || ''));
      });
  };

  // 跳转到物品详情
  const handleViewItem = (itemId) => {
    navigate(`/items/${itemId}`);
  };

  // 渲染物品状态标签
  const renderStatusTag = (status) => {
    switch (status) {
      case 1:
        return <Tag color="green">在售</Tag>;
      case 2:
        return <Tag color="orange">已预订</Tag>;
      case 3:
        return <Tag color="red">已售出</Tag>;
      case 0:
        return <Tag color="default">已下架</Tag>;
      default:
        return <Tag color="default">未知</Tag>;
    }
  };

  // 如果未登录，重定向到登录页
  if (!isAuthenticated) {
    return null; // useEffect中已处理重定向
  }

  // 加载中状态
  if (loading && favorites.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '20px' }}>正在加载收藏列表...</div>
      </div>
    );
  }

  // 空状态
  if (!favorites || favorites.length === 0) {
    return (
      <div className="favorites-container" style={{ padding: '20px' }}>
        <Title level={2}>我的收藏</Title>
        <Empty 
          description="您还没有收藏任何物品" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={() => navigate('/items')}>
            去浏览物品
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div className="favorites-container" style={{ padding: '20px' }}>
      <Title level={2}>我的收藏</Title>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 4,
          xxl: 5,
        }}
        dataSource={favorites}
        renderItem={(favorite) => {
          const item = favorite.item || favorite;
          return (
            <List.Item>
              <Card
                hoverable
                cover={
                  <div 
                    className="item-image-container" 
                    style={{ 
                      height: '200px', 
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#f0f0f0'
                    }}
                  >
                    {item.imageUrls && item.imageUrls.length > 0 ? (
                      <img 
                        alt={item.name} 
                        src={item.imageUrls[0]} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <div style={{ color: '#999', fontSize: '14px' }}>暂无图片</div>
                    )}
                  </div>
                }
                actions={[
                  <Button 
                    type="text" 
                    icon={<ShoppingCartOutlined />} 
                    onClick={() => handleViewItem(item.id)}
                    disabled={item.status !== 1}
                  >
                    {item.status === 1 ? '购买' : '查看'}
                  </Button>,
                  <Popconfirm
                    title="确定取消收藏该物品吗？"
                    onConfirm={() => handleRemoveFavorite(item.favoriteId)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button 
                      type="text" 
                      danger
                      icon={<HeartFilled />}
                    >
                      取消收藏
                    </Button>
                  </Popconfirm>
                ]}
              >
                <Card.Meta
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Link to={`/items/${item.id}`} style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.name}
                      </Link>
                      {renderStatusTag(item.status)}
                    </div>
                  }
                  description={
                    <div>
                      <Paragraph 
                        ellipsis={{ rows: 2 }}
                        style={{ marginBottom: 8, height: '40px' }}
                      >
                        {item.description || '暂无描述'}
                      </Paragraph>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong style={{ color: '#ff4d4f', fontSize: '16px' }}>¥{item.price}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {item.createTime ? new Date(item.createTime).toLocaleDateString() : ''}
                        </Text>
                      </div>
                    </div>
                  }
                />
              </Card>
            </List.Item>
          );
        }}
      />
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={handlePageChange}
          showSizeChanger
          showQuickJumper
          showTotal={(total) => `共 ${total} 个收藏`}
        />
      </div>
    </div>
  );
};

export default MyFavorites; 