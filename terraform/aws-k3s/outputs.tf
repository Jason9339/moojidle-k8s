output "control_plane_nlb_dns_name" {
  description = "Use this DNS name as the Kubernetes API endpoint in kubeconfig."
  value       = aws_lb.control_plane.dns_name
}

output "application_alb_dns_name" {
  description = "Use this DNS name to access Moojidle after applying deploy/*.yml."
  value       = aws_lb.app.dns_name
}

output "control_plane_public_ips" {
  description = "Public IPs for SSH access to control plane nodes."
  value       = concat([aws_instance.control_plane_first.public_ip], aws_instance.control_plane_joiner[*].public_ip)
}

output "worker_public_ips" {
  description = "Public IPs for SSH access to worker nodes."
  value       = aws_instance.worker[*].public_ip
}

output "first_control_plane_ssh" {
  description = "SSH command template for the first control plane node."
  value       = "ssh -i <your-key.pem> ubuntu@${aws_instance.control_plane_first.public_ip}"
}
