import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, InputNumber, Select, Button, Upload, message, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { fetchItemById, updateItem, uploadItemImage } from '../store/actions/itemActions';
import { selectCurrentItem, selectItemLoading, selectUploadedImageUrl } from '../store/slices/itemSlice';

const { Option } = Select;
const { TextArea } = Input;

const ItemEdit = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const item = useSelector(selectCurrentItem);
  const loading = useSelector(selectItemLoading);
  const uploadedImageUrl = useSelector(selectUploadedImageUrl);
  
  const [imageList, setImageList] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchItemById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (item) {
      form.setFieldsValue({
        title: item.title,
        description: item.description,
        price: item.price,
        category: item.category,
        condition: item.condition
      });
      
      if (item.images && item.images.length > 0) {
        const initialImages = item.images.map((url, index) => ({
          uid: `-${index}`,
          name: `image-${index}`,
          status: 'done',
          url,
        }));
        setImageList(initialImages);
      }
    }
  }, [form, item]);

  useEffect(() => {
    if (uploadedImageUrl) {
      setImageList(prev => [
        ...prev,
        {
          uid: `${Date.now()}`,
          name: 'image.jpg',
          status: 'done',
          url: uploadedImageUrl,
        },
      ]);
      setUploading(false);
    }
  }, [uploadedImageUrl]);

  const handleUpload = (info) => {
    if (info.file.status === 'uploading') {
      setUploading(true);
      return;
    }
    
    if (info.file.status === 'done') {
      // 这里处理自定义上传
      const formData = new FormData();
      formData.append('image', info.file.originFileObj);
      dispatch(uploadItemImage(formData));
    }
  };

  const onFinish = (values) => {
    const imageUrls = imageList.map(img => img.url || img.response?.url);
    
    const updatedItem = {
      ...values,
      id,
      images: imageUrls,
    };
    
    dispatch(updateItem(updatedItem))
      .then(() => {
        message.success('物品信息更新成功');
        navigate(`/items/${id}`);
      })
      .catch(() => {
        message.error('更新失败，请重试');
      });
  };

  if (loading && !item) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="item-edit-container">
      <h1>编辑物品</h1>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="title"
          label="标题"
          rules={[{ required: true, message: '请输入物品标题' }]}
        >
          <Input placeholder="请输入物品标题" />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="描述"
          rules={[{ required: true, message: '请输入物品描述' }]}
        >
          <TextArea rows={4} placeholder="请详细描述物品的情况" />
        </Form.Item>
        
        <Form.Item
          name="price"
          label="价格"
          rules={[{ required: true, message: '请输入价格' }]}
        >
          <InputNumber
            min={0}
            style={{ width: '100%' }}
            formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\¥\s?|(,*)/g, '')}
          />
        </Form.Item>
        
        <Form.Item
          name="category"
          label="分类"
          rules={[{ required: true, message: '请选择分类' }]}
        >
          <Select placeholder="请选择分类">
            <Option value="电子产品">电子产品</Option>
            <Option value="书籍教材">书籍教材</Option>
            <Option value="家居用品">家居用品</Option>
            <Option value="服装鞋包">服装鞋包</Option>
            <Option value="运动户外">运动户外</Option>
            <Option value="其他">其他</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="condition"
          label="新旧程度"
          rules={[{ required: true, message: '请选择新旧程度' }]}
        >
          <Select placeholder="请选择新旧程度">
            <Option value="全新">全新</Option>
            <Option value="几乎全新">几乎全新</Option>
            <Option value="八成新">八成新</Option>
            <Option value="五成新">五成新</Option>
            <Option value="三成新">三成新</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          label="图片"
        >
          <Upload
            listType="picture-card"
            fileList={imageList}
            customRequest={({ file, onSuccess }) => {
              setTimeout(() => {
                onSuccess("ok");
              }, 0);
            }}
            onChange={handleUpload}
            onRemove={file => {
              const index = imageList.indexOf(file);
              const newFileList = imageList.slice();
              newFileList.splice(index, 1);
              setImageList(newFileList);
            }}
          >
            {imageList.length >= 5 ? null : (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            保存更改
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => navigate(`/items/${id}`)}>
            取消
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ItemEdit; 