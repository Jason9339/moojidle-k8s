# Docker Image 使用與發布說明

這份文件說明如何 build frontend/backend Docker image，並發布到 GitHub Container Registry（GHCR）。`docker-compose.yml` 已移到 [`_archive/docker-compose.yml`](./_archive/docker-compose.yml)，目前不作為主要啟動方式。

官方文件：

- GitHub Docs: [Working with the Container registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- Docker Docs: [docker login](https://docs.docker.com/reference/cli/docker/login/)

## Login to GHCR

發布 image 到 `ghcr.io` 前，需要先登入 GitHub Container Registry。

1. 到 GitHub 建立 Personal Access Token（classic）。
2. Token 至少需要 `write:packages` 權限；如果要讀取 private package，另需 `read:packages`。
3. 用 GitHub 帳號與 token 登入 `ghcr.io`。

```bash
export CR_PAT=<YOUR_GITHUB_PERSONAL_ACCESS_TOKEN>
echo "$CR_PAT" | docker login ghcr.io -u <YOUR_GITHUB_USERNAME> --password-stdin
```

登入成功後，後續 `docker push ghcr.io/...` 會使用這組認證。

## Build and Push Images

如果要依照目前 repository 的 GHCR image name 重新 build 並上傳，從專案根目錄執行：

```bash
docker build -t ghcr.io/jason9339/moojidle-k8s/backend:latest ./project/backend
docker build -t ghcr.io/jason9339/moojidle-k8s/frontend:latest ./project/frontend

docker push ghcr.io/jason9339/moojidle-k8s/backend:latest
docker push ghcr.io/jason9339/moojidle-k8s/frontend:latest
```

## Frontend Image

frontend image 使用 multi-stage build：

- `builder`: 執行 Vite production build
- `runner`: 使用 nginx unprivileged image 提供靜態檔案

預設 API base URL 是 `/api`，會在 build time 寫入 Vite bundle：

```bash
docker build \
  --build-arg VITE_API_BASE_URL=/api \
  -t ghcr.io/jason9339/moojidle-k8s/frontend:latest \
  ./project/frontend
```

如果部署環境需要不同 API base URL，可以調整 build arg：

```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://example.com/api \
  -t ghcr.io/jason9339/moojidle-k8s/frontend:latest \
  ./project/frontend
```

## Backend Image

backend image 需要在 runtime 提供連線資訊：

```bash
docker build -t ghcr.io/jason9339/moojidle-k8s/backend:latest ./project/backend
```

## Local Run

frontend container 由 nginx 監聽 container port `80`：

```bash
docker run --rm -p 8080:80 ghcr.io/jason9339/moojidle-k8s/frontend:latest
```

backend container 需要在 runtime 提供連線資訊：

```bash
docker run --rm \
  -e PORT=3000 \
  -e DATA_BASE_URL=mongodb://<mongo-host>:27017/moojidle \
  -p 3000:3000 \
  ghcr.io/jason9339/moojidle-k8s/backend:latest
```

## Notes

Vite 的 `VITE_API_BASE_URL` 會在 build 階段被讀取；正式部署如果使用靜態 build，需要在 build image 時決定 API URL，或另外設計 runtime config。

frontend nginx 只負責提供靜態檔案與 SPA fallback，不在 container 內 proxy API request；API routing 應由部署環境的 ingress、gateway 或外部 proxy 處理。

上傳檔案目前透過 backend 存進 MongoDB GridFS，不需要把 `project/backend/uploads` 包進 image 或掛載到 container。
