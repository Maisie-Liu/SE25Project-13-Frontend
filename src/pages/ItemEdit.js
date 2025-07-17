import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, InputNumber, Select, Button, Upload, message, Spin, Card, Typography, Row, Col, Divider } from 'antd';
import { InfoCircleOutlined, DollarOutlined, FileTextOutlined, UploadOutlined } from '@ant-design/icons';
import { fetchItemById, updateItem, uploadItemImage, deleteFile } from '../store/actions/itemActions';
import { selectCurrentItem, selectItemLoading, selectUploadedImageUrl } from '../store/slices/itemSlice';
import {selectCategories} from "../store/slices/categorySlice";
import {fetchCategories} from "../store/actions/categoryActions";
import ConditionSelect from '../components/condition/ConditionSelect';
import './ItemEdit.css';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Paragraph } = Typography;

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
  // const [imageUrls, setImageUrls] = useState([]);
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
        condition: item.condition,
        stock: item.stock
      });
      
      if (item.images && item.images.length > 0) {
        console.log("images: ", item.images);
        const initialFileList = item.images.map((url, index) => ({
          uid: `-${index}`,
          name: `image-${index}`,
          status: 'done',
          url: url,
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

  // useEffect(() => {
  //   if (uploadedImageUrl) {
  //     setFileList(prev => [
  //       ...prev,
  //       {
  //         uid: `${Date.now()}`,
  //         name: 'image.jpg',
  //         status: 'done',
  //         url: uploadedImageUrl,
  //       },
  //     ]);
  //     const match = uploadedImageUrl.match(/\/api\/image\/([a-fA-F0-9]+)/);
  //     if (match && match[1]) {
  //       setImageIdList(prev => [...prev, match[1]]);
  //     } else {
  //       setImageIdList(prev => [...prev, uploadedImageUrl]);
  //     }
  //     setUploading(false);
  //     console.log("uploadedImageUrl changed! uploadedImageUrl: ", uploadedImageUrl);
  //   }
  // }, [uploadedImageUrl]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await dispatch(uploadItemImage(formData));
      const { imageId, url } = res.payload || {};
      setImageIdList(prev => [...prev, imageId]);
      setFileList(prev => [
        ...prev,
        {
          uid: `${Date.now()}`,
          name: file.name,
          status: 'done',
          url: url,
        },
      ]);
      message.success('图片上传成功');
      return imageId;
      // return false;
    } catch (error) {
      message.error('图片上传失败: ' + error);
      // return false;
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
      // setFileList([...fileList, file]);

      return false; // 阻止自动上传
    },
    onRemove: async (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
      const newImageIdList = [...imageIdList];
      newImageIdList.splice(index, 1);
      setImageIdList(newImageIdList);
      // // 兼容老逻辑
      // const newImageUrls = [...imageUrls];
      // newImageUrls.splice(index, 1);
      // setImageUrls(newImageUrls);
      const url = file.url;
      const match = url && url.match(/\/api\/image\/([a-fA-F0-9]+)/);
      const imageId = match ? match[1] : url;
      try {
        await dispatch(deleteFile(imageId));
        message.success('图片已删除');
      } catch (e) {
        message.error('图片删除失败');
      }
    }
  };

  const parentCategories = categories.filter(cat => !cat.parentId);
  const subCategories = categories.filter(cat => cat.parentId);
  const groupedCategories = parentCategories.map(parent => {
    const children = subCategories.filter(sub => sub.parentId === parent.id);
    return { parent, children };
  });

  if (loading && !item) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="item-edit-container">
      <Card className="item-edit-card">
        <div className="item-edit-header">
          <Title level={2}>编辑物品</Title>
          <Paragraph>修改物品信息，完善展示内容</Paragraph>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          {/* 基础信息部分 */}
          <div className="item-form-section">
            <h3 className="section-title">
              <InfoCircleOutlined /> 基础信息
            </h3>
            <Row gutter={24}>
              <Col xs={24} md={16}>
                <Form.Item
                  name="name"
                  label="物品名称"
                  rules={[{ required: true, message: '请输入物品名称' }]}
                  className="form-item-label vertical-form-item"
                >
                  <Input placeholder="请输入物品名称，建议30字以内" maxLength={30} />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="categoryId"
                  label="物品分类"
                  rules={[{ required: true, message: '请选择物品分类' }]}
                  className="form-item-label"
                >
                  <Select placeholder="选择物品分类">
                    {groupedCategories.map(group =>
                      group.children.length > 0 ? (
                        <Select.OptGroup key={group.parent.id} label={group.parent.name}>
                          {group.children.map(child => (
                            <Option key={child.id} value={child.id}>{child.name}</Option>
                          ))}
                        </Select.OptGroup>
                      ) : (
                        <Option key={group.parent.id} value={group.parent.id}>{group.parent.name}</Option>
                      )
                    )}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>
          {/* 价格与库存部分 */}
          <div className="item-form-section">
            <h3 className="section-title">
              <DollarOutlined /> 价格与库存
            </h3>
            <Row gutter={24}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="price"
                  label="价格(元)"
                  rules={[{ required: true, message: '请输入价格' }]}
                  className="form-item-label"
                >
                  <InputNumber
                    min={0}
                    precision={2}
                    style={{ width: '100%' }}
                    placeholder="请输入价格"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="stock"
                  label="库存"
                  rules={[{ required: true, message: '请输入库存' }]}
                  className="form-item-label"
                >
                  <InputNumber
                    min={1}
                    style={{ width: '100%' }}
                    placeholder="请输入库存"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="condition"
                  label="新旧程度"
                  rules={[{ required: true, message: '请选择新旧程度' }]}
                  className="form-item-label"
                >
                  <ConditionSelect />
                </Form.Item>
              </Col>
            </Row>
          </div>
          {/* 描述部分 */}
          <div className="item-form-section">
            <h3 className="section-title">
              <FileTextOutlined /> 物品描述
            </h3>
            <Form.Item
              name="description"
              label="描述"
              rules={[{ required: true, message: '请输入物品描述' }]}
              className="form-item-label vertical-form-item"
            >
              <TextArea rows={4} placeholder="请详细描述物品的情况" />
            </Form.Item>
          </div>
          {/* 图片上传部分 */}
          <div className="item-form-section">
            <h3 className="section-title">
              <UploadOutlined /> 图片
            </h3>
            <Form.Item label="图片" className="vertical-form-item">
              <Upload
                {...uploadProps}
                listType="picture-card"
                disabled={fileList.length >= 5 || uploading}
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
          </div>
          <Divider />
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className="submit-button">
              保存更改
            </Button>
            <Button className="cancel-button" onClick={() => navigate(`/items/${id}`)}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ItemEdit; 