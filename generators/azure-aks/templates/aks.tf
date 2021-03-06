locals {
  aks_name = "${var.KUBERNETES_CLUSTER_NAME}-${var.ENVIRONMENT}-${local.uid}"  
}

module "<%= name %>-kubernetes" {
  source                    = "cloudcommons/kubernetes/azure"
  version                   = "0.2.3"
  name                      = local.aks_name
  location                  = var.LOCATION
  resource_group            = <%= resourceGroupReference %>
  app                       = var.APP
  kubernetes_version        = var.KUBERNETES_VERSION
  kube_dashboard_enabled    = var.KUBE_DASHBOARD_ENABLED
  linux_admin_username      = var.ADMIN_USER
  client_id                 = var.KUBERNETES_CLIENT_ID
  client_secret             = var.KUBERNETES_CLIENT_SECRET
  linux_ssh_key             = var.SSH_KEY
  node_pool_vm_size         = var.KUBERNETES_VM_SIZE
  node_pool_os_disk_size_gb = var.OS_DISK_SIZE_GB
  node_pool_count           = var.KUBERNETES_AGENT_COUNT  
  creator                   = var.CREATOR
  environment               = var.ENVIRONMENT
  auto_scaling_enable       = var.AUTO_SCALING_ENABLED
  auto_scaling_min_count    = var.AUTO_SCALING_MIN_COUNT
  auto_scaling_max_count    = var.AUTO_SCALING_MAX_COUNT
  vnet_ddos_enabled         = false
  vnet_address_space        = [var.VNET_ADDRESS_SPACE]
  vnet_service_cidr         = var.VNET_SERVICE_CIDR
  vnet_subnets              = [
    {
      name           = "Cluster"
      address_prefix = var.VNET_CLUSTER_CIDR
      security_group = false
    }
    <% if (networkConfig.ingressSubnet) { %>
    ,{
      name           = "Ingresses"
      address_prefix = var.VNET_INGRESS_CIDR
      security_group = true
    }
    <% } %>
  ]
}