# E-commerce MVP

一个基于 React + NestJS 的电商 MVP 项目，使用 pnpm monorepo 管理。

# 账号
管理员：admin admin123  (可管理商品、订单、用户)

用户：test pwd123

## 项目结构

```
e-commerce-mvp/
├── frontend/          # React 前端项目
├── backend/           # NestJS 后端项目
├── package.json       # Monorepo 根配置
├── pnpm-workspace.yaml # pnpm workspace 配置
└── README.md          # 项目说明
```

## 技术栈

### 前端
- React 18
- Redux Toolkit
- Ant Design
- Vite
- React Router

### 后端
- NestJS
- TypeScript
- Sequelize ORM
- Sqlite
- JWT 认证

## 快速开始

### 环境要求
- Node.js >= 16
- pnpm >= 8
- Sqlite

### 安装依赖
```bash
# 安装所有依赖
pnpm install
```

### 开发模式
```bash
# 同时启动前后端开发服务器
pnpm dev

# 或者分别启动
pnpm backend:dev    # 启动后端开发服务器
pnpm frontend:dev   # 启动前端开发服务器
```

### 生产构建
```bash
# 构建所有项目
pnpm build

# 或者分别构建
pnpm backend:build
pnpm frontend:build
```


### 开发环境启动

在项目根目录运行以下命令之一：

（MySQL镜像没拉好，演示推荐用Sqlite）

```bash
# 使用 SQLite 数据库启动开发环境（推荐）
pnpm run dev

# 使用 MySQL 数据库启动开发环境
pnpm run dev:mysql
```

### 生产环境启动

```bash
# 使用 SQLite 数据库启动生产环境
pnpm run start

# 使用 MySQL 数据库启动生产环境
pnpm run start:mysql
```

## 服务端口配置

- **前端**: http://localhost:3000
- **后端**: http://localhost:3001

## 可用脚本说明

### 主要启动脚本

| 脚本 | 说明 |
|------|------|
| `pnpm run dev` | 同时启动前后端开发服务器（SQLite） |
| `pnpm run dev:mysql` | 同时启动前后端开发服务器（MySQL） |
| `pnpm run start` | 同时启动前后端生产服务器（SQLite） |
| `pnpm run start:mysql` | 同时启动前后端生产服务器（MySQL） |


## 环境变量

### SQLite 配置（默认）
- `DB_DIALECT=sqlite`
- `DB_STORAGE=./database.sqlite`
- `JWT_SECRET=your_jwt_secret_key`
- `PORT=3001`

### MySQL 配置
- `DB_DIALECT=mysql`
- `DB_HOST=localhost`
- `DB_PORT=3306`
- `DB_USERNAME=root`
- `DB_PASSWORD=password`
- `DB_DATABASE=ecommerce`
- `JWT_SECRET=your_jwt_secret_key`
- `PORT=3001`

### 生产启动
```bash
# 启动生产环境
pnpm start
```

## 功能特性

- 用户认证与授权
- 商品管理
- 购物车功能
- 订单管理
- 管理员后台
- 响应式设计

## 开发说明

### 后端配置
1. 复制 `backend/.env.example` 到 `backend/.env`
2. 配置数据库连接信息
3. 运行数据库迁移

### 前端配置
前端项目使用 Vite 构建，支持热重载和快速开发。

## 部署

### Docker 部署
```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d
```

### 传统部署
1. 构建项目：`pnpm build`
2. 部署后端到服务器
3. 部署前端到 CDN 或静态服务器

## 截图
- 首页
![首页](/docs/index.png)

- 商品列表
![商品列表](/docs/product.png)

- 个人中心
![个人中心](/docs/person.png)

- 管理后台
![管理后台](/docs/admin.png)

- api
[api](/docs/apiSwagger.png)

## 许可证

MIT License
