#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TF_DIR="$PROJECT_ROOT/terraform/aws-k3s"
DEPLOY_DIR="$PROJECT_ROOT/deploy"
KUBECONFIG="$HOME/.kube/moojidle-config"

echo "============================================"
echo " 1/3 Delete Kubernetes resources"
echo "============================================"
if [[ -f "$KUBECONFIG" ]] && KUBECONFIG="$KUBECONFIG" kubectl get nodes &>/dev/null; then
  KUBECONFIG="$KUBECONFIG" kubectl delete -f "$DEPLOY_DIR/ingress-rule.yml" --ignore-not-found
  KUBECONFIG="$KUBECONFIG" kubectl delete -f "$DEPLOY_DIR/frontend.yml" --ignore-not-found
  KUBECONFIG="$KUBECONFIG" kubectl delete -f "$DEPLOY_DIR/backend.yml" --ignore-not-found
  if [[ -f "$DEPLOY_DIR/backend-secret.yml" ]]; then
    KUBECONFIG="$KUBECONFIG" kubectl delete -f "$DEPLOY_DIR/backend-secret.yml" --ignore-not-found
  fi
  echo "Kubernetes resources deleted."
else
  echo "Cluster not reachable or no kubeconfig, skip kubectl delete."
fi

echo ""
echo "============================================"
echo " 2/3 Terraform destroy"
echo "============================================"
read -rp "Destroy all AWS infrastructure? [y/N] " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Aborted."
  exit 1
fi

terraform -chdir="$TF_DIR" destroy -auto-approve

echo ""
echo "============================================"
echo " 3/3 Clean up local kubeconfig"
echo "============================================"
rm -f "$KUBECONFIG"
echo "Removed $KUBECONFIG"

echo ""
echo "Done."
