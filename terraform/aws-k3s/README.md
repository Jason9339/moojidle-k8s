# Terraform AWS K3s

This Terraform module creates the AWS infrastructure that the root README describes manually:

- 3 k3s control plane EC2 instances by default
- 2 k3s worker EC2 instances by default
- Security groups for control plane, worker, NLB, and ALB traffic
- A public Network Load Balancer for the Kubernetes API on TCP/6443
- A public Application Load Balancer for the Moojidle web app on HTTP/80
- k3s installation through EC2 user data

The application itself still uses the existing Kubernetes manifests in `../../deploy`.

## Usage

```bash
cd terraform/aws-k3s
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:

- Set `key_name` to an existing AWS EC2 key pair.
- Optionally set `vpc_id` and `subnet_ids`; otherwise the default VPC and its subnets are used.
- Restrict `ssh_cidr_blocks` and `kubernetes_api_cidr_blocks` to your own public IP CIDR when possible.

Then run:

```bash
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
```

After Terraform finishes, copy the outputs:

```bash
terraform output control_plane_nlb_dns_name
terraform output application_alb_dns_name
terraform output first_control_plane_ssh
```

SSH to the first control plane, copy kubeconfig, and replace the kubeconfig server address with the NLB DNS name:

```bash
sudo cat /etc/rancher/k3s/k3s.yaml
```

On your local machine:

```bash
kubectl get nodes
kubectl apply -f ../../deploy/backend.yml
kubectl apply -f ../../deploy/frontend.yml
kubectl apply -f ../../deploy/ingress-rule.yml
kubectl scale deployment -n kube-system traefik --replicas 3
```

Before applying `backend.yml`, replace the placeholder MongoDB Atlas connection string in `../../deploy/backend.yml`.

Open:

```bash
curl http://$(terraform output -raw application_alb_dns_name)
```

## Cleanup

Remove the Kubernetes application first if you still have kubeconfig access:

```bash
kubectl delete -f ../../deploy/ingress-rule.yml
kubectl delete -f ../../deploy/frontend.yml
kubectl delete -f ../../deploy/backend.yml
```

Then destroy AWS resources:

```bash
terraform destroy
```
