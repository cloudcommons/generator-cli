output "kube_config" {
  value = "${module.kubernetes.kube_config_raw}"
  description = "AKS Configuration file"
  sensitive = true
}