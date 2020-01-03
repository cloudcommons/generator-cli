resource "azurerm_container_registry" "<%= name %>-container-registry" {
  count               = var.ACR_ENABLED ? 1 : 0
  name                = var.ACR_NAME
  location            = local.location
  resource_group_name = local.resource_group
  admin_enabled       = true
  sku                 = var.ACR_SKU
}
