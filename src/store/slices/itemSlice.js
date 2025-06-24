import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchItems, 
  fetchItemById, 
  createItem, 
  updateItem, 
  deleteItem,
  publishItem,
  unpublishItem,
  fetchUserItems,
  fetchCategoryItems,
  searchItems,
  uploadItemImage,
  generateItemDescription,
  fetchRecommendedItems
} from '../actions/itemActions';

const initialState = {
  items: [],
  item: null,
  recommendedItems: [],
  pagination: {
    pageNum: 1,
    pageSize: 10,
    total: 0,
    pages: 0
  },
  loading: false,
  error: null,
  uploadedImageUrl: null,
  generatedDescription: null,
};

const itemSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {
    clearItemError: (state) => {
      state.error = null;
    },
    clearCurrentItem: (state) => {
      state.item = null;
    },
    clearUploadedImageUrl: (state) => {
      state.uploadedImageUrl = null;
    },
    clearGeneratedDescription: (state) => {
      state.generatedDescription = null;
    },
  },
  extraReducers: (builder) => {
    // 获取物品列表
    builder.addCase(fetchItems.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchItems.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.list;
      state.pagination = {
        pageNum: action.payload.pageNum,
        pageSize: action.payload.pageSize,
        total: action.payload.total,
        pages: action.payload.pages
      };
    });
    builder.addCase(fetchItems.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || '获取物品列表失败';
    });

    // 获取物品详情
    builder.addCase(fetchItemById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchItemById.fulfilled, (state, action) => {
      state.loading = false;
      state.item = action.payload;
    });
    builder.addCase(fetchItemById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || '获取物品详情失败';
    });

    // 创建物品
    builder.addCase(createItem.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createItem.fulfilled, (state, action) => {
      state.loading = false;
      state.item = action.payload;
    });
    builder.addCase(createItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || '创建物品失败';
    });

    // 更新物品
    builder.addCase(updateItem.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateItem.fulfilled, (state, action) => {
      state.loading = false;
      state.item = action.payload;
    });
    builder.addCase(updateItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || '更新物品失败';
    });

    // 删除物品
    builder.addCase(deleteItem.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteItem.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(deleteItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || '删除物品失败';
    });

    // 上架物品
    builder.addCase(publishItem.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(publishItem.fulfilled, (state, action) => {
      state.loading = false;
      state.item = action.payload;
    });
    builder.addCase(publishItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || '上架物品失败';
    });

    // 下架物品
    builder.addCase(unpublishItem.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(unpublishItem.fulfilled, (state, action) => {
      state.loading = false;
      state.item = action.payload;
    });
    builder.addCase(unpublishItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || '下架物品失败';
    });

    // 获取用户物品列表
    builder.addCase(fetchUserItems.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserItems.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.list;
      state.pagination = {
        pageNum: action.payload.pageNum,
        pageSize: action.payload.pageSize,
        total: action.payload.total,
        pages: action.payload.pages
      };
    });
    builder.addCase(fetchUserItems.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || '获取用户物品列表失败';
    });

    // 获取分类物品列表
    builder.addCase(fetchCategoryItems.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCategoryItems.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.list;
      state.pagination = {
        pageNum: action.payload.pageNum,
        pageSize: action.payload.pageSize,
        total: action.payload.total,
        pages: action.payload.pages
      };
    });
    builder.addCase(fetchCategoryItems.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || '获取分类物品列表失败';
    });

    // 搜索物品
    builder.addCase(searchItems.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(searchItems.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.list;
      state.pagination = {
        pageNum: action.payload.pageNum,
        pageSize: action.payload.pageSize,
        total: action.payload.total,
        pages: action.payload.pages
      };
    });
    builder.addCase(searchItems.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || '搜索物品失败';
    });

    // 上传物品图片
    builder.addCase(uploadItemImage.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(uploadItemImage.fulfilled, (state, action) => {
      state.loading = false;
      state.uploadedImageUrl = action.payload;
    });
    builder.addCase(uploadItemImage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || '上传物品图片失败';
    });

    // 生成物品描述
    builder.addCase(generateItemDescription.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(generateItemDescription.fulfilled, (state, action) => {
      state.loading = false;
      state.generatedDescription = action.payload;
    });
    builder.addCase(generateItemDescription.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || '生成物品描述失败';
    });

    // 获取推荐物品列表
    builder.addCase(fetchRecommendedItems.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRecommendedItems.fulfilled, (state, action) => {
      state.loading = false;
      state.recommendedItems = action.payload;
    });
    builder.addCase(fetchRecommendedItems.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || '获取推荐物品列表失败';
    });
  },
});

export const { 
  clearItemError, 
  clearCurrentItem, 
  clearUploadedImageUrl, 
  clearGeneratedDescription 
} = itemSlice.actions;

// 选择器
export const selectItems = (state) => state.item.items;
export const selectCurrentItem = (state) => state.item.item;
export const selectRecommendedItems = (state) => state.item.recommendedItems;
export const selectItemPagination = (state) => state.item.pagination;
export const selectItemLoading = (state) => state.item.loading;
export const selectItemError = (state) => state.item.error;
export const selectUploadedImageUrl = (state) => state.item.uploadedImageUrl;
export const selectGeneratedDescription = (state) => state.item.generatedDescription;

export default itemSlice.reducer; 