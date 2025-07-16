import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Tag, Popconfirm, message, Spin, Empty } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { fetchMyItems, deleteItem, updateItemStatus } from '../store/actions/itemActions';
import { selectItems, selectItemLoading } from '../store/slices/itemSlice';

const MyItems = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const myItems = useSelector(selectItems);
  const loading = useSelector(selectItemLoading);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    if (user && user.id) {
      dispatch(fetchMyItems({ pageNum: 1, pageSize: 10 }));
    }
  }, [dispatch, user]);

  const handleDelete = (id) => {
    // 删除功能已移除
  };

  const handleStatusChange = (id, status) => {
    dispatch(updateItemStatus({ id, status }))
      .then(() => {
        message.success(`物品已${status === 'ON_SALE' ? '上架' : '下架'}`);
        dispatch(fetchMyItems({ pageNum: currentPage, pageSize }));
      })
      .catch(() => {
        message.error('操作失败，请重试');
      });
  };

  const columns = [
    {
      title: '物品',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={record.images && record.images.length > 0 ? record.images[0] : 'https://via.placeholder.com/50x50?text=No+Image'} 
            alt={text}
            style={{ width: 50, height: 50, marginRight: 10, objectFit: 'cover' }}
          />
          <Link to={`/items/${record.id}`}>{text}</Link>
        </div>
      ),
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: price => `¥${price}`,
    },
    {
      title: '分类',
      dataIndex: 'categoryName',
      key: 'category',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        let color = 'blue';
        let text = '未知';
        // 物品状态：0-下架，1-上架，2-已售出
        switch(status) {
          case 1:
            color = 'green';
            text = '在售';
            break;
          case 2:
            color = 'red';
            text = '已售出';
            break;
          case 0:
            color = 'gray';
            text = '已下架';
            break;
          default:
            break;
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: time => new Date(time).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <div>
          {/* 仅非已售出物品可编辑 */}
          {(record.status !== 2 && record.status !== 'SOLD') && (
            <Button 
              type="link" 
              onClick={() => navigate(`/items/edit/${record.id}`)}
            >
              编辑
            </Button>
          )}
          {record.status === 'ON_SALE' || record.status === 1 ? (
            <Button 
              type="link" 
              onClick={() => handleStatusChange(record.id, 'OFF_SHELF')}
            >
              下架
            </Button>
          ) : null}
          {record.status === 'OFF_SHELF' || record.status === 0 ? (
            <Button 
              type="link" 
              onClick={() => handleStatusChange(record.id, 'ON_SALE')}
            >
              上架
            </Button>
          ) : null}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!myItems || myItems.length === 0) {
    return (
      <div className="my-items-container">
        <h1>我的物品</h1>
        <Empty 
          description="您还没有发布过物品" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={() => navigate('/items/publish')}>
            发布新物品
          </Button>
        </Empty>
      </div>
    );
  }

  // 优化显示顺序：上架 > 下架 > 已售出
  const sortedItems = myItems
    ? [...myItems].sort((a, b) => {
        // 1-上架，0-下架，2-已售出
        const statusOrder = (status) => {
          if (status === 1 || status === 'ON_SALE') return 0;
          if (status === 0 || status === 'OFF_SHELF') return 1;
          if (status === 2 || status === 'SOLD') return 2;
          return 3;
        };
        return statusOrder(a.status) - statusOrder(b.status);
      })
    : [];

  return (
    <div className="my-items-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>我的物品</h1>
        <Button type="primary" onClick={() => navigate('/items/publish')}>
          发布新物品
        </Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={sortedItems.map(item => ({ ...item, key: item.id }))} 
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
            dispatch(fetchMyItems({ pageNum: page, pageSize: size }));
          },
          showSizeChanger: true,
        }}
      />
    </div>
  );
};

export default MyItems; 