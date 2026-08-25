FROM node:20-alpine

WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm ci --only=production --no-audit --no-fund

# 复制应用代码
COPY . .

# 创建数据目录和上传目录
RUN mkdir -p /app/data /app/public/uploads

# 暴露端口
EXPOSE 3000

# 环境变量
ENV NODE_ENV=production
ENV DB_PATH=/app/data/nav.db
ENV UPLOAD_DIR=/app/public/uploads

CMD ["node", "src/app.js"]