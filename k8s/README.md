# Moojidle Kubernetes README

這個資料夾是 Moojidle 的 Kubernetes 部署設定。它會把 MongoDB、Mongo 初始化 Job、backend、frontend 一起部署到 Kubernetes cluster 裡。

從專案根目錄執行：

```bash
kubectl apply -k k8s
```

`-k k8s` 代表使用 `k8s/kustomization.yaml`，一次套用這個資料夾列出的所有 YAML。

## 這個資料夾在做什麼

`kustomization.yaml` 是這組設定的入口：

```text
k8s/
├── kustomization.yaml
├── 00-namespace.yaml
├── 01-mongo.yaml
├── 02-mongo-init-job.yaml
├── 03-backend.yaml
└── 04-frontend.yaml
```

### `00-namespace.yaml`

建立 `moojidle` namespace。這讓 Moojidle 的 Kubernetes resources 集中放在同一個 namespace 裡。

### `01-mongo.yaml`

建立 MongoDB 相關資源：

- `PersistentVolumeClaim/mongo-data`: MongoDB 的資料儲存空間，大小是 `2Gi`
- `Deployment/mongo`: 使用 `mongo:8.0` image 跑 MongoDB
- `Service/mongo`: 讓 cluster 內其他服務可以用 `mongo:27017` 連到 MongoDB

MongoDB 的資料掛載在 container 的 `/data/db`。assignment、material、submitted assignment、profile image 等上傳檔案如果存在 MongoDB/GridFS，也會跟著存在這個資料庫資料裡。

### `02-mongo-init-job.yaml`

建立一次性的 `Job/mongo-init-counter`。它會：

1. 等 MongoDB 可以連線
2. 連到 `mongodb://mongo:27017/moojidle`
3. 初始化 `counter` collection 的預設欄位

這個 Job 使用 `$setOnInsert`，所以如果 counter 資料已經存在，它不會覆蓋原本資料。

Job 成功後狀態會是 `Completed`。之後再次執行 `kubectl apply -k k8s` 通常只會看到：

```text
job.batch/mongo-init-counter unchanged
```

這代表設定沒有變，不代表錯誤。

### `03-backend.yaml`

建立 backend 相關資源：

- `Deployment/backend`: 使用 `nonohuang0819/moojidle-backend:latest`
- `Service/backend`: cluster 內的 backend service，port `3000`

backend 目前使用這些環境變數：

```text
PORT=3000
DATA_BASE_URL=mongodb://mongo:27017/moojidle
```

### `04-frontend.yaml`

建立 frontend 相關資源：

- `Deployment/frontend`: 使用 `nonohuang0819/moojidle-frontend:latest`
- `Service/frontend`: cluster 內的 frontend service，port `5173`

frontend 目前使用：

```text
VITE_API_BASE_URL=http://localhost:3000
```

注意：在瀏覽器裡，`localhost` 是使用者自己的電腦，不是 Kubernetes 裡的 backend。這在本機 port-forward 測試時通常可以用；如果要正式對外部署，通常要改成實際 backend URL 或 Ingress 路徑。

## 部署

先確認 kubectl 目前連到哪個 cluster：

```bash
kubectl config current-context
kubectl get nodes
```

如果使用 kind，可以建立一個本機 cluster：

```bash
kind create cluster --name kind-scale-lab
kubectl config use-context kind-kind-scale-lab
```

從專案根目錄部署：

```bash
kubectl apply -k k8s
```

如果看到很多 `unchanged`，代表 Kubernetes 發現目前 cluster 裡的設定已經跟 YAML 一樣，所以沒有需要更新的地方。這是正常狀態。

## 等服務啟動

```bash
kubectl -n moojidle wait --for=condition=available deployment/mongo --timeout=180s
kubectl -n moojidle wait --for=condition=complete job/mongo-init-counter --timeout=180s
kubectl -n moojidle wait --for=condition=available deployment/backend --timeout=180s
kubectl -n moojidle wait --for=condition=available deployment/frontend --timeout=180s
```

查看目前資源：

```bash
kubectl -n moojidle get pods,svc,pvc
```

正常時會看到：

- `backend` Pod: `Running`
- `frontend` Pod: `Running`
- `mongo` Pod: `Running`
- `mongo-init-counter` Job Pod: `Completed`
- `mongo-data` PVC: `Bound`

## 在本機打開服務

開兩個 terminal。

Terminal 1，轉發 backend：

```bash
kubectl -n moojidle port-forward svc/backend 3000:3000
```

Terminal 2，轉發 frontend：

```bash
kubectl -n moojidle port-forward svc/frontend 5173:5173
```

然後打開：

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

`http://localhost:3000` 可能顯示 `Cannot GET /`。這通常沒問題，代表 backend 沒有定義 `/` route；實際 API route 才是重點。

## 查看 logs

```bash
kubectl -n moojidle logs deployment/backend -f
kubectl -n moojidle logs deployment/frontend -f
kubectl -n moojidle logs deployment/mongo -f
```

查看初始化 Job log：

```bash
kubectl -n moojidle logs job/mongo-init-counter
```

## 查看 MongoDB 內容

最簡單的方式是直接進 Mongo Pod 裡開 `mongosh`：

```bash
kubectl -n moojidle exec -it deployment/mongo -- mongosh moojidle
```

進去後可以查看有哪些 collections：

```javascript
show collections
```

查看每個 collection 有幾筆資料：

```javascript
db.getCollectionNames().forEach(c => print(c, db[c].countDocuments()))
```

查看上傳檔案 metadata：

```javascript
db.uploaded_files.files.find().pretty()
```

查看上傳檔案 chunks 數量：

```javascript
db.uploaded_files.chunks.countDocuments()
```

只看教材檔案：

```javascript
db.uploaded_files.files.find({"metadata.category": "material"}).pretty()
```

只看作業附件：

```javascript
db.uploaded_files.files.find({"metadata.category": "assignment"}).pretty()
```

離開 Mongo shell：

```javascript
exit
```

也可以不進互動模式，直接從終端執行 MongoDB 指令。

查看 collections：

```bash
kubectl -n moojidle exec deployment/mongo -- mongosh moojidle --eval 'show collections'
```

查看上傳檔案 metadata：

```bash
kubectl -n moojidle exec deployment/mongo -- mongosh moojidle --eval 'db.uploaded_files.files.find({}, {filename: 1, length: 1, contentType: 1, uploadDate: 1, metadata: 1}).pretty()'
```

## 更新 frontend/backend image 後重啟

backend 和 frontend 使用 `latest` tag：

```text
nonohuang0819/moojidle-backend:latest
nonohuang0819/moojidle-frontend:latest
```

即使 `imagePullPolicy: Always`，如果 Deployment YAML 沒有變，`kubectl apply -k k8s` 不一定會重建 Pod。推送新的 `latest` image 後，可以手動 rollout restart：

```bash
kubectl -n moojidle rollout restart deployment/backend
kubectl -n moojidle rollout restart deployment/frontend
```

確認 rollout 狀態：

```bash
kubectl -n moojidle rollout status deployment/backend
kubectl -n moojidle rollout status deployment/frontend
```

## 重新執行 Mongo 初始化 Job

`Job/mongo-init-counter` 成功後不會因為 `kubectl apply -k k8s` 自動再跑一次。如果真的要重跑：

```bash
kubectl -n moojidle delete job mongo-init-counter
kubectl apply -k k8s
```

這個 Job 目前只會補上不存在的 counter 預設資料，不會清空 MongoDB。

## 停止服務但保留 MongoDB 資料

如果只是想把 Kubernetes 裡的服務停下來，但保留 MongoDB 裡已上傳的 assignment、material 等資料，建議把 Deployment scale 到 `0`：

```bash
kubectl -n moojidle scale deployment/backend --replicas=0
kubectl -n moojidle scale deployment/frontend --replicas=0
kubectl -n moojidle scale deployment/mongo --replicas=0
```

這會停止 Pod，但保留：

- Deployment
- Service
- `PersistentVolumeClaim/mongo-data`

只要 `mongo-data` PVC 還在，MongoDB 的資料通常就還在。

確認 PVC：

```bash
kubectl -n moojidle get pvc
```

如果看到 `mongo-data` 狀態是 `Bound`，代表 MongoDB 仍有綁定的儲存空間。

## 重新啟動服務

```bash
kubectl -n moojidle scale deployment/mongo --replicas=1
kubectl -n moojidle scale deployment/backend --replicas=1
kubectl -n moojidle scale deployment/frontend --replicas=1
```

再檢查：

```bash
kubectl -n moojidle get pods,svc
kubectl -n moojidle get pvc -o wide
```

## 刪除資源與資料風險

### 不建議直接刪整包，如果你想保留 MongoDB 資料

這個指令會刪除 `k8s/` 裡定義的 Kubernetes resources：

```bash
kubectl delete -k k8s
```

因為 `mongo-data` PVC 也定義在 `01-mongo.yaml` 裡，所以這個指令可能會刪掉 PVC。PVC 一旦刪掉，MongoDB 的資料是否還能找回取決於你的 cluster storage 設定，但本機 kind/minikube 環境通常可以當成資料有高機率會不見。

如果你要保留資料，不要刪：

```bash
kubectl -n moojidle delete pvc mongo-data
```

也不要刪整個 namespace：

```bash
kubectl delete namespace moojidle
```

刪 namespace 會把 namespace 裡的資源一起刪掉，包含 PVC。

### 刪除 app，但保留 MongoDB PVC

如果想移除 Pod/Service/Job，但保留 MongoDB 資料，可以刪這些：

```bash
kubectl -n moojidle delete deployment backend frontend mongo
kubectl -n moojidle delete service backend frontend mongo
kubectl -n moojidle delete job mongo-init-counter
```

不要刪 `mongo-data` PVC。

之後如果再執行：

```bash
kubectl apply -k k8s
```

Kubernetes 會重新建立 Deployment/Service/Job，MongoDB 會重新掛回同名 PVC。

### 真的要清空 MongoDB 資料

如果確定要刪掉 MongoDB 的資料：

```bash
kubectl -n moojidle delete pvc mongo-data
```

這會影響 MongoDB 裡的資料，包含上傳檔案 metadata 和 GridFS chunks。執行前請先確認你不需要這些資料，或已經有備份。

## 常用指令總表

```bash
# 部署
kubectl apply -k k8s

# 查看狀態
kubectl -n moojidle get pods,svc
kubectl -n moojidle get pvc -o wide

# 查看 logs
kubectl -n moojidle logs deployment/backend -f
kubectl -n moojidle logs deployment/frontend -f
kubectl -n moojidle logs deployment/mongo -f

# 進 MongoDB shell
kubectl -n moojidle exec -it deployment/mongo -- mongosh moojidle

# 停止但保留資料
kubectl -n moojidle scale deployment/backend --replicas=0
kubectl -n moojidle scale deployment/frontend --replicas=0
kubectl -n moojidle scale deployment/mongo --replicas=0

# 重新啟動
kubectl -n moojidle scale deployment/mongo --replicas=1
kubectl -n moojidle scale deployment/backend --replicas=1
kubectl -n moojidle scale deployment/frontend --replicas=1

# 更新 latest image 後重啟 Pod
kubectl -n moojidle rollout restart deployment/backend
kubectl -n moojidle rollout restart deployment/frontend

# 本機開 frontend/backend
kubectl -n moojidle port-forward svc/backend 3000:3000
kubectl -n moojidle port-forward svc/frontend 5173:5173
```
