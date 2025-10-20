# 交物通前端 - 校园二手交易平台

这是“交物通”校园二手交易平台的前端部分，基于 React 18 构建，提供响应式用户界面与良好的交互体验。

## 技术栈

- **React 18**
- **Redux + Redux Toolkit**（状态管理）
- **React Router**（路由管理）
- **Ant Design**（UI 组件库）
- **Axios**（HTTP 客户端）

## 功能模块

- 用户注册、登录、个人资料管理
- 商品发布、编辑、图片上传
- 商品浏览、搜索、筛选与排序
- 订单管理与状态跟踪
- 用户评价与信誉展示
- 消息通知与站内聊天
- 响应式设计，适配移动端与桌面端

## 项目结构
```
├── public/         # 静态资源目录，存放如 favicon.ico 等资源
├── src/            # 源代码目录
│   ├── components/ # 可复用组件目录
│   ├── pages/      # 页面级组件目录
│   ├── store/      # Redux 状态管理目录
│   ├── utils/      # 工具函数目录
│   ├── App.css     # 主应用样式文件
│   ├── App.js      # 主应用逻辑文件
│   ├── index.css   # 入口样式文件
│   ├── index.js    # 应用入口文件，负责渲染 React 应用
│   └── mock-server.js # 模拟服务器文件，用于开发环境数据模拟
├── .gitignore      # Git 忽略文件配置
├── package-lock.json # 锁定项目依赖版本
├── package.json    # 项目依赖配置文件
└── README.md       # 项目说明文档
```

## 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start
```

默认访问地址：`http://localhost:3000`

## 构建与部署

```bash
# 构建生产版本
npm run build
```

构建产物位于 `build/` 目录，可部署至静态服务器或 CDN。

## 环境配置

- 接口地址等配置可在 `.env` 文件中设置，如：

```
REACT_APP_API_URL=http://localhost:8080/api
```