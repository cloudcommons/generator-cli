output "client_certificate" {
  value = "${module.<%= name %>-aks.client_certificate}"
  description = "AKS Client certificate"
  sensitive = true
}

output "kube_config" {
  value = "${module.<%= name %>-aks.kube_config}"
  description = "AKS Configuration"
  sensitive = true
}