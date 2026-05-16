# Docker Compose 使用說明

這份設定會啟動三個服務：

- `frontend`: React + Vite，對外 port `5173`
- `backend`: Express API，對外 port `3000`
- `mongo`: MongoDB，只提供給 Compose 內的 backend 使用

## 第一次啟動

請在專案根目錄執行：

```bash
docker compose up --build
```

啟動後可以打開：

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- MongoDB container URL: `mongodb://mongo:27017/moojidle`

## 之後啟動

```bash
docker compose up
```

如果想讓服務在背景執行：

```bash
docker compose up -d
```

## 停止服務

```bash
docker compose down
```

這個指令會停止並移除 container，但 MongoDB 資料仍會保留在 Docker volume。

## 清掉 MongoDB 資料

如果想把 MongoDB volume 一起刪掉，重新建立空資料庫：

```bash
docker compose down -v
```

## 環境變數

`docker-compose.yml` 已經幫容器設定好需要的環境變數：

- backend:
  - `PORT=3000`
  - `DATA_BASE_URL=mongodb://mongo:27017/moojidle`
- frontend:
  - `VITE_API_BASE_URL=http://localhost:3000`

因此使用 Docker Compose 時，不需要額外建立 `.env` 才能啟動。

## 上傳檔案存在哪裡

目前後端的上傳流程使用 `multer.memoryStorage()` 先把檔案放在記憶體，再透過 `SaveFile` 存進 MongoDB GridFS。

所以課程教材、作業、考試、學生繳交作業、頭像等上傳檔案，不會直接出現在 `project/backend/uploads` 或 container 的 `/app/uploads` 裡。實際檔案會存在 MongoDB 裡：

- metadata: `uploaded_files.files`
- binary chunks: `uploaded_files.chunks`

MongoDB 資料本身保存在 Docker volume：

- volume name: `moojidle-k8s_mongo-data`
- container path: `/data/db`

查看已上傳檔案 metadata：

```bash
docker compose exec mongo mongosh moojidle --eval 'db.uploaded_files.files.find({}, {filename: 1, length: 1, contentType: 1, uploadDate: 1, metadata: 1}).pretty()'
```

只看教材檔案：

```bash
docker compose exec mongo mongosh moojidle --eval 'db.uploaded_files.files.find({"metadata.category": "material"}).pretty()'
```

常見 category：

- `material`: 課程教材檔案
- `assignment`: 作業附件
- `exam`: 考試附件
- `submitted_assignment`: 學生繳交作業附件
- `profiles`: 使用者頭像

如果你想進 MongoDB shell 互動查看：

```bash
docker compose exec mongo mongosh moojidle
```

進去後可以執行：

```javascript
show collections
db.uploaded_files.files.find().pretty()
db.uploaded_files.chunks.countDocuments()
```

## 常用除錯指令

查看所有服務 log：

```bash
docker compose logs -f
```

只看後端 log：

```bash
docker compose logs -f backend
```

只重建前端：

```bash
docker compose up --build frontend
```

進入 MongoDB shell：

```bash
docker compose exec mongo mongosh moojidle
```

如果你需要從本機工具直接連到 container MongoDB，可以在 `docker-compose.yml` 的 `mongo` 服務加上：

```yaml
ports:
  - "27017:27017"
```

若本機已經有 MongoDB 佔用 `27017`，請改成 `"27018:27017"`，再用 `mongodb://localhost:27018/moojidle` 連線。
