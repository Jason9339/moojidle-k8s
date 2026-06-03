#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TF_DIR="$PROJECT_ROOT/terraform/aws-k3s"
DEPLOY_DIR="$PROJECT_ROOT/deploy"
BACKEND_SECRET="$DEPLOY_DIR/backend-secret.yml"
SSH_KEY="$PROJECT_ROOT/Moojidle.pem" # You maybe need to adjust this path if your SSH key is located elsewhere
KUBECONFIG="$HOME/.kube/moojidle-config"
SSH_OPTIONS=(-o StrictHostKeyChecking=no -o ConnectTimeout=10 -i "$SSH_KEY")

if command -v python3 >/dev/null 2>&1; then
  PYTHON_BIN="python3"
else
  PYTHON_BIN="python"
fi

check_atlas_api_ip() {
  echo "Checking MongoDB Atlas API access for your current IP..."
  local tfvars_file="$TF_DIR/terraform.tfvars"

  # Extract the credentials directly from terraform.tfvars
  local pub_key=$(grep -E '^[[:space:]]*mongodbatlas_public_key' "$tfvars_file" | sed 's/.*"\(.*\)".*/\1/' || true)
  local priv_key=$(grep -E '^[[:space:]]*mongodbatlas_private_key' "$tfvars_file" | sed 's/.*"\(.*\)".*/\1/' || true)
  local project_id=$(grep -E '^[[:space:]]*mongodbatlas_project_id' "$tfvars_file" | sed 's/.*"\(.*\)".*/\1/' || true)

  if [[ -n "$pub_key" && -n "$priv_key" && -n "$project_id" ]]; then
    # Atlas requires Digest authentication. We ping the groups (projects) endpoint to verify access.
    local http_status=$(curl -s -o /dev/null -w "%{http_code}" --digest -u "$pub_key:$priv_key" \
      "https://cloud.mongodb.com/api/atlas/v1.0/groups/$project_id")

    if [[ "$http_status" == "401" || "$http_status" == "403" ]]; then
      local my_ip=$(curl -s ifconfig.me)
      echo ""
      echo "====================================================================="
      echo " ERROR: MongoDB Atlas API Connection Refused (HTTP $http_status)"
      echo "====================================================================="
      echo " Your current public IP ($my_ip) is missing from the"
      echo " MongoDB Atlas Programmatic API Key Access List."
      echo " "
      echo " Please log into Atlas, update your API Key's IP whitelist,"
      echo " and run this script again."
      echo " Aborting deployment to prevent orphaned AWS resources."
      echo "====================================================================="
      exit 1
    elif [[ "$http_status" != "200" ]]; then
      echo "WARNING: MongoDB Atlas API returned HTTP $http_status. Deployment might fail."
    else
      echo "MongoDB Atlas API connectivity verified."
    fi
  else
    echo "WARNING: Could not parse MongoDB Atlas credentials from tfvars. Skipping API check."
  fi
}

confirm_alarm_email() {
  local tfvars_file="$TF_DIR/terraform.tfvars"

  # Check if alarm_email is already configured in the file
  if grep -Eq '^[[:space:]]*alarm_email[[:space:]]*=[[:space:]]*".+"' "$tfvars_file"; then
    return 0
  fi

  echo "WARNING: CloudWatch Alarm email is missing in terraform.tfvars."
  read -rp "Please enter the email address for SNS alerts: " ALARM_EMAIL
  
  if [[ -z "$ALARM_EMAIL" ]]; then
    echo "ERROR: Email cannot be empty. Aborted."
    exit 1
  fi
  
  # Automatically append it to terraform.tfvars
  echo -e "\n# CloudWatch Alarms Configuration" >> "$tfvars_file"
  echo "alarm_email = \"$ALARM_EMAIL\"" >> "$tfvars_file"
  echo "Successfully added alarm_email to terraform.tfvars."
  echo ""
}

confirm_domain_config() {
  local tfvars_file="$TF_DIR/terraform.tfvars"

  if [[ -f "$tfvars_file" ]] && grep -Eq '^[[:space:]]*domain_name[[:space:]]*=' "$tfvars_file"; then
    return 0
  fi

  read -rp "You have not configured a domain name and Cloudflare. Continue? [y/N] " confirm
  if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
    echo "Aborted."
    exit 1
  fi
}

tf_output_ips() {
  terraform -chdir="$TF_DIR" output -json "$1" | "$PYTHON_BIN" -c \
    'import json, sys; print("\n".join(json.load(sys.stdin)))'
}

wait_for_ssh() {
  local ip="$1"
  local label="$2"

  echo "Waiting for SSH on $label ($ip)..."
  for i in $(seq 1 30); do
    if ssh "${SSH_OPTIONS[@]}" "ubuntu@$ip" "true" 2>/dev/null; then
      return 0
    fi
    sleep 10
  done

  echo "ERROR: SSH did not become ready on $label ($ip) within 5 minutes."
  return 1
}

wait_for_cloud_init() {
  local ip="$1"
  local label="$2"

  wait_for_ssh "$ip" "$label"
  echo "Waiting for cloud-init on $label ($ip)..."
  if ! ssh "${SSH_OPTIONS[@]}" "ubuntu@$ip" \
    "timeout 600 sudo cloud-init status --wait"; then
    echo "ERROR: cloud-init failed or timed out on $label ($ip)."
    echo "Last cloud-init log lines:"
    ssh "${SSH_OPTIONS[@]}" "ubuntu@$ip" \
      "sudo tail -n 80 /var/log/cloud-init-output.log" || true
    return 1
  fi
}

echo "============================================"
echo " 1/5 Terraform apply"
echo "============================================"
confirm_domain_config
check_atlas_api_ip
confirm_alarm_email
terraform -chdir="$TF_DIR" init
terraform -chdir="$TF_DIR" apply -auto-approve

echo ""
echo "============================================"
echo " 2/5 Get NLB DNS + Control Plane IP"
echo "============================================"
NLB_DNS=$(terraform -chdir="$TF_DIR" output -raw control_plane_nlb_dns_name)
CP_IPS=()
while IFS= read -r ip; do
  CP_IPS+=("$ip")
done < <(tf_output_ips control_plane_public_ips)
WORKER_IPS=()
while IFS= read -r ip; do
  WORKER_IPS+=("$ip")
done < <(tf_output_ips worker_public_ips)
CP_IP="${CP_IPS[0]}"

echo "NLB DNS:       $NLB_DNS"
echo "Control Planes: ${CP_IPS[*]}"
echo "Workers:        ${WORKER_IPS[*]}"

echo ""
echo "============================================"
echo " 3/5 Wait for cloud-init + get kubeconfig"
echo "============================================"
mkdir -p "$HOME/.kube"
wait_for_cloud_init "$CP_IP" "control-plane-1"

for i in "${!CP_IPS[@]}"; do
  if [[ "$i" -gt 0 ]]; then
    wait_for_cloud_init "${CP_IPS[$i]}" "control-plane-$((i + 1))"
  fi
done

for i in "${!WORKER_IPS[@]}"; do
  wait_for_cloud_init "${WORKER_IPS[$i]}" "worker-$((i + 1))"
done

ssh "${SSH_OPTIONS[@]}" "ubuntu@$CP_IP" \
  "sudo cat /etc/rancher/k3s/k3s.yaml" > "$KUBECONFIG"

echo "Before:"
grep "server:" "$KUBECONFIG"

echo "After:"
if [[ "$(uname)" == "Darwin" ]]; then
  sed -i '' "s|server: https://.*:6443|server: https://$NLB_DNS:6443|" "$KUBECONFIG"
else
  sed -i "s|server: https://.*:6443|server: https://$NLB_DNS:6443|" "$KUBECONFIG"
fi
grep "server:" "$KUBECONFIG"

echo ""
echo "============================================"
echo " 4/5 Verify cluster access"
echo "============================================"
KUBECONFIG="$KUBECONFIG" kubectl cluster-info
EXPECTED_NODES=$((${#CP_IPS[@]} + ${#WORKER_IPS[@]}))
for i in $(seq 1 30); do
  READY_NODES=$(KUBECONFIG="$KUBECONFIG" kubectl get nodes --no-headers 2>/dev/null | awk '$2 == "Ready" { count++ } END { print count + 0 }')
  if [[ "$READY_NODES" -eq "$EXPECTED_NODES" ]]; then
    break
  fi
  if [[ "$i" -eq 30 ]]; then
    echo "ERROR: only $READY_NODES/$EXPECTED_NODES Kubernetes nodes became Ready within 5 minutes."
    KUBECONFIG="$KUBECONFIG" kubectl get nodes -o wide || true
    exit 1
  fi
  echo "Waiting for Kubernetes nodes: $READY_NODES/$EXPECTED_NODES Ready..."
  sleep 10
done
KUBECONFIG="$KUBECONFIG" kubectl get nodes -o wide

echo ""
echo "============================================"
echo " 5/5 Deploy application manifests"
echo "============================================"

if [[ ! -f "$BACKEND_SECRET" ]]; then
  echo "ERROR: deploy/backend-secret.yml does not exist."
  echo "Create it from deploy/backend-secret.yml.example and fill in your MongoDB connection string."
  exit 1
fi

# 檢查 MongoDB URI 是否仍為 placeholder
MONGO_URL=$(grep "DATA_BASE_URL" "$BACKEND_SECRET" | sed 's/.*"\(.*\)".*/\1/')
if echo "$MONGO_URL" | grep -qE "<.*>"; then
  echo "ERROR: deploy/backend-secret.yml 的 DATA_BASE_URL 仍包含佔位符 <...>"
  echo "請先填入真實的 MongoDB 連線字串後再執行。"
  exit 1
fi
echo "MongoDB URI check passed."

read -rp "Continue? [y/N] " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Aborted."
  exit 1
fi

KUBECONFIG="$KUBECONFIG" kubectl apply -f "$BACKEND_SECRET"
KUBECONFIG="$KUBECONFIG" kubectl apply -f "$DEPLOY_DIR/backend.yml"
KUBECONFIG="$KUBECONFIG" kubectl apply -f "$DEPLOY_DIR/frontend.yml"
KUBECONFIG="$KUBECONFIG" kubectl apply -f "$DEPLOY_DIR/ingress-rule.yml"
KUBECONFIG="$KUBECONFIG" kubectl scale deployment -n kube-system traefik --replicas 3

echo ""
echo "============================================"
echo " Done"
echo "============================================"
echo "Pods:"
KUBECONFIG="$KUBECONFIG" kubectl get pods -o wide
echo ""
echo "Traefik ingress pods:"
KUBECONFIG="$KUBECONFIG" kubectl get pods -n kube-system -l app.kubernetes.io/name=traefik -o wide

APP_URL=$(terraform -chdir="$TF_DIR" output -raw application_url 2>/dev/null || terraform -chdir="$TF_DIR" output -raw application_alb_dns_name 2>/dev/null || echo "")
if [[ -n "$APP_URL" ]]; then
  echo ""
  if [[ "$APP_URL" == http://* || "$APP_URL" == https://* ]]; then
    echo "App URL: $APP_URL"
  else
    echo "App URL: http://$APP_URL"
  fi
fi
