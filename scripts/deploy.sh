#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TF_DIR="$PROJECT_ROOT/terraform/aws-k3s"
DEPLOY_DIR="$PROJECT_ROOT/deploy"
SSH_KEY="$PROJECT_ROOT/Moojidle.pem" # You maybe need to adjust this path if your SSH key is located elsewhere
KUBECONFIG="$HOME/.kube/moojidle-config"

echo "============================================"
echo " 1/5 Terraform apply"
echo "============================================"
terraform -chdir="$TF_DIR" init
terraform -chdir="$TF_DIR" apply -auto-approve

echo ""
echo "============================================"
echo " 2/5 Get NLB DNS + Control Plane IP"
echo "============================================"
NLB_DNS=$(terraform -chdir="$TF_DIR" output -raw control_plane_nlb_dns_name)
CP_IP=$(terraform -chdir="$TF_DIR" output -json control_plane_public_ips | python3 -c "import sys,json; print(json.load(sys.stdin)[0])" 2>/dev/null \
  || terraform -chdir="$TF_DIR" output -json control_plane_public_ips | python -c "import sys,json; print(json.load(sys.stdin)[0])")

echo "NLB DNS:       $NLB_DNS"
echo "Control Plane: $CP_IP"

echo ""
echo "============================================"
echo " 3/5 Wait for K3s ready + get kubeconfig"
echo "============================================"
mkdir -p "$HOME/.kube"
echo "Waiting for K3s to be ready on $CP_IP..."
for i in $(seq 1 30); do
  if ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" "ubuntu@$CP_IP" \
    "sudo test -f /etc/rancher/k3s/k3s.yaml" 2>/dev/null; then
    echo "K3s ready after ${i}0s."
    break
  fi
  if [[ $i -eq 30 ]]; then
    echo "ERROR: K3s did not become ready within 5 minutes."
    exit 1
  fi
  sleep 10
done

ssh -o StrictHostKeyChecking=no -i "$SSH_KEY" "ubuntu@$CP_IP" \
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
KUBECONFIG="$KUBECONFIG" kubectl get nodes

echo ""
echo "============================================"
echo " 5/5 Deploy application manifests"
echo "============================================"

# 檢查 MongoDB URI 是否仍為 placeholder
MONGO_URL=$(grep "DATA_BASE_URL" "$DEPLOY_DIR/backend.yml" | sed 's/.*"\(.*\)".*/\1/')
if echo "$MONGO_URL" | grep -qE "<.*>"; then
  echo "ERROR: deploy/backend.yml 的 DATA_BASE_URL 仍包含佔位符 <...>"
  echo "請先填入真實的 MongoDB 連線字串後再執行。"
  exit 1
fi
echo "MongoDB URI check passed."

read -rp "Continue? [y/N] " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Aborted."
  exit 1
fi

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

APP_URL=$(terraform -chdir="$TF_DIR" output -raw application_alb_dns_name 2>/dev/null || echo "")
if [[ -n "$APP_URL" ]]; then
  echo ""
  echo "App URL: http://$APP_URL"
fi
