output "FQDN" {
    value = local.fqdn
    description = "Application full qualified domain name created in Kubernetes"
}

output "LOAD_BALANCER_IP" {
    value = local.ingress_load_balancer_ip
    description = "Load Balancer IP"
}