locals {
  ingress_load_balancer_ip = local.ingress_enabled ? azurerm_public_ip.<%= name %>[0].ip_address : null
}

resource "azurerm_public_ip" "<%= name %>" {
  count               = local.ingress_enabled ? 1 : 0
  name                = "${local.app_name}-ingress-ip"
  location            = var.LOCATION
  resource_group_name = var.AKS_MANAGED_RESOURCE_GROUP
  allocation_method   = "Static"
}
