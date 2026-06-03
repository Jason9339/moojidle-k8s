variable "aws_region" {
  description = "AWS region to deploy into."
  type        = string
  default     = "ap-northeast-1"
}

variable "project_name" {
  description = "Prefix used for AWS resource names and tags."
  type        = string
  default     = "moojidle"
}

variable "vpc_id" {
  description = "Existing VPC ID. When null, Terraform uses the default VPC in aws_region."
  type        = string
  default     = null
}

variable "subnet_ids" {
  description = "Existing subnet IDs for EC2 and load balancers. When empty, Terraform uses subnets from the selected/default VPC."
  type        = list(string)
  default     = []
}

variable "key_name" {
  description = "Existing AWS EC2 key pair name for SSH access."
  type        = string
}

variable "ami_id" {
  description = "Ubuntu AMI ID. When null, Terraform looks up the latest Ubuntu 24.04 amd64 server AMI."
  type        = string
  default     = null
}

variable "control_plane_count" {
  description = "Number of k3s server nodes. Use an odd number for embedded etcd quorum."
  type        = number
  default     = 3

  validation {
    condition     = var.control_plane_count >= 1
    error_message = "control_plane_count must be at least 1."
  }
}

variable "worker_count" {
  description = "Number of k3s worker nodes."
  type        = number
  default     = 2

  validation {
    condition     = var.worker_count >= 1
    error_message = "worker_count must be at least 1."
  }
}

variable "control_plane_instance_type" {
  description = "EC2 instance type for k3s server nodes."
  type        = string
  default     = "t3.medium"
}

variable "worker_instance_type" {
  description = "EC2 instance type for k3s worker nodes."
  type        = string
  default     = "t3.small"
}

variable "ssh_cidr_blocks" {
  description = "CIDR blocks allowed to SSH into EC2 nodes."
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "kubernetes_api_cidr_blocks" {
  description = "CIDR blocks allowed to access the Kubernetes API through the NLB."
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "app_cidr_blocks" {
  description = "CIDR blocks allowed to access the application through the ALB."
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "domain_name" {
  description = "Optional custom domain name for the application, for example app.example.com."
  type        = string
  default     = null
}

variable "cloudflare_zone_id" {
  description = "Optional Cloudflare zone ID for the domain."
  type        = string
  default     = null
}

variable "cloudflare_api_token" {
  description = "Optional Cloudflare API token with Zone:Read and DNS:Edit permissions for the zone."
  type        = string
  default     = null
  sensitive   = true
}

variable "root_volume_size" {
  description = "Root EBS volume size in GiB for all nodes."
  type        = number
  default     = 30
}

# ─────────────────────────────────────────────
# MongoDB Atlas
# ─────────────────────────────────────────────
variable "mongodbatlas_public_key" {
  description = "MongoDB Atlas Programmatic API Public Key."
  type        = string
  sensitive   = true
}

variable "mongodbatlas_private_key" {
  description = "MongoDB Atlas Programmatic API Private Key."
  type        = string
  sensitive   = true
}

variable "mongodbatlas_project_id" {
  description = "MongoDB Atlas Project ID (Group ID) to whitelist EC2 public IPs."
  type        = string
}

# ─────────────────────────────────────────────
# CloudWatch Alarms
# ─────────────────────────────────────────────
variable "alarm_email" {
  description = "Email address for CloudWatch SNS alarm notifications."
  type        = string
}

variable "cpu_alarm_threshold" {
  description = "CPU utilization threshold percentage to trigger an alarm."
  type        = number
  default     = 70
}

variable "cp_network_in_threshold" {
  description = "NetworkIn threshold in bytes for control plane nodes."
  type        = number
  default     = 1000000000
}

variable "worker_network_in_threshold" {
  description = "NetworkIn threshold in bytes for worker nodes."
  type        = number
  default     = 625000000
}
