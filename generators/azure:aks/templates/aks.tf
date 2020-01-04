locals {
  name = "${var.KUBERNETES_CLUSTER_NAME}-${terraform.workspace}"
}

module "<%= name %>-aks" {
  source                    = "cloudcommons/kubernetes/azure"
  version                   = "0.1.3"
  name                      = local.name
  location                  = local.location
  resource_group            = local.resource_group
  app                       = var.APP
  kubernetes_version        = var.KUBERNETES_VERSION
  linux_admin_username      = var.ADMIN_USER
  client_id                 = var.KUBERNETES_CLIENT_ID
  client_secret             = var.KUBERNETES_CLIENT_SECRET
  linux_ssh_key             = var.SSH_KEY
  node_pool_vm_size         = var.KUBERNETES_VM_SIZE
  node_pool_os_disk_size_gb = var.OS_DISK_SIZE_GB
  node_pool_count           = var.KUBERNETES_AGENT_COUNT  
  creator                   = var.CREATOR
  environment               = terraform.workspace
  vnet_ddos_enabled         = false
}
