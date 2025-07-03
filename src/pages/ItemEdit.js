import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, InputNumber, Select, Button, Upload, message, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { fetchItemById, updateItem, uploadItemImage, deleteFile } from '../store/actions/itemActions';
import { selectCurrentItem, selectItemLoading, selectUploadedImageUrl } from '../store/slices/itemSlice';
import {selectCategories} from "../store/slices/categorySlice";
import {fetchCategories} from "../store/actions/categoryActions";
import ConditionSelect from '../components/condition/ConditionSelect';

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
  const categories = useSelector(selectCategories);
  
  const [fileList, setFileList] = useState([]);
  const [imageIdList, setImageIdList] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchItemById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (item) {
      form.setFieldsValue({
        name: item.name,
        description: item.description,
        price: item.price,
        categoryId: item.categoryId,
        condition: item.condition
      });
      
      if (item.images && item.images.length > 0) {
        console.log("images: ", item.images);
        const initialFileList = item.images.map((url, index) => ({
          uid: `-${index}`,
          name: `image-${index}`,
          status: 'done',
          url,
        }));
        setFileList(initialFileList);
        const initialImageIds = item.images.map(url => {
          const match = url && url.match(/\/api\/image\/([a-fA-F0-9]+)/);
          return match ? match[1] : url;
        });
        setImageIdList(initialImageIds);
      } else {
        setFileList([]);
        setImageIdList([]);
      }
    }
  }, [form, item]);

  useEffect(() => {
    if (uploadedImageUrl) {
      setFileList(prev => [
        ...prev,
        {
          uid: `${Date.now()}`,
          name: 'image.jpg',
          status: 'done',
          url: uploadedImageUrl,
        },
      ]);
      const match = uploadedImageUrl.match(/\/api\/image\/([a-fA-F0-9]+)/);
      if (match && match[1]) {
        setImageIdList(prev => [...prev, match[1]]);
      } else {
        setImageIdList(prev => [...prev, uploadedImageUrl]);
      }
      setUploading(false);
      console.log("uploadedImageUrl changed! uploadedImageUrl: ", uploadedImageUrl);
    }
  }, [uploadedImageUrl]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await dispatch(uploadItemImage(formData));
      const imageId = res.payload?.imageId || res.payload;
      const url = `/api/image/${imageId}`;
      setFileList(prev => [
        ...prev,
        {
          uid: `${Date.now()}`,
          name: 'image.jpg',
          status: 'done',
          url,
        },
      ]);
      setImageIdList(prev => [...prev, imageId]);
      message.success('图片上传成功');
      return false;
    } catch (error) {
      message.error('图片上传失败: ' + error);
      return false;
    } finally {
      setUploading(false);
    }
  };

  const onFinish = (values) => {
    const updatedItem = {
      id,
      itemData: {
        ...values,
        images: imageIdList,
      }
    };
    console.log("in onFinish, updatedItem: ", updatedItem);
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
          name="name"
          label="物品名称"
          rules={[{ required: true, message: '请输入物品名称' }]}
        >
          <Input placeholder="请输入物品名称，建议30字以内" maxLength={30} />
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
        
        <Form.Item
          name="condition"
          label="新旧程度"
          rules={[{ required: true, message: '请选择新旧程度' }]}
        >
          <ConditionSelect />
        </Form.Item>
        
        <Form.Item label="图片">
          <Upload
            name="file"
            listType="picture-card"
            fileList={fileList}
            beforeUpload={handleUpload}
            onRemove={async (file) => {
              const index = fileList.indexOf(file);
              const newFileList = fileList.slice();
              newFileList.splice(index, 1);
              setFileList(newFileList);
              const newImageIdList = imageIdList.slice();
              const url = file.url;
              const match = url && url.match(/\/api\/image\/([a-fA-F0-9]+)/);
              const imageId = match ? match[1] : url;
              newImageIdList.splice(index, 1);
              setImageIdList(newImageIdList);
              try {
                await dispatch(deleteFile(imageId));
                message.success('图片已删除');
              } catch (e) {
                message.error('图片删除失败');
              }
            }}
            disabled={fileList.length >= 5 || uploading}
            showUploadList={{ showRemoveIcon: true }}
          >
            {fileList.length >= 5 ? null : (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>上传图片</div>
              </div>
            )}
          </Upload>
          {uploading && <Spin tip="上传中..." />}
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