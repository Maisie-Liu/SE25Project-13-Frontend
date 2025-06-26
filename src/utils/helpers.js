// 格式化价格，保留两位小数
export const formatPrice = (price) => {
  if (!price && price !== 0) return '0.00';
  return Number(price).toFixed(2);
}; 