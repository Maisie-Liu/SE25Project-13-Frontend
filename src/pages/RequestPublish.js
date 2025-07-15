import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form,
  Input,
  Select,
  Button,
  InputNumber,
  Card,
  message,
  Typography,
  Row,
  Col,
  Divider
} from 'antd';
import { fetchBuyRequestDetail, createBuyRequest, updateBuyRequest } from '../store/actions/buyRequestActions';
import ConditionSelect from "../components/condition/ConditionSelect";
import {selectCategories} from "../store/slices/categorySlice";
import {fetchCategories} from "../store/actions/categoryActions";
const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const RequestPublish = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams(); // 编辑时有id
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const categories = useSelector(selectCategories);
  const detail = useSelector(state => state.buyRequest.detail);

  useEffect(() => {
    if (id) {
      dispatch(fetchBuyRequestDetail(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);


  useEffect(() => {
    if (id && detail) {
      form.setFieldsValue({
        title: detail.title,
        categoryId: detail.categoryId,
        price: detail.expectedPrice,
        condition: detail.condition,
        negotiable: detail.negotiable,
        description: detail.description,
        contact: detail.contact
      });
    }
  }, [id, detail, form]);

  // 处理表单提交
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const data = {
        title: values.title,
        categoryId: values.categoryId,
        condition: values.condition,
        expectedPrice: values.price,
        negotiable: values.negotiable,
        description: values.description,
        contact: values.contact
      };
      if (id) {
        await dispatch(updateBuyRequest(id, data));
        message.success('求购信息编辑成功！');
      } else {
        await dispatch(createBuyRequest(data));
        message.success('求购信息发布成功！');
      }
      navigate('/requests');
    } catch (error) {
      message.error('操作失败，请重试！');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Card bordered={false} className="publish-card">
        <Title level={2} className="text-center">{id ? '编辑求购信息' : '发布求购信息'}</Title>
        <Divider />
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            categoryId: 1,
            price: '',
            condition: 1,
            negotiable: true
          }}
        >
          <Row gutter={24}>
            <Col xs={24} md={24}>
              <Form.Item
                name="title"
                label="求购标题"
                rules={[{ required: true, message: '请输入求购标题' }]}
              >
                <Input placeholder="请输入求购标题，例如：求购 MacBook Pro 2021款" maxLength={50} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                  name="categoryId"
                  label="物品分类"
                  rules={[{ required: true, message: '请选择物品分类' }]}
                  className="form-item-label"
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
            <Col xs={24} md={12}>
              <Form.Item
                  name="condition"
                  label="新旧程度"
                  rules={[{ required: true, message: '请选择新旧程度' }]}
                  className="form-item-label"
              >
                <ConditionSelect />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="price"
                label="预期价格"
                rules={[{ required: true, message: '请输入预期价格' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入您的预期价格"
                  min={0}
                  step={10}
                  formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/¥\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="negotiable"
                label="价格是否可议"
                rules={[{ required: true, message: '请选择价格是否可议' }]}
              >
                <Select placeholder="请选择">
                  <Option value={true}>可议价</Option>
                  <Option value={false}>不可议价</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="description"
                label="求购详情"
                rules={[{ required: true, message: '请输入求购详情' }]}
              >
                <TextArea
                  placeholder="请详细描述您要求购的物品信息，例如：规格、型号、配置、成色要求等"
                  autoSize={{ minRows: 4, maxRows: 8 }}
                  maxLength={500}
                  showCount
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="contact"
                label="联系方式"
                rules={[{ required: true, message: '请提供联系方式' }]}
              >
                <Input placeholder="请输入您的联系方式，例如：微信、QQ或手机号" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item style={{ marginTop: '24px' }}>
            <div style={{ textAlign: 'center' }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{ width: '180px', height: '48px' }}
                loading={loading}
              >
                {id ? '保存修改' : '发布求购信息'}
              </Button>
              <br />
              <Button
                type="link"
                style={{ marginTop: '16px' }}
                onClick={() => navigate(-1)}
              >
                返回上一页
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RequestPublish; 