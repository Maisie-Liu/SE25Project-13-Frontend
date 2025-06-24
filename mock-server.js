const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 路由前缀
app.use('/api', (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// 用户认证相关API
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    res.json({
      code: 200,
      message: 'Login successful',
      data: {
        token: 'mock-token-12345',
        userId: 1,
        username: 'admin',
        role: 'ADMIN'
      }
    });
  } else {
    res.status(401).json({
      code: 401,
      message: '用户名或密码错误'
    });
  }
});

app.post('/api/auth/register', (req, res) => {
  res.json({
    code: 200,
    message: 'Registration successful',
    data: {
      userId: 2,
      username: req.body.username,
      email: req.body.email
    }
  });
});

app.get('/api/auth/current-user', (req, res) => {
  res.json({
    code: 200,
    message: 'Success',
    data: {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      phone: '13800138000',
      avatar: 'https://joeschmoe.io/api/v1/admin',
      role: 'ADMIN',
      createTime: '2023-01-01T00:00:00Z'
    }
  });
});

// 商品相关API
app.get('/api/items', (req, res) => {
  res.json({
    code: 200,
    message: 'Success',
    data: {
      content: [
        {
          id: 1,
          name: '二手笔记本电脑',
          description: '9成新，配置高，性能好',
          price: 3500,
          condition: 4,
          categoryId: 1,
          categoryName: '电子产品',
          images: 'https://via.placeholder.com/300',
          status: 'PUBLISHED',
          sellerId: 2,
          sellerName: 'seller1',
          createTime: '2023-05-20T10:00:00Z',
          updateTime: '2023-05-20T10:00:00Z',
          viewCount: 120
        },
        {
          id: 2,
          name: '专业单反相机',
          description: '7成新，成色好，功能正常',
          price: 2800,
          condition: 3,
          categoryId: 1,
          categoryName: '电子产品',
          images: 'https://via.placeholder.com/300',
          status: 'PUBLISHED',
          sellerId: 3,
          sellerName: 'seller2',
          createTime: '2023-05-21T09:30:00Z',
          updateTime: '2023-05-21T09:30:00Z',
          viewCount: 89
        }
      ],
      totalElements: 2,
      totalPages: 1,
      size: 10,
      number: 0
    }
  });
});

// 监听端口
app.listen(PORT, () => {
  console.log(`Mock API server running at http://localhost:${PORT}`);
}); 