import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const conditionOptions = [
  { value: 1, label: '全新' },
  { value: 2, label: '9成新' },
  { value: 3, label: '8成新' },
  { value: 4, label: '7成新' },
  { value: 5, label: '6成新' },
  { value: 6, label: '5成新' },
  { value: 7, label: '4成新' },
  { value: 8, label: '3成新' },
  { value: 9, label: '2成新' },
  { value: 10, label: '破旧' }
];

/**
 * 物品新旧程度选择组件
 * value: 1-10
 */
const ConditionSelect = (props) => (
  <Select placeholder="请选择新旧程度" {...props}>
    {conditionOptions.map(opt => (
      <Option key={opt.value} value={opt.value}>{opt.label}</Option>
    ))}
  </Select>
);

export default ConditionSelect; 