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
