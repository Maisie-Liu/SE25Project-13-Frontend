import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, List, Typography, message } from 'antd';
import { fetchFavorites } from '../store/actions/favoriteActions';
import { selectFavorites, selectFavoriteLoading, selectFavoriteError } from '../store/slices/favoriteSlice';
import { selectIsAuthenticated, selectToken } from '../store/slices/authSlice';

const { Title, Text } = Typography;

const TestFavorites = () => {
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);
  const loading = useSelector(selectFavoriteLoading);
  const error = useSelector(selectFavoriteError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(selectToken);
  const [debugInfo, setDebugInfo] = useState({});

  const handleFetchFavorites = () => {
    if (!isAuthenticated) {
      message.error('请先登录');
      return;
    }

    message.info('正在获取收藏列表...');
    console.log('Auth state:', { isAuthenticated, token: token ? 'exists' : 'missing' });
    
    dispatch(fetchFavorites({ page: 0, size: 10 }))
      .unwrap()
      .then(data => {
        console.log('Favorites fetched successfully:', data);
        message.success('获取收藏列表成功');
        setDebugInfo({
          responseData: data,
          timestamp: new Date().toISOString()
        });
      })
      .catch(err => {
        console.error('Error fetching favorites:', err);
        message.error(`获取收藏列表失败: ${err}`);
        setDebugInfo({
          error: err,
          timestamp: new Date().toISOString()
        });
      });
  };

  useEffect(() => {
    if (error) {
      message.error(`收藏列表错误: ${error}`);
    }
  }, [error]);

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>收藏功能测试页面</Title>
      
      <Card title="认证状态" style={{ marginBottom: '20px' }}>
        <p>是否已登录: {isAuthenticated ? '是' : '否'}</p>
        <p>Token: {token ? '存在' : '不存在'}</p>
      </Card>
      
      <Card title="操作" style={{ marginBottom: '20px' }}>
        <Button 
          type="primary" 
          onClick={handleFetchFavorites} 
          loading={loading}
        >
          获取收藏列表
        </Button>
      </Card>
      
      <Card title="调试信息" style={{ marginBottom: '20px' }}>
        <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
      </Card>
      
      <Card title="收藏列表" style={{ marginBottom: '20px' }}>
        {loading ? (
          <Text>加载中...</Text>
        ) : favorites && favorites.length > 0 ? (
          <List
            bordered
            dataSource={favorites}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={item.name || (item.item && item.item.name)}
                  description={`价格: ¥${item.price || (item.item && item.item.price)} | 状态: ${item.status || (item.item && item.item.status)}`}
                />
              </List.Item>
            )}
          />
        ) : (
          <Text>暂无收藏</Text>
        )}
      </Card>
      
      <Card title="原始数据">
        <pre>{JSON.stringify(favorites, null, 2)}</pre>
      </Card>
    </div>
  );
};

export default TestFavorites; 