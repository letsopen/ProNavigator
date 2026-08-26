# 阶段一：构建前端
FROM node:20-alpine AS web-builder

WORKDIR /app

COPY package*.json ./
COPY web/package*.json ./web/
RUN npm ci --no-audit --no-fund && cd web && npm ci --no-audit --no-fund

COPY . .
RUN cd web && npm run build

# 阶段二：运行后端
FROM node:20-alpine

WORKDIR /app

# 安装生产依赖
COPY package*.json ./
RUN npm ci --only=production --no-audit --no-fund

# 复制应用代码与构建产物
COPY . .
COPY --from=web-builder /app/public/dist ./public/dist

# 创建数据目录和上传目录
RUN mkdir -p /app/data /app/public/uploads

# 暴露端口
EXPOSE 3000

# 环境变量
ENV NODE_ENV=production
ENV DB_PATH=/app/data/nav.db
ENV UPLOAD_DIR=/app/public/uploads

CMD ["node", "src/app.js"]
