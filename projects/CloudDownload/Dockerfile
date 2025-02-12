# 构建 React 项目
FROM node:18-alpine3.19 as frontend-builder
WORKDIR /app/frontend
#COPY frontend/package*.json ./
COPY frontend .
RUN npm config set registry https://mirrors.cloud.tencent.com/npm/
RUN npm install
RUN npm run build

# 构建 NestJS 项目
FROM node:18-alpine3.19 as backend-builder
WORKDIR /app/backend
#COPY backend/package*.json ./
COPY backend .
RUN npm config set registry https://registry.npmmirror.com/
RUN npm install
RUN npm run build

# 最终镜像
FROM node:20-bookworm

# 更换为阿里云镜像源
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
# 安装 Node.js 和 supervisord
RUN apk add --no-cache nginx supervisor
# 安装 npm
RUN apk add --no-cache npm

WORKDIR /app

# 复制 React 构建产物到 Nginx 静态文件目录
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html
# 复制 Nginx 配置文件
COPY --from=frontend-builder /app/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# 复制 NestJS 构建产物和依赖
COPY --from=backend-builder /app/backend/package*.json ./backend/
COPY --from=backend-builder /app/backend/dist ./backend/dist
RUN cd backend && npm install --production

# 安装 Playwright 及其浏览器
RUN npm config set registry https://registry.npmmirror.com/
RUN npx playwright install chromium

# 启动 Chromium 时禁用沙盒
RUN echo 'export CHROMIUM_FLAGS="--no-sandbox"' >> /etc/environment

# 复制 supervisord 配置文件
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# 暴露 React 端口
EXPOSE 3000 3001

# 启动 supervisord
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]