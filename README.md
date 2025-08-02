# E-commerce MVP

一个基于 React + NestJS 的电商 MVP 项目，使用 pnpm monorepo 管理。

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
- PostgreSQL
- JWT 认证

## 快速开始

### 环境要求
- Node.js >= 16
- pnpm >= 8
- PostgreSQL

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

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License