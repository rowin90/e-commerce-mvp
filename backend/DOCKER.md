# Docker 部署指南

## 概述

本项目提供了完整的Docker化解决方案，包括NestJS后端应用和MySQL数据库。

## 文件说明

- `Dockerfile` - 生产环境Docker镜像配置
- `Dockerfile.dev` - 开发环境Docker镜像配置
- `docker-compose.yml` - 生产环境Docker Compose配置
- `docker-compose.dev.yml` - 开发环境Docker Compose配置
- `docker-compose.mysql.yml` - 仅MySQL数据库服务配置（推荐）
- `.dockerignore` - Docker构建忽略文件
- `mysql/init/01-init.sql` - MySQL数据库初始化脚本

## 快速开始（推荐方式）

### 使用Docker MySQL + 本地后端

这是目前推荐的开发方式，避免了Node.js镜像下载问题：

1. 启动MySQL数据库：
```bash
pnpm run mysql:up
```

2. 启动后端应用（本地运行）：
```bash
pnpm dev
```

3. 查看MySQL日志：
```bash
pnpm run mysql:logs
```

4. 连接到MySQL数据库：
```bash
pnpm run mysql:connect
# 密码：password
```

5. 停止MySQL服务：
```bash
pnpm run mysql:down
```

### 完整Docker环境（需要Node.js镜像）

如果网络环境允许下载Node.js镜像，可以使用完整的Docker环境：

#### 开发环境

1. 启动开发环境（包含热重载）：
```bash
pnpm run docker:up:dev
```

2. 查看日志：
```bash
pnpm run docker:logs:dev
```

3. 停止服务：
```bash
pnpm run docker:down:dev
```

#### 生产环境

1. 启动生产环境：
```bash
pnpm run docker:up
```

2. 查看日志：
```bash
pnpm run docker:logs
```

3. 停止服务：
```bash
pnpm run docker:down
```

## 服务说明

### MySQL 数据库
- **端口**: 3306
- **数据库名**: ecommerce_db
- **用户名**: root
- **密码**: password
- **数据持久化**: 通过Docker volume实现

### 后端应用
- **端口**: 3001
- **API文档**: http://localhost:3001/api
- **健康检查**: http://localhost:3001/health

## 环境变量

主要环境变量在docker-compose文件中配置：

- `DB_HOST`: 数据库主机（容器内为mysql，本地为localhost）
- `DB_PORT`: 数据库端口（3306）
- `DB_USERNAME`: 数据库用户名
- `DB_PASSWORD`: 数据库密码
- `DB_DATABASE`: 数据库名称
- `JWT_SECRET`: JWT密钥
- `JWT_EXPIRES_IN`: JWT过期时间
- `PORT`: 应用端口
- `NODE_ENV`: 运行环境

## 数据库初始化

首次启动时，MySQL容器会自动执行 `mysql/init/01-init.sql` 脚本，创建：

1. 数据库表结构
2. 示例数据
3. 管理员账户（用户名：admin，密码：password）

## 常用命令

### MySQL相关
```bash
# 启动MySQL服务
pnpm run mysql:up

# 停止MySQL服务
pnpm run mysql:down

# 查看MySQL日志
pnpm run mysql:logs

# 连接到MySQL数据库
pnpm run mysql:connect
```

### 完整Docker环境
```bash
# 构建镜像
pnpm run docker:build          # 生产环境
pnpm run docker:build:dev      # 开发环境

# 启动服务
pnpm run docker:up             # 生产环境
pnpm run docker:up:dev         # 开发环境

# 停止服务
pnpm run docker:down           # 生产环境
pnpm run docker:down:dev       # 开发环境

# 查看日志
pnpm run docker:logs           # 生产环境
pnpm run docker:logs:dev       # 开发环境

# 进入容器
docker exec -it ecommerce_backend bash
docker exec -it ecommerce_mysql_simple mysql -u root -p

# 查看容器状态
docker ps
```

## 故障排除

1. **端口冲突**: 确保3001和3306端口未被占用
2. **数据库连接失败**: 等待MySQL容器完全启动（约30秒）
3. **权限问题**: 确保Docker有足够权限访问项目目录
4. **数据持久化**: 数据存储在Docker volume中，删除容器不会丢失数据
5. **Node.js镜像下载失败**: 使用推荐的MySQL+本地后端方式

## 注意事项

1. 首次启动可能需要较长时间下载镜像和初始化数据库
2. 推荐使用MySQL Docker + 本地后端的方式进行开发
3. 开发环境支持热重载，代码修改会自动重启应用
4. 生产环境使用构建后的代码，性能更好但不支持热重载
5. 数据库密码建议在生产环境中修改为更安全的值

## API测试

启动服务后，可以访问以下地址：

- **API文档**: http://localhost:3001/api
- **健康检查**: http://localhost:3001/health
- **示例API**: http://localhost:3001/products