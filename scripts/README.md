# Moojidle Deployment Scripts

Terraform 建 AWS infra + K3s + Atlas 白名單，kubectl 部署應用

## 目錄

- [架構概覽](#架構概覽)
- [前置準備（第一次執行）](#前置準備第一次執行)
- [設定檔準備](#設定檔準備)
- [使用方式](#使用方式)
- [Terraform 功能概述](#terraform-功能概述)
- [手動步驟說明（不用 script 時）](#手動步驟說明不用-script-時)
- [注意事項](#注意事項)

## 架構概覽

```
┌───────────────────────────────────────────────────────────┐
│                    你的瀏覽器 / kubectl                     │
└──────────────┬────────────────────────┬──────────────────┘
               │ HTTP:80                │ HTTPS:6443
               ▼                        ▼
        ┌──────────────┐        ┌──────────────┐
        │  ALB (AWS)   │        │  NLB (AWS)   │
        │  app LB      │        │  k8s API LB  │
        └──────┬───────┘        └──────┬───────┘
               ▼                        ▼
        ┌──────────────┐        ┌──────────────┐
        │  Worker x 2  │        │  CP x 3      │
        │  (K3s agent) │        │  (K3s server)│
        └──────┬───────┘        └──────────────┘
               │
        ┌──────┴───────┐
        │  Pods:       │
        │  backend     │──── MongoDB Atlas
        │  frontend    │
        │  traefik     │
        └──────────────┘
```

**兩層互相獨立：**
- **基礎設施** — Terraform (`terraform/aws-k3s/`) 管 AWS 資源
- **應用程式** — K8s manifests (`deploy/`) 管 Pod 部署

詳見各層說明：
- Terraform 模組 → [`terraform/aws-k3s/README.md`](../terraform/aws-k3s/README.md)
- K8s 元件說明 → [`deploy/README.md`](../deploy/README.md)

---

## 前置準備（第一次執行）

### 1. 安裝工具

```bash
# macOS
brew install terraform kubectl

# Ubuntu / WSL
sudo apt-get update && sudo apt-get install -y gnupg software-properties-common wget curl

# 加入 HashiCorp 官方 apt repository
wget -O- https://apt.releases.hashicorp.com/gpg | \
  gpg --dearmor | \
  sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg > /dev/null
gpg --no-default-keyring \
  --keyring /usr/share/keyrings/hashicorp-archive-keyring.gpg \
  --fingerprint
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(grep -oP '(?<=UBUNTU_CODENAME=).*' /etc/os-release || lsb_release -cs) main" | \
  sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt-get update && sudo apt-get install -y terraform

# 安裝目前 stable 版 kubectl
ARCH="$(dpkg --print-architecture)"
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/${ARCH}/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
rm kubectl
```

### 2. AWS CLI 設定

```bash
aws configure --profile DS-Moojidle
# 填入 AWS Access Key + Secret Key（需要有 EC2 / VPC / ELB 建立權限）
```

### 3. EC2 Key Pair

進 AWS Console → EC2 → Key Pairs → **Create key pair** → 名稱取 `Moojidle`
> 目前 Jason9338 已加

把下載的 `Moojidle.pem` 放到專案**根目錄**：
> 你要換也可 但要改 deploy.sh

```bash
mv ~/Downloads/Moojidle.pem /path/to/moojidle-k8s/
chmod 400 Moojidle.pem
```

### 4. MongoDB Atlas API Key + API Access List（用在 `terraform.tfvars`）

Terraform 會透過 Atlas Admin API 將 EC2 節點 public IP 加入 MongoDB Atlas 的 Database Network Access，因此要先建立 API Key，並允許執行 Terraform 電腦的 public IP 呼叫 Atlas Admin API。

**(a) 查詢執行 Terraform 電腦的 public IP**

```bash
curl ifconfig.me
```

假設輸出為 `203.0.113.10`，後續要加入的 CIDR 是：

```text
203.0.113.10/32
```

**(b) 建立 Atlas API Key**

前往 Atlas 專案 → **Project Identity & Access** → **Applications** → **API Keys** → **Create Application API Key**

- Description 自訂，例如 `terraform-key`
- Project Permissions 選 **Project Owner**（目前只測過這個角色可用）
- 記下 **Public Key** 和 **Private Key**

> Private Key 只會完整顯示一次，請妥善保存。Public Key 和 Private Key 之後要填入 `terraform/aws-k3s/terraform.tfvars`。

**(c) 將 public IP 加入 API Key 的 Access List**

在 **Applications** → **API Keys** 找到剛建立的 Key，進入編輯頁面：

1. 確認 **API Key Information** 內的 Project Permissions 為 **Project Owner**
2. 點 **Next**
3. 在 **Private Key & Access List** 加入步驟 (a) 查到的 public IP CIDR
4. 儲存設定

> API Key 的 Access List 控制「哪些 IP 可以呼叫 Atlas Admin API」。它和 Database Network Access 的 IP Access List 是兩組獨立設定，不要混淆。

### 5. MongoDB Database User + 連線字串（用在 `deploy/backend.yml`）

**(a) 建立 Database User（若還沒有）**

前往 Atlas → **Database Access** → **Add New Database User**

- Authentication Method: **Password**
- 自訂帳號密碼
- Atlas admin 權限即可

**(b) 取得連線字串**

前往 Atlas → **Clusters** → 你的 Cluster → **Connect** → **Drivers**

複製這段：

```
mongodb+srv://<username>:<password>@cluster0.uyzxe9f.mongodb.net/
```

把 `<username>`、`<password>` 換成上一步設定的帳密，再加上資料庫名稱：

```
mongodb+srv://myUser:myPassword@cluster0.uyzxe9f.mongodb.net/moojidle?appName=Cluster0
```

(如果使用預設的 `test` database，就把 `/moojidle` 改為 `/test`)

這個就是 `deploy/backend.yml` 第 11 行要填的 `DATA_BASE_URL`。

> 你也可以先用 PowerShell / Atlas Compass 測試這個 URI 是否能連線。

---

## 設定檔準備

### `terraform/aws-k3s/terraform.tfvars`

```bash
cp terraform/aws-k3s/terraform.tfvars.example terraform/aws-k3s/terraform.tfvars
```

填寫以下內容：

```hcl
key_name = "Moojidle" # Step 3 key pair name

# 換成執行 Terraform 電腦目前的 public IP CIDR
ssh_cidr_blocks            = ["203.0.113.10/32"]
kubernetes_api_cidr_blocks = ["203.0.113.10/32"]

mongodbatlas_public_key  = "你的-public-key"
mongodbatlas_private_key = "你的-private-key"
mongodbatlas_project_id  = "你的-project-id"
```

> ⚠️ `terraform.tfvars` 含敏感資訊，**不要 commit 進 git**（已加進 `.gitignore`）

### `deploy/backend.yml`

編輯第 11 行，將 MongoDB URI 換成你自己的：

```yaml
DATA_BASE_URL: "mongodb+srv://<你的帳號>:<你的密碼>@cluster0.uyzxe9f.mongodb.net/<DB名稱>?appName=Cluster0"
```

> ⚠️ 這份 YAML 含資料庫密碼，commit 前請確認不是用真實密碼。

---

## 使用方式

### 部署完整環境

```bash
./scripts/deploy.sh
```

自動完成 5 個步驟：

| Step | 做的事 | 引用 |
|---|---|---|
| 1/5 | `terraform apply` 建立 AWS infra：VPC、SG、EC2、NLB、ALB | [`terraform/aws-k3s/main.tf`](../terraform/aws-k3s/main.tf) |
| 2/5 | 取 NLB DNS + Control Plane Public IP | [`terraform/aws-k3s/outputs.tf`](../terraform/aws-k3s/outputs.tf) |
| 3/5 | 等待 5 台 EC2 的 cloud-init 完成，SSH 進 CP 拿 kubeconfig，把 server 改為 NLB DNS | cloud-init 會自動安裝 K3s；本機 `kubectl` 透過 NLB 連 API server |
| 4/5 | 驗證所有 K3s nodes 都進入 `Ready` 狀態 | |
| 5/5 | `kubectl apply` 部署 backend + frontend + ingress，並將 Traefik ingress deployment 擴充為 3 個 replicas | [`deploy/backend.yml`](../deploy/backend.yml), [`deploy/frontend.yml`](../deploy/frontend.yml), [`deploy/ingress-rule.yml`](../deploy/ingress-rule.yml) |

執行後會顯示 ALB URL，開瀏覽器即可看到 Moojidle。

### cloud-init 初始化流程

Terraform 會透過 EC2 `user_data` 傳入初始化腳本，Ubuntu 開機後由 cloud-init 自動執行：

- 第一台 Control Plane：安裝 K3s server，使用 `--cluster-init` 建立 embedded etcd cluster
- 另外兩台 Control Plane：等待第一台 Control Plane 的 K3s API 可連線，再加入 embedded etcd cluster
- 兩台 Worker：等待 NLB 的 K3s API 可連線，再安裝 K3s agent 並加入 cluster

`./scripts/deploy.sh` 會依序透過 SSH 執行：

```bash
sudo cloud-init status --wait
```

確認 5 台 EC2 都完成初始化後，才會下載 kubeconfig 並部署應用程式。cloud-init 在遠端 EC2 執行，因此取得 kubeconfig 時仍需要 SSH。

如果任一節點初始化失敗或超過 10 分鐘，script 會顯示該節點的 cloud-init log 尾端。也可以手動 SSH 進該節點查看：

```bash
cloud-init status --long
sudo tail -n 100 /var/log/cloud-init-output.log
```

---

### 清理環境

```bash
./scripts/delete.sh
```

| Step | 做的事 |
|---|---|
| 1/3 | `kubectl delete` 刪掉 K8s 應用 |
| 2/3 | `terraform destroy` 清掉 AWS 所有資源 |
| 3/3 | 刪除本機 `~/.kube/moojidle-config` |

---

## Terraform 功能概述

`terraform/aws-k3s/` 做的事（對照 [`main.tf`](../terraform/aws-k3s/main.tf)）：

```mermaid
graph TD
    subgraph "Terraform aws-k3s 模組"
        A["data.aws_ami.ubuntu<br/>查最新 Ubuntu 24.04 AMI"] --> C
        B["data.aws_subnets.selected<br/>查 VPC 下的子網路"] --> C
        C["Security Groups + Rules<br/>4 組 SG (CP/Worker/NLB/ALB)<br/>+ 17 條 ingress/egress 規則"] --> D
        D["NLB + ALB<br/>NLB→6443 (kubectl API)<br/>ALB→80 (使用者流量)"] --> E
        E["EC2 Instances<br/>3 CP → K3s server (embedded etcd)<br/>2 Worker → K3s agent"] --> F
        F["mongodbatlas_project_ip_access_list<br/>自動將 5 台 EC2 public IP<br/>加入 Atlas 白名單"]
    end
```

| 資源 | 檔案行數 | 說明 |
|---|---|---|
| Security Groups | `main.tf:45-83` | 4 組 SG：control-plane、worker、nlb、alb |
| SG 規則 | `main.tf:85-230` | 開放 6443、2379、10250、8472、80、22 port 的限定流量 |
| NLB (k8s API) | `main.tf:232-266` | 公開 NLB :6443 → CP :6443 |
| ALB (應用) | `main.tf:268-303` | 公開 ALB :80 → Worker :80 |
| Control Plane x3 | `main.tf:305-367` | `--cluster-init` 建立 HA etcd 叢集，含 `--tls-san` 讓 NLB 憑證正確 |
| Worker x2 | `main.tf:369-397` | `K3S_URL=NLB_DNS` 透過 NLB 加入叢集 |
| Atlas 白名單 | `main.tf:414-430` | 收集所有節點 public IP → `mongodbatlas_project_ip_access_list` |

## 手動步驟說明（不用 script 時）

如果不想用自動 script，也可手動執行：

```bash
# 1. 部署 Infra
cd terraform/aws-k3s
terraform init
terraform apply

# 2. 取 kubeconfig
ssh -i Moojidle.pem ubuntu@<cp-ip> sudo cat /etc/rancher/k3s/k3s.yaml > ~/.kube/moojidle-config
sed -i '' 's/127.0.0.1/<nlb-dns>/g' ~/.kube/moojidle-config

# 3. 部署應用
KUBECONFIG=~/.kube/moojidle-config kubectl apply -f deploy/backend.yml
KUBECONFIG=~/.kube/moojidle-config kubectl apply -f deploy/frontend.yml
KUBECONFIG=~/.kube/moojidle-config kubectl apply -f deploy/ingress-rule.yml
```

詳細說明見各層 README：[`terraform/aws-k3s/README.md`](../terraform/aws-k3s/README.md) / [`deploy/README.md`](../deploy/README.md)

---

## 注意事項

- **兩種 Atlas IP Access List 不同**：
  - API Key Access List：位於 **Project Identity & Access** → **Applications** → **API Keys** → 編輯 Key → **Next** → **Private Key & Access List**。這會允許本機 Terraform 呼叫 Atlas Admin API。
  - Database Network Access：位於 **Database & Network Access** → **IP Access List**。`terraform apply` 會自動將 5 台 EC2 節點 public IP 加入這裡，讓 backend Pods 連線 MongoDB。
- **IP 變動時要同步更新**：如果執行 Terraform 電腦的 public IP 改變，重新執行 `curl ifconfig.me`，將新的 `<public-ip>/32` 更新到 API Key Access List、`terraform.tfvars` 的 `ssh_cidr_blocks` 和 `kubernetes_api_cidr_blocks`。
- **`ORG_REQUIRES_ACCESS_LIST` 排錯**：如果 `terraform apply` 出現 `HTTP 403 Forbidden` 和 `ORG_REQUIRES_ACCESS_LIST`，代表 API Key Access List 沒有放行目前的 public IP。請勿只更新 Database Network Access。
- **Database Network Access 安全性**：請確認 Atlas UI 內沒有 `0.0.0.0/0` 規則，否則 Database Network Access 白名單形同虛設。
- **費用**：3 台 t3.medium + 2 台 t3.small + NLB + ALB，每小時約 $0.5 USD，用完請記得 `./scripts/delete.sh`
- **SSH Key 路徑**：預設讀取根目錄的 `Moojidle.pem`，如果位置不同請修改 `scripts/deploy.sh` 第 8 行
