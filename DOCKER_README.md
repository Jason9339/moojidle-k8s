# Docker Image 使用與發布說明

這份文件說明如何 build frontend/backend Docker image，並發布到 GitHub Container Registry（GHCR）。**請注意!!!** 由於本專案是一已開發完成的[另一篇 repo](https://gitlab.com/jingxiang0405/moojidle) 之拓展，source code 不會新增任何功能，故 image 只適用於發布，不是作為 local development 用 (換言之無法搭配 docker-compose，因為需使用 k8s Ingress 做前後端疏導)

官方文件：

- GitHub Docs: [Working with the Container registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- Docker Docs: [docker login](https://docs.docker.com/reference/cli/docker/login/)

## Login to GHCR

發布 image 到 `ghcr.io` 前，需要先登入 GitHub Container Registry。

1. 到 GitHub 建立 Personal Access Token (Settings --> Developer Settings --> Tokens (classic))。
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

- `dependencies`: 透過 lockfile (自動偵測 `npm` / `yarn` / `pnpm`) 乾淨安裝專案套件。
- `builder`: 執行 Production build。此階段已透過 `ENV VITE_API_BASE_URL=/api` 將 API 路徑寫入 Vite bundle。
- `runner`: 使用 nginx unprivileged image 提供靜態檔案

預設編譯參數 (Node.js: `25.9-slim`, Nginx: `alpine3.22`):

```bash
docker build -t ghcr.io/jason9339/moojidle-k8s/frontend:latest ./project/frontend
```

如果需要因應相容性或資安要求覆蓋 Node.js 或 Nginx 的版本，可以使用 `--build-arg`:

```bash
docker build \
  --build-arg NODE_VERSION=24.13.0-slim \
  --build-arg NGINXINC_IMAGE_TAG=alpine-slim \
  -t ghcr.io/jason9339/moojidle-k8s/frontend:latest \
  ./project/frontend
```

## Backend Image

```bash
docker build -t ghcr.io/jason9339/moojidle-k8s/backend:latest ./project/backend
```

## Notes

- **環境變數與安全隔離**：根據 `.dockerignore` 的設定，本地端的 `.env`、`.env.*`、`node_modules`、`dist`、`tests` 在 build image 時都會被排除。這確保了 image 內的環境絕對乾淨，不會意外打包本地的機密資訊或快取。
- **API Base URL**：目前 Vite 的 `VITE_API_BASE_URL` 是在 `Dockerfile` 內部被 `ENV` 寫死為 `/api` 並於 build 階段寫入 bundle。若部署環境需要使用完全不同的外部 API 網址 (例如 https://example.com/api) ，請直接修改 `Dockerfile` 內的 `ENV`，並重 build frontend image。
- **Nginx 職責**：Frontend Nginx 只負責提供靜態檔案與 SPA fallback（透過自訂 `nginx.conf`），不在 container 內 proxy API request。API routing 應由 k8s 的 Ingress 處理。
- 上傳檔案透過 backend 存進 MongoDB GridFS，不需要把 `project/backend/uploads` 包進 image 或掛載到 container。
