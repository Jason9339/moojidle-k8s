# Docker Image 使用說明

這份文件說明如何 build frontend/backend Docker image。`docker-compose.yml` 已移到 [`_archive/docker-compose.yml`](./_archive/docker-compose.yml)，目前不作為主要啟動方式。

## Frontend Image

frontend image 使用 multi-stage build：

- `builder`: 執行 Vite production build
- `runner`: 使用 nginx unprivileged image 提供靜態檔案

預設 API base URL 是 `/api`，會在 build time 寫入 Vite bundle：

```bash
docker build \
  --build-arg VITE_API_BASE_URL=/api \
  -t moojidle-frontend:latest \
  ./project/frontend
```

如果部署環境需要不同 API base URL，可以調整 build arg：

```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://example.com/api \
  -t moojidle-frontend:latest \
  ./project/frontend
```

frontend container 由 nginx 監聽 container port `80`：

```bash
docker run --rm -p 8080:80 moojidle-frontend:latest
```

## Backend Image

backend image 需要在 runtime 提供連線資訊：

```bash
docker build -t moojidle-backend:latest ./project/backend
```

```bash
docker run --rm \
  -e PORT=3000 \
  -e DATA_BASE_URL=mongodb://<mongo-host>:27017/moojidle \
  -p 3000:3000 \
  moojidle-backend:latest
```

## Push Images

請把 `YOUR_DOCKERHUB_USERNAME` 換成你的 Docker Hub 帳號：

```bash
docker tag moojidle-frontend:latest YOUR_DOCKERHUB_USERNAME/moojidle-frontend:latest
docker tag moojidle-backend:latest YOUR_DOCKERHUB_USERNAME/moojidle-backend:latest

docker push YOUR_DOCKERHUB_USERNAME/moojidle-frontend:latest
docker push YOUR_DOCKERHUB_USERNAME/moojidle-backend:latest
```

## Notes

Vite 的 `VITE_API_BASE_URL` 會在 build 階段被讀取；正式部署如果使用靜態 build，需要在 build image 時決定 API URL，或另外設計 runtime config。

frontend nginx 只負責提供靜態檔案與 SPA fallback，不在 container 內 proxy API request；API routing 應由部署環境的 ingress、gateway 或外部 proxy 處理。

上傳檔案目前透過 backend 存進 MongoDB GridFS，不需要把 `project/backend/uploads` 包進 image 或掛載到 container。
