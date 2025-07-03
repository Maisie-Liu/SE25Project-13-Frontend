import React from 'react';
import { Tag } from 'antd';

/**
 * 物品新旧程度标签组件
 * @param {number} condition 1-10
 */
const ConditionTag = ({ condition }) => {
  return <div className="xianyu-tags">
  {condition === 1 && <Tag color="green" className="xianyu-tag">全新</Tag>}
  {condition > 1 && condition <= 3 && <Tag color="cyan" className="xianyu-tag">9成新</Tag>}
  {condition > 3 && condition <= 5 && <Tag color="blue" className="xianyu-tag">7成新</Tag>}
  {condition > 5 && condition <= 7 && <Tag color="orange" className="xianyu-tag">5成新</Tag>}
  {condition > 7 && condition <= 9 && <Tag color="red" className="xianyu-tag">3成新</Tag>}
  {condition > 9 && <Tag color="red" className="xianyu-tag">破旧</Tag>}
</div>
};

export default ConditionTag; 