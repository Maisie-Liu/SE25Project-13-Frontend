import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Row, Col, Pagination, Empty, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { fetchItems } from '../store/actions/itemActions';
import { selectItems, selectItemLoading, selectItemPagination } from '../store/slices/itemSlice';

const ItemList = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectItems);
  const loading = useSelector(selectItemLoading);
  const pagination = useSelector(selectItemPagination);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  useEffect(() => {
    dispatch(fetchItems({ page: currentPage, size: pageSize }));
  }, [dispatch, currentPage, pageSize]);

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="item-list-container">
      <h1>所有物品</h1>
      
      {items && items.length > 0 ? (
        <>
          <Row gutter={[16, 16]}>
            {items.map(item => (
              <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                <Link to={`/items/${item.id}`}>
                  <Card
                    hoverable
                    cover={
                      <img 
                        alt={item.title} 
                        src={item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/300x200?text=No+Image'} 
                        style={{ height: 200, objectFit: 'cover' }}
                      />
                    }
                  >
                    <Card.Meta 
                      title={item.title} 
                      description={
                        <div>
                          <p className="item-price">¥{item.price}</p>
                          <p className="item-category">{item.category}</p>
                        </div>
                      } 
                    />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
          
          <div className="pagination-container" style={{ marginTop: 24, textAlign: 'center' }}>
            <Pagination 
              current={currentPage}
              pageSize={pageSize}
              total={pagination?.total || 0}
              onChange={handlePageChange}
              showSizeChanger
              showQuickJumper
            />
          </div>
        </>
      ) : (
        <Empty description="暂无物品" />
      )}
    </div>
  );
};

export default ItemList; 