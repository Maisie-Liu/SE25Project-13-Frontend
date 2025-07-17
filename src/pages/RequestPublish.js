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
  Divider,
  Alert
} from 'antd';
import { fetchBuyRequestDetail, createBuyRequest, updateBuyRequest } from '../store/actions/buyRequestActions';
import ConditionSelect from "../components/condition/ConditionSelect";
import {selectCategories} from "../store/slices/categorySlice";
import {fetchCategories} from "../store/actions/categoryActions";
import { InfoCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import styled from 'styled-components';
const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const PublishHeaderCard = styled(Card)`
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f7f5 100%);
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0,184,169,0.08);
  margin-bottom: 24px;
  border: none;
`;

const PublishFormCard = styled(Card)`
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0,184,169,0.08);
  background: linear-gradient(120deg, #f8fffe 60%, #e6f7f5 100%);
  border: none;
`;

const StyledButton = styled(Button)`
  background: linear-gradient(90deg, #00b8a9, #0dd8c8);
  border: none;
  border-radius: 8px !important;
  font-weight: 600;
  height: 48px;
  width: 180px;
  font-size: 16px;
  &:hover, &:focus {
    background: linear-gradient(90deg, #0dd8c8, #00b8a9);
    color: #fff;
  }
`;

const BackButton = styled(Button)`
  margin-top: 16px;
  border-radius: 8px !important;
  color: #00b8a9;
  font-weight: 500;
  background: none;
  border: none;
  &:hover {
    color: #0dd8c8;
    background: #f0f7ff;
  }
`;

const StyledFormItem = styled(Form.Item)`
  .ant-input, .ant-input-number, .ant-select-selector, textarea {
    border-radius: 8px !important;
  }
`;

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
      <PublishHeaderCard bordered={false}>
        <Title level={2} className="text-center" style={{ letterSpacing: 2 }}>
          {id ? '编辑求购信息' : '发布求购信息'}
        </Title>
        <Alert
          type="info"
          showIcon
          icon={<InfoCircleOutlined style={{ color: '#00b8a9' }} />}
          message="发布须知"
          description={<div style={{ fontSize: 14 }}>
            请详细描述您的求购需求，填写真实有效的联系方式。禁止发布与校园交易无关、违法违规、虚假等信息。
          </div>}
          style={{ margin: '18px auto 0', maxWidth: 600, background: 'rgba(0,184,169,0.05)', border: 'none', borderRadius: 8 }}
        />
      </PublishHeaderCard>
      <PublishFormCard bordered={false}>
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
              <StyledFormItem
                name="title"
                label={<span>求购标题 <span style={{ color: '#ff4d4f' }}>*</span></span>}
                rules={[{ required: true, message: '请输入求购标题' }]}
              >
                <Input placeholder="请输入求购标题，例如：求购 MacBook Pro 2021款" maxLength={50} />
              </StyledFormItem>
            </Col>
            <Col xs={24} md={12}>
              <StyledFormItem
                  name="categoryId"
                  label={<span>物品分类 <span style={{ color: '#ff4d4f' }}>*</span></span>}
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
              </StyledFormItem>
            </Col>
            <Col xs={24} md={12}>
              <StyledFormItem
                  name="condition"
                  label={<span>新旧程度 <span style={{ color: '#ff4d4f' }}>*</span></span>}
                  rules={[{ required: true, message: '请选择新旧程度' }]}
                  className="form-item-label"
              >
                <ConditionSelect />
              </StyledFormItem>
            </Col>
            <Col xs={24} md={12}>
              <StyledFormItem
                name="price"
                label={<span>预期价格 <span style={{ color: '#ff4d4f' }}>*</span></span>}
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
              </StyledFormItem>
            </Col>
            <Col xs={24} md={12}>
              <StyledFormItem
                name="negotiable"
                label={<span>价格是否可议 <span style={{ color: '#ff4d4f' }}>*</span></span>}
                rules={[{ required: true, message: '请选择价格是否可议' }]}
              >
                <Select placeholder="请选择">
                  <Option value={true}>可议价</Option>
                  <Option value={false}>不可议价</Option>
                </Select>
              </StyledFormItem>
            </Col>
            <Col xs={24}>
              <StyledFormItem
                name="description"
                label={<span>求购详情 <span style={{ color: '#ff4d4f' }}>*</span></span>}
                rules={[{ required: true, message: '请输入求购详情' }]}
              >
                <TextArea
                  placeholder="请详细描述您要求购的物品信息，例如：规格、型号、配置、成色要求等"
                  autoSize={{ minRows: 4, maxRows: 8 }}
                  maxLength={500}
                  showCount
                />
              </StyledFormItem>
            </Col>
            <Col xs={24}>
              <StyledFormItem
                name="contact"
                label={<span>联系方式 <span style={{ color: '#ff4d4f' }}>*</span></span>}
                rules={[{ required: true, message: '请提供联系方式' }]}
              >
                <Input placeholder="请输入您的联系方式，例如：微信、QQ或手机号" />
              </StyledFormItem>
            </Col>
          </Row>
          <Form.Item style={{ marginTop: '24px' }}>
            <div style={{ textAlign: 'center' }}>
              <StyledButton
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
              >
                {id ? '保存修改' : '发布求购信息'}
              </StyledButton>
              <br />
              <BackButton
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
              >
                返回上一页
              </BackButton>
            </div>
          </Form.Item>
        </Form>
      </PublishFormCard>
    </div>
  );
};

export default RequestPublish; 