# 阶段一：构建产物与依赖
FROM node:20-alpine AS builder

WORKDIR /app

# 安装依赖
COPY package*.json ./
COPY web/package*.json ./web/
RUN npm ci --no-audit --no-fund && cd web && npm ci --no-audit --no-fund

# 构建前端
COPY . .
RUN cd web && npm run build

# 阶段二：运行后端
FROM node:20-alpine

WORKDIR /app

# 复制应用代码、构建产物与依赖
COPY . .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public/dist ./public/dist

# 创建数据目录和上传目录
RUN mkdir -p /app/data /app/public/uploads

# 暴露端口
EXPOSE 3000

# 环境变量
ENV NODE_ENV=production
ENV DB_PATH=/app/data/nav.db
ENV UPLOAD_DIR=/app/public/uploads

CMD ["node", "src/app.js"]
