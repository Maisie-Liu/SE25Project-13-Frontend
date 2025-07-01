import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Form, Input, Select, Button, Card, Typography, 
  Slider, Space, Divider, Row, Col, Upload, message 
} from 'antd';
import { 
  SearchOutlined, FilterOutlined, 
  CameraOutlined, SortAscendingOutlined 
} from '@ant-design/icons';
import { selectCategories } from '../../store/slices/categorySlice';

const { Title } = Typography;
const { Option } = Select;

const AdvancedSearch = ({ onSearch }) => {
  const navigate = useNavigate();
  const categories = useSelector(selectCategories);
  const [form] = Form.useForm();
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [fileList, setFileList] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  
  // 处理搜索提交
  const handleSubmit = (values) => {
    // 构建搜索参数
    const searchParams = {
      keyword: values.keyword,
      categoryId: values.categoryId,
      minPrice: values.priceRange?.[0] || undefined,
      maxPrice: values.priceRange?.[1] || undefined,
      condition: values.condition,
      sort: values.sort || 'createTime',
      order: values.order || 'desc',
    };
    
    // 过滤掉undefined值
    const filteredParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, v]) => v !== undefined)
    );
    
    // 执行搜索回调
    if (onSearch) {
      onSearch(filteredParams);
    } else {
      // 如果没有提供回调，则通过URL参数导航到搜索页面
      const queryString = new URLSearchParams(filteredParams).toString();
      navigate(`/search?${queryString}`);
    }
  };
  
  // 处理图片上传并搜索
  const handleImageSearch = (info) => {
    if (info.file.status === 'uploading') {
      setUploadLoading(true);
      return;
    }
    
    if (info.file.status === 'done') {
      setUploadLoading(false);
      // 这里应该调用后端的图像识别API，获取识别结果
      message.success('图片上传成功，正在分析...');
      
      // 模拟识别结果，实际项目中应调用后端API
      setTimeout(() => {
        const recognizedKeyword = '书籍'; // 假设识别结果
        form.setFieldsValue({ keyword: recognizedKeyword });
        message.success(`识别结果: ${recognizedKeyword}`);
      }, 1500);
    } else if (info.file.status === 'error') {
      setUploadLoading(false);
      message.error('图片上传失败');
    }
  };
  
  // 重置表单
  const handleReset = () => {
    form.resetFields();
    setPriceRange([0, 10000]);
    setFileList([]);
  };
  
  // 上传图片按钮
  const uploadButton = (
    <div>
      <CameraOutlined style={{ fontSize: 24 }} />
      <div style={{ marginTop: 8 }}>拍照搜索</div>
    </div>
  );
  
  return (
    <Card>
      <Title level={4}>高级搜索</Title>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          sort: 'createTime',
          order: 'desc',
        }}
      >
        <Form.Item name="keyword">
          <Input.Search
            placeholder="搜索物品名称、描述等"
            enterButton={<SearchOutlined />}
            allowClear
            size="large"
            onSearch={() => form.submit()}
          />
        </Form.Item>
        
        <Upload
          name="image"
          listType="picture-card"
          className="upload-list-inline"
          showUploadList={false}
          action="/items/image-search" // 实际项目中应使用正确的API路径
          onChange={handleImageSearch}
          fileList={fileList}
          beforeUpload={(file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
              message.error('只能上传图片文件!');
              return false;
            }
            return true;
          }}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        
        <Divider orientation="left">筛选条件</Divider>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="categoryId" label="物品分类">
              <Select placeholder="选择分类" allowClear>
                {categories.map(category => (
                  <Option key={category.id} value={category.id}>{category.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item name="condition" label="新旧程度">
              <Select placeholder="选择新旧程度" allowClear>
                <Option value={5}>全新</Option>
                <Option value={4}>9成新</Option>
                <Option value={3}>7成新</Option>
                <Option value={2}>5成新</Option>
                <Option value={1}>3成新以下</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item name="priceRange" label="价格区间">
          <Slider
            range
            min={0}
            max={10000}
            value={priceRange}
            onChange={setPriceRange}
            tipFormatter={value => `¥${value}`}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>¥{priceRange[0]}</span>
            <span>¥{priceRange[1]}</span>
          </div>
        </Form.Item>
        
        <Divider orientation="left">排序方式</Divider>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="sort" label="排序字段">
              <Select>
                <Option value="createTime">发布时间</Option>
                <Option value="price">价格</Option>
                <Option value="popularity">热度</Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item name="order" label="排序方向">
              <Select>
                <Option value="desc">降序</Option>
                <Option value="asc">升序</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item>
          <Space size="middle">
            <Button type="primary" htmlType="submit" icon={<FilterOutlined />}>
              筛选
            </Button>
            <Button htmlType="button" onClick={handleReset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AdvancedSearch; 