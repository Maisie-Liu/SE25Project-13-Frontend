import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Menu, Card, Typography, Spin } from 'antd';
import { 
  AppstoreOutlined, MobileOutlined, LaptopOutlined, 
  BookOutlined, SkinOutlined, HomeOutlined, GiftOutlined,
  CarOutlined, ToolOutlined, EllipsisOutlined
} from '@ant-design/icons';
import { fetchCategories } from '../../store/actions/categoryActions';
import { selectCategories, selectCategoryLoading } from '../../store/slices/categorySlice';

const { Title } = Typography;

// 分类图标映射
const categoryIcons = {
  1: <MobileOutlined />, // 手机数码
  2: <LaptopOutlined />, // 电脑配件
  3: <BookOutlined />,   // 图书教材
  4: <SkinOutlined />,   // 服装配饰
  5: <HomeOutlined />,   // 生活用品
  6: <GiftOutlined />,   // 礼品玩具
  7: <CarOutlined />,    // 交通工具
  8: <ToolOutlined />,   // 运动健身
  9: <EllipsisOutlined /> // 其他
};

// 默认使用的图标
const defaultIcon = <AppstoreOutlined />;

const CategoryList = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectCategoryLoading);
  
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  
  if (loading) {
    return (
      <Card style={{ textAlign: 'center', padding: '20px 0' }}>
        <Spin />
      </Card>
    );
  }
  
  const items = categories.map(category => ({
    key: category.id,
    icon: categoryIcons[category.id] || defaultIcon,
    label: <Link to={`/category/${category.id}`}>{category.name}</Link>,
  }));
  
  return (
    <Card>
      <Title level={4}>商品分类</Title>
      <Menu 
        mode="inline"
        style={{ borderRight: 0 }}
        items={items}
      />
    </Card>
  );
};

export default CategoryList; 