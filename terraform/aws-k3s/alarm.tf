locals {
  # Organize instance IDs into maps to safely iterate over them with for_each
  cp_instances = merge(
    { "cp-1" = aws_instance.control_plane_first.id },
    { for i, instance in aws_instance.control_plane_joiner : "cp-${i + 2}" => instance.id }
  )

  worker_instances = {
    for i, instance in aws_instance.worker : "worker-${i + 1}" => instance.id
  }

  all_instances = merge(local.cp_instances, local.worker_instances)
}

# ==========================================
# SNS Topics & Subscriptions
# ==========================================

resource "aws_sns_topic" "cpu_alarm" {
  name = "${var.project_name}-CPU-ALARM"
  tags = local.common_tags
}

resource "aws_sns_topic_subscription" "cpu_alarm_email" {
  topic_arn = aws_sns_topic.cpu_alarm.arn
  protocol  = "email"
  endpoint  = var.alarm_email
}

resource "aws_sns_topic" "cp_network_in" {
  name = "${var.project_name}-CP-NetworkIn-ALARM"
  tags = local.common_tags
}

resource "aws_sns_topic_subscription" "cp_network_in_email" {
  topic_arn = aws_sns_topic.cp_network_in.arn
  protocol  = "email"
  endpoint  = var.alarm_email
}

resource "aws_sns_topic" "worker_network_in" {
  name = "${var.project_name}-Worker-NetworkIn-ALARM"
  tags = local.common_tags
}

resource "aws_sns_topic_subscription" "worker_network_in_email" {
  topic_arn = aws_sns_topic.worker_network_in.arn
  protocol  = "email"
  endpoint  = var.alarm_email
}

# ==========================================
# CloudWatch Alarms
# ==========================================

# 1. CPUUtilization > 70% for BOTH CP and Worker Nodes (Average 5min)
resource "aws_cloudwatch_metric_alarm" "cpu_utilization" {
  for_each            = local.all_instances
  alarm_name          = "${var.project_name}-cpu-alarm-${each.key}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = 300 # 5 minutes in seconds
  statistic           = "Average"
  threshold           = var.cpu_alarm_threshold
  alarm_description   = "CPU utilization exceeded ${var.cpu_alarm_threshold}% for 5 minutes on ${each.key}"
  alarm_actions       = [aws_sns_topic.cpu_alarm.arn]

  dimensions = {
    InstanceId = each.value
  }

  tags = local.common_tags
}

# 2. NetworkIn > 1,000,000,000 bytes for Control Plane Nodes (Average 5min)
resource "aws_cloudwatch_metric_alarm" "cp_network_in" {
  for_each            = local.cp_instances
  alarm_name          = "${var.project_name}-network-in-alarm-${each.key}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "NetworkIn"
  namespace           = "AWS/EC2"
  period              = 300 # 5 minutes in seconds
  statistic           = "Average"
  threshold           = var.cp_network_in_threshold
  alarm_description   = "NetworkIn exceeded ${var.cp_network_in_threshold} bytes for 5 minutes on ${each.key}"
  alarm_actions       = [aws_sns_topic.cp_network_in.arn]

  dimensions = {
    InstanceId = each.value
  }

  tags = local.common_tags
}

# 3. NetworkIn > 625,000,000 bytes for Worker Nodes (Average 5min)
resource "aws_cloudwatch_metric_alarm" "worker_network_in" {
  for_each            = local.worker_instances
  alarm_name          = "${var.project_name}-network-in-alarm-${each.key}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "NetworkIn"
  namespace           = "AWS/EC2"
  period              = 300 # 5 minutes in seconds
  statistic           = "Average"
  threshold           = var.worker_network_in_threshold
  alarm_description   = "NetworkIn exceeded ${var.worker_network_in_threshold} bytes for 5 minutes on ${each.key}"
  alarm_actions       = [aws_sns_topic.worker_network_in.arn]

  dimensions = {
    InstanceId = each.value
  }

  tags = local.common_tags
}
