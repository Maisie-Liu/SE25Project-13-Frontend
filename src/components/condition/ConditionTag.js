import React from 'react';
import { Tag } from 'antd';

/**
 * 物品新旧程度标签组件
 * @param {number} condition 1-10
 */
const ConditionTag = ({ condition }) => {
  if (!condition) return <Tag color="default">未知</Tag>;
  if (condition === 1) return <Tag color="green">全新</Tag>;
  if (condition > 1 && condition <= 3) return <Tag color="cyan">9成新</Tag>;
  if (condition > 3 && condition <= 5) return <Tag color="blue">7成新</Tag>;
  if (condition > 5 && condition <= 7) return <Tag color="orange">5成新</Tag>;
  if (condition > 7 && condition <= 9) return <Tag color="red">3成新</Tag>;
  if (condition === 10) return <Tag color="red">破旧</Tag>;
  return <Tag color="default">未知</Tag>;
};

export default ConditionTag; 