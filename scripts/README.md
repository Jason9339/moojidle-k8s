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
sudo apt update && sudo apt install -y terraform kubectl
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

### 4. MongoDB Atlas API Key（用在 `terraform.tfvars`）

前往 Atlas → 左側齒輪 **Access Manager** → **API Keys**

- **Create Application API Key**
- Permission 選 **Project Owner**（目前只測過這個角色可用）
- 記下 **Public Key** 和 **Private Key**

![](https://www.mongodb.com/docs/atlas/images/access-manager/api-key-view.drawio.svg)

> 這兩組 key 不會過期，但要自己保存好。

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
| 3/5 | SSH 進 CP 拿 kubeconfig，把 server 改為 NLB DNS | 讓 `kubectl` 可從本機透過 NLB 連 API server |
| 4/5 | 驗證 `kubectl get nodes` 正常 | |
| 5/5 | `kubectl apply` 部署 backend + frontend + ingress | [`deploy/backend.yml`](../deploy/backend.yml), [`deploy/frontend.yml`](../deploy/frontend.yml), [`deploy/ingress-rule.yml`](../deploy/ingress-rule.yml) |

執行後會顯示 ALB URL，開瀏覽器即可看到 Moojidle。

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

- **MongoDB Atlas 白名單**：`terraform apply` 時會自動將所有 EC2 public IP 加入白名單。請確認 Atlas UI 內沒有 `0.0.0.0/0` 規則，否則白名單形同虛設。
- **費用**：3 台 t3.medium + 2 台 t3.small + NLB + ALB，每小時約 $0.5 USD，用完請記得 `./scripts/delete.sh`
- **SSH Key 路徑**：預設讀取根目錄的 `Moojidle.pem`，如果位置不同請修改 `scripts/deploy.sh` 第 8 行
