import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Select, InputNumber, Upload, Card, Typography, message, Row, Col, Spin } from 'antd';
import { UploadOutlined, RollbackOutlined, SaveOutlined, SyncOutlined } from '@ant-design/icons';
import { createItem, uploadItemImage, generateItemDescription } from '../store/actions/itemActions';
import { selectCategories } from '../store/slices/categorySlice';
import { fetchCategories } from '../store/actions/categoryActions';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ItemPublish = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const [form] = Form.useForm();
  
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageIds, setImageIds] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [generatingDescription, setGeneratingDescription] = useState(false);
  
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  
  // 处理图片上传
  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await dispatch(uploadItemImage(formData));
      const imageId = res.payload?.imageId || res.payload;
      console.log("imageId: ", imageId);
      setImageIds(prev => [...prev, imageId]);
      setImageUrls(prev => [...prev, imageId]); // 兼容老逻辑，imageUrls暂时存id
      message.success('图片上传成功');
      return imageId;
    } catch (error) {
      message.error('图片上传失败: ' + error);
    } finally {
      setUploading(false);
    }
  };
  
  // 处理自动生成描述
  const handleGenerateDescription = async () => {
    if (imageUrls.length === 0) {
      message.warning('请先上传图片');
      return;
    }
    
    setGeneratingDescription(true);
    try {
      // 使用第一张图片来生成描述
      const description = await dispatch(generateItemDescription(imageUrls[0])).unwrap();
      form.setFieldsValue({ description });
      message.success('描述生成成功');
    } catch (error) {
      message.error('生成描述失败: ' + error);
    } finally {
      setGeneratingDescription(false);
    }
  };
  
  // 提交表单
  const onFinish = async (values) => {
    if (imageIds.length === 0) {
      message.warning('请至少上传一张图片');
      return;
    }
    // 准备提交数据
    const itemData = {
      ...values,
      images: imageIds // 发送图片ID数组
    };
    try {
      await dispatch(createItem(itemData)).unwrap();
      message.success('物品发布成功');
      navigate('/'); // 发布成功后跳转到首页
    } catch (error) {
      message.error('物品发布失败: ' + error);
    }
  };
  
  // 上传组件配置
  const uploadProps = {
    name: 'file',
    multiple: true,
    fileList,
    beforeUpload: (file) => {
      // 验证文件类型和大小
      const isImage = file.type.startsWith('image/');
      const isLt5M = file.size / 1024 / 1024 < 5;
      
      if (!isImage) {
        message.error('只能上传图片文件');
        return false;
      }
      
      if (!isLt5M) {
        message.error('图片大小不能超过5MB');
        return false;
      }
      
      // 手动上传
      handleUpload(file);
      setFileList([...fileList, file]);
      
      return false; // 阻止自动上传
    },
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
      // 同时移除对应的图片ID
      const newImageIds = [...imageIds];
      newImageIds.splice(index, 1);
      setImageIds(newImageIds);
      // 兼容老逻辑
      const newImageUrls = [...imageUrls];
      newImageUrls.splice(index, 1);
      setImageUrls(newImageUrls);
    }
  };
  
  return (
    <div className="container" style={{ marginTop: 20, marginBottom: 40 }}>
      <Card>
        <Title level={2}>发布闲置物品</Title>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            condition: 3, // 默认为7成新
            stock: 1,
          }}
        >
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="物品名称"
                rules={[{ required: true, message: '请输入物品名称' }]}
              >
                <Input placeholder="请输入物品名称，建议30字以内" maxLength={30} />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="categoryId"
                label="物品分类"
                rules={[{ required: true, message: '请选择物品分类' }]}
              >
                <Select placeholder="选择物品分类">
                  {(categories || []).length === 0 ? (
                    <Option disabled value="">暂无数据</Option>
                  ) : (
                    categories.map(category => (
                      <Option key={category.id} value={category.id}>{category.name}</Option>
                    ))
                  )}
                </Select>
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="condition"
                label="新旧程度"
                rules={[{ required: true, message: '请选择新旧程度' }]}
              >
                <Select placeholder="选择新旧程度">
                  <Option value={5}>全新</Option>
                  <Option value={4}>9成新</Option>
                  <Option value={3}>7成新</Option>
                  <Option value={2}>5成新</Option>
                  <Option value={1}>3成新以下</Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="price"
                label="价格(元)"
                rules={[{ required: true, message: '请输入价格' }]}
              >
                <InputNumber 
                  min={0}
                  precision={2}
                  style={{ width: '100%' }}
                  placeholder="请输入价格"
                />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="stock"
                label="库存"
                rules={[{ required: true, message: '请输入库存' }]}
              >
                <InputNumber 
                  min={1}
                  style={{ width: '100%' }}
                  placeholder="请输入库存"
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item label="物品图片（最多5张）">
            <Upload {...uploadProps} listType="picture-card" disabled={fileList.length >= 5 || uploading}>
              {fileList.length >= 5 ? null : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>上传图片</div>
                </div>
              )}
            </Upload>
            {uploading && <Spin tip="上传中..." />}
          </Form.Item>
          
          <Form.Item
            name="description"
            label="物品描述"
            rules={[{ required: true, message: '请输入物品描述' }]}
            extra={
              <Button 
                type="link" 
                onClick={handleGenerateDescription} 
                icon={<SyncOutlined spin={generatingDescription} />}
                disabled={generatingDescription || imageUrls.length === 0}
              >
                AI自动生成描述
              </Button>
            }
          >
            <TextArea 
              rows={6} 
              placeholder="描述一下您的物品，如品牌、型号、使用感受等，建议100字以上"
              maxLength={1000} 
              showCount
            />
          </Form.Item>
          
          <Form.Item>
            <Button type="default" icon={<RollbackOutlined />} style={{ marginRight: 16 }} onClick={() => navigate('/')}>
              返回
            </Button>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              发布物品
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ItemPublish; 