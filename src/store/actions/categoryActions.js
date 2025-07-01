import { setCategories, setCategoryLoading, setCategoryError } from '../slices/categorySlice';
import axios from '../../utils/axios';

export const fetchCategories = () => async (dispatch) => {
  dispatch(setCategoryLoading(true));
  try {
    const response = await axios.get('/category/list');
    dispatch(setCategories(response.data));
  } catch (error) {
    dispatch(setCategoryError(error.message || '获取分类失败'));
  }
}; 