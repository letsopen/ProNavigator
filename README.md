# ProNavigator

一个基于 Node.js + Express + SQLite 构建的公司内部导航站（ProNavigator）。支持管理员维护分类与网站信息，访客无需登录即可浏览首页并查看网站详情。

## 功能特性

- **分类管理**：支持新增、编辑、删除分类，分类名称唯一。
- **网站管理**：支持新增、编辑、删除网站，包含名称、URL、Logo、Markdown 说明。
- **Markdown 详情页**：编辑时使用 Toast UI Editor，展示时渲染为排版后的 HTML。
- **拖拽排序**：分类和网站均支持拖拽调整顺序，立即保存。
- **单管理员认证**：基于 JWT Token 认证，支持修改密码。
- **Docker 部署**：提供 Dockerfile 与 docker-compose.yml，支持数据持久化。
- **GitHub Actions**：自动构建 `linux/amd64` 平台 Docker 镜像。

## 技术栈

- Node.js 20 + Express
- SQLite + better-sqlite3
- Vue 3 + Vite + 腾讯 TDesign
- Toast UI Editor + marked + DOMPurify
- JWT（jsonwebtoken）
- Docker + GitHub Actions

## 本地运行

### 环境要求

- Node.js 20+
- npm 10+

### 安装与启动

```bash
# 克隆仓库
git clone <repository-url>
cd pronavigator

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env，修改 JWT_SECRET 等配置

# 启动开发服务器
npm run dev
```

启动后访问：

- 公开首页：http://localhost:3000/
- 管理后台：http://localhost:3000/admin/login

### 默认管理员账号

- 用户名：`admin`
- 密码：`admin123`

**首次登录后请立即修改默认密码。**

## Docker 部署

### 使用 docker-compose 部署

```bash
# 克隆仓库
git clone <repository-url>
cd pronavigator

# 设置环境变量
export JWT_SECRET="your-secure-random-secret-key-at-least-32-characters-long"

# 启动容器
docker-compose up -d
```

### 使用 Docker 直接运行

```bash
# 构建镜像
docker build -t pronavigator:latest .

# 运行容器
docker run -d \
  -p 3000:3000 \
  -e JWT_SECRET="your-secure-random-secret-key-at-least-32-characters-long" \
  -v company-nav-data:/app/data \
  -v company-nav-uploads:/app/public/uploads \
  --name pronavigator \
  pronavigator:latest
```

### 数据持久化说明

必须将以下目录挂载到宿主机或命名卷，否则容器重建后数据会丢失：

- `/app/data`：SQLite 数据库文件
- `/app/public/uploads`：上传的 Logo 文件

## GitHub Actions

本仓库已配置 GitHub Actions 工作流（`.github/workflows/docker-build.yml`），在代码推送到 `main` 分支后自动执行以下步骤：

1. 安装依赖
2. 运行代码检查（`npm run lint`）
3. 运行测试（`npm test`）
4. 构建并推送 `linux/amd64` 平台 Docker 镜像到 GitHub Container Registry（ghcr.io）

### 镜像标签

- `latest`
- 基于 Git commit SHA 的标签
- 基于语义化版本的标签（当推送 tag 时）

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `PORT` | 服务端口 | `3000` |
| `DB_PATH` | SQLite 数据库文件路径 | `./data/nav.db` |
| `UPLOAD_DIR` | Logo 上传目录 | `./public/uploads` |
| `JWT_SECRET` | JWT 签名密钥（生产环境必须修改） | 空 |
| `JWT_EXPIRES_IN` | JWT 过期时间 | `2h` |
| `LOG_LEVEL` | 日志级别 | `info` |

## 开发与测试

```bash
# 运行 lint
npm run lint

# 运行测试
npm test

# 开发模式热启动
npm run dev

# 单独构建前端
npm run build:web
```

## 项目结构

```
pronavigator/
├── .github/workflows/    # GitHub Actions 工作流
├── data/                 # SQLite 数据目录
├── migrations/           # 数据库迁移脚本
├── public/               # 静态资源与上传文件
├── src/                  # 后端源代码
│   ├── config/           # 配置
│   ├── controllers/      # 控制器
│   ├── middleware/       # 中间件
│   ├── models/           # 数据库连接与迁移
│   ├── routes/           # 路由
│   ├── services/         # 业务逻辑
│   ├── utils/            # 工具函数
│   └── app.js            # 应用入口
├── tests/                # 测试
├── web/                  # Vue 前端源码
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

## 许可证

MIT