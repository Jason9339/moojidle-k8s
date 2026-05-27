data "aws_vpc" "default" {
  count   = var.vpc_id == null ? 1 : 0
  default = true
}

data "aws_subnets" "selected" {
  filter {
    name   = "vpc-id"
    values = [local.vpc_id]
  }
}

data "aws_ami" "ubuntu" {
  count       = var.ami_id == null ? 1 : 0
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "random_password" "k3s_token" {
  length  = 48
  special = false
}

locals {
  vpc_id     = var.vpc_id == null ? data.aws_vpc.default[0].id : var.vpc_id
  subnet_ids = length(var.subnet_ids) == 0 ? data.aws_subnets.selected.ids : var.subnet_ids
  ami_id     = var.ami_id == null ? data.aws_ami.ubuntu[0].id : var.ami_id

  common_tags = {
    Project   = var.project_name
    ManagedBy = "terraform"
  }
}

resource "aws_security_group" "control_plane" {
  name        = "${var.project_name}-control-plane-sg"
  description = "k3s control plane nodes"
  vpc_id      = local.vpc_id

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-control-plane-sg"
  })
}

resource "aws_security_group" "worker" {
  name        = "${var.project_name}-worker-sg"
  description = "k3s worker nodes"
  vpc_id      = local.vpc_id

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-worker-sg"
  })
}

resource "aws_security_group" "nlb" {
  name        = "${var.project_name}-nlb-sg"
  description = "public Kubernetes API NLB"
  vpc_id      = local.vpc_id

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-nlb-sg"
  })
}

resource "aws_security_group" "alb" {
  name        = "${var.project_name}-alb-sg"
  description = "public application ALB"
  vpc_id      = local.vpc_id

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-alb-sg"
  })
}

resource "aws_vpc_security_group_ingress_rule" "control_plane_api_from_nlb" {
  security_group_id            = aws_security_group.control_plane.id
  referenced_security_group_id = aws_security_group.nlb.id
  ip_protocol                  = "tcp"
  from_port                    = 6443
  to_port                      = 6443
}

resource "aws_vpc_security_group_ingress_rule" "control_plane_api_from_admin" {
  for_each          = toset(var.kubernetes_api_cidr_blocks)
  security_group_id = aws_security_group.control_plane.id
  cidr_ipv4         = each.value
  ip_protocol       = "tcp"
  from_port         = 6443
  to_port           = 6443
}

resource "aws_vpc_security_group_ingress_rule" "control_plane_etcd_self" {
  security_group_id            = aws_security_group.control_plane.id
  referenced_security_group_id = aws_security_group.control_plane.id
  ip_protocol                  = "tcp"
  from_port                    = 2379
  to_port                      = 2380
}

resource "aws_vpc_security_group_ingress_rule" "control_plane_kubelet_from_control_plane" {
  security_group_id            = aws_security_group.control_plane.id
  referenced_security_group_id = aws_security_group.control_plane.id
  ip_protocol                  = "tcp"
  from_port                    = 10250
  to_port                      = 10250
}

resource "aws_vpc_security_group_ingress_rule" "control_plane_kubelet_from_worker" {
  security_group_id            = aws_security_group.control_plane.id
  referenced_security_group_id = aws_security_group.worker.id
  ip_protocol                  = "tcp"
  from_port                    = 10250
  to_port                      = 10250
}

resource "aws_vpc_security_group_ingress_rule" "control_plane_flannel_from_control_plane" {
  security_group_id            = aws_security_group.control_plane.id
  referenced_security_group_id = aws_security_group.control_plane.id
  ip_protocol                  = "udp"
  from_port                    = 8472
  to_port                      = 8472
}

resource "aws_vpc_security_group_ingress_rule" "control_plane_flannel_from_worker" {
  security_group_id            = aws_security_group.control_plane.id
  referenced_security_group_id = aws_security_group.worker.id
  ip_protocol                  = "udp"
  from_port                    = 8472
  to_port                      = 8472
}

resource "aws_vpc_security_group_ingress_rule" "worker_kubelet_from_control_plane" {
  security_group_id            = aws_security_group.worker.id
  referenced_security_group_id = aws_security_group.control_plane.id
  ip_protocol                  = "tcp"
  from_port                    = 10250
  to_port                      = 10250
}

resource "aws_vpc_security_group_ingress_rule" "worker_flannel_from_control_plane" {
  security_group_id            = aws_security_group.worker.id
  referenced_security_group_id = aws_security_group.control_plane.id
  ip_protocol                  = "udp"
  from_port                    = 8472
  to_port                      = 8472
}

resource "aws_vpc_security_group_ingress_rule" "worker_flannel_from_worker" {
  security_group_id            = aws_security_group.worker.id
  referenced_security_group_id = aws_security_group.worker.id
  ip_protocol                  = "udp"
  from_port                    = 8472
  to_port                      = 8472
}

resource "aws_vpc_security_group_ingress_rule" "worker_http_from_alb" {
  security_group_id            = aws_security_group.worker.id
  referenced_security_group_id = aws_security_group.alb.id
  ip_protocol                  = "tcp"
  from_port                    = 80
  to_port                      = 80
}

resource "aws_vpc_security_group_ingress_rule" "node_ssh" {
  for_each          = toset(var.ssh_cidr_blocks)
  security_group_id = aws_security_group.control_plane.id
  cidr_ipv4         = each.value
  ip_protocol       = "tcp"
  from_port         = 22
  to_port           = 22
}

resource "aws_vpc_security_group_ingress_rule" "worker_ssh" {
  for_each          = toset(var.ssh_cidr_blocks)
  security_group_id = aws_security_group.worker.id
  cidr_ipv4         = each.value
  ip_protocol       = "tcp"
  from_port         = 22
  to_port           = 22
}

resource "aws_vpc_security_group_ingress_rule" "nlb_api" {
  for_each          = toset(var.kubernetes_api_cidr_blocks)
  security_group_id = aws_security_group.nlb.id
  cidr_ipv4         = each.value
  ip_protocol       = "tcp"
  from_port         = 6443
  to_port           = 6443
}

resource "aws_vpc_security_group_ingress_rule" "alb_http" {
  for_each          = toset(var.app_cidr_blocks)
  security_group_id = aws_security_group.alb.id
  cidr_ipv4         = each.value
  ip_protocol       = "tcp"
  from_port         = 80
  to_port           = 80
}

resource "aws_vpc_security_group_ingress_rule" "alb_https" {
  for_each          = toset(var.app_cidr_blocks)
  security_group_id = aws_security_group.alb.id
  cidr_ipv4         = each.value
  ip_protocol       = "tcp"
  from_port         = 443
  to_port           = 443
}

resource "aws_vpc_security_group_egress_rule" "all" {
  for_each = {
    control_plane = aws_security_group.control_plane.id
    worker        = aws_security_group.worker.id
    nlb           = aws_security_group.nlb.id
    alb           = aws_security_group.alb.id
  }

  security_group_id = each.value
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1"
}

resource "aws_lb" "control_plane" {
  name               = "${var.project_name}-k3s-api"
  load_balancer_type = "network"
  internal           = false
  security_groups    = [aws_security_group.nlb.id]
  subnets            = local.subnet_ids

  tags = local.common_tags
}

resource "aws_lb_target_group" "control_plane" {
  name        = "${var.project_name}-k3s-api"
  port        = 6443
  protocol    = "TCP"
  target_type = "instance"
  vpc_id      = local.vpc_id

  health_check {
    protocol = "TCP"
    port     = "6443"
  }

  tags = local.common_tags
}

resource "aws_lb_listener" "control_plane" {
  load_balancer_arn = aws_lb.control_plane.arn
  port              = 6443
  protocol          = "TCP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.control_plane.arn
  }
}

resource "aws_lb" "app" {
  name               = "${var.project_name}-app"
  load_balancer_type = "application"
  internal           = false
  security_groups    = [aws_security_group.alb.id]
  subnets            = local.subnet_ids

  tags = local.common_tags
}

resource "aws_lb_target_group" "worker" {
  name        = "${var.project_name}-workers"
  port        = 80
  protocol    = "HTTP"
  target_type = "instance"
  vpc_id      = local.vpc_id

  health_check {
    enabled = true
    path    = "/"
    port    = "80"
  }

  tags = local.common_tags
}

resource "aws_lb_listener" "app_http" {
  load_balancer_arn = aws_lb.app.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.worker.arn
  }
}

resource "aws_instance" "control_plane_first" {
  ami                         = local.ami_id
  instance_type               = var.control_plane_instance_type
  key_name                    = var.key_name
  subnet_id                   = local.subnet_ids[0]
  vpc_security_group_ids      = [aws_security_group.control_plane.id]
  associate_public_ip_address = true

  root_block_device {
    volume_size = var.root_volume_size
    volume_type = "gp3"
  }

  user_data_replace_on_change = true
  user_data = trimspace(<<-EOF
    #!/usr/bin/env bash
    set -euxo pipefail
    apt-get update -y
    apt-get install -y curl ca-certificates
    curl -sfL https://get.k3s.io | K3S_TOKEN="${random_password.k3s_token.result}" sh -s - server \
      --cluster-init \
      --tls-san "${aws_lb.control_plane.dns_name}"
  EOF
  )

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-control-plane-1"
    Role = "control-plane"
  })
}

resource "aws_instance" "control_plane_joiner" {
  count                       = var.control_plane_count - 1
  ami                         = local.ami_id
  instance_type               = var.control_plane_instance_type
  key_name                    = var.key_name
  subnet_id                   = local.subnet_ids[(count.index + 1) % length(local.subnet_ids)]
  vpc_security_group_ids      = [aws_security_group.control_plane.id]
  associate_public_ip_address = true

  root_block_device {
    volume_size = var.root_volume_size
    volume_type = "gp3"
  }

  user_data_replace_on_change = true
  user_data = trimspace(<<-EOF
    #!/usr/bin/env bash
    set -euxo pipefail
    apt-get update -y
    apt-get install -y curl ca-certificates
    until curl -k --connect-timeout 5 https://${aws_instance.control_plane_first.private_ip}:6443/ping; do sleep 10; done
    curl -sfL https://get.k3s.io | K3S_TOKEN="${random_password.k3s_token.result}" sh -s - server \
      --server "https://${aws_instance.control_plane_first.private_ip}:6443" \
      --tls-san "${aws_lb.control_plane.dns_name}"
  EOF
  )

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-control-plane-${count.index + 2}"
    Role = "control-plane"
  })
}

resource "aws_instance" "worker" {
  count                       = var.worker_count
  ami                         = local.ami_id
  instance_type               = var.worker_instance_type
  key_name                    = var.key_name
  subnet_id                   = local.subnet_ids[count.index % length(local.subnet_ids)]
  vpc_security_group_ids      = [aws_security_group.worker.id]
  associate_public_ip_address = true

  root_block_device {
    volume_size = var.root_volume_size
    volume_type = "gp3"
  }

  user_data_replace_on_change = true
  user_data                   = <<-EOF
    #!/usr/bin/env bash
    set -euxo pipefail
    apt-get update -y
    apt-get install -y curl ca-certificates
    until curl -k --connect-timeout 5 https://${aws_lb.control_plane.dns_name}:6443/ping; do sleep 10; done
    curl -sfL https://get.k3s.io | K3S_URL="https://${aws_lb.control_plane.dns_name}:6443" K3S_TOKEN="${random_password.k3s_token.result}" sh -
  EOF

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-worker-${count.index + 1}"
    Role = "worker"
  })
}

resource "aws_lb_target_group_attachment" "control_plane" {
  count            = var.control_plane_count
  target_group_arn = aws_lb_target_group.control_plane.arn
  target_id        = count.index == 0 ? aws_instance.control_plane_first.id : aws_instance.control_plane_joiner[count.index - 1].id
  port             = 6443
}

resource "aws_lb_target_group_attachment" "worker" {
  count            = var.worker_count
  target_group_arn = aws_lb_target_group.worker.arn
  target_id        = aws_instance.worker[count.index].id
  port             = 80
}

# ==========================================
# 6. MongoDB Atlas IP 白名單
# ==========================================

locals {
  all_node_public_ips = concat(
    [aws_instance.control_plane_first.public_ip],
    aws_instance.control_plane_joiner[*].public_ip,
    aws_instance.worker[*].public_ip,
  )
}

resource "mongodbatlas_project_ip_access_list" "node" {
  count      = var.control_plane_count + var.worker_count
  project_id = var.mongodbatlas_project_id
  ip_address = local.all_node_public_ips[count.index]
  comment    = "K3s node ${count.index + 1} (Terraform)"
}
