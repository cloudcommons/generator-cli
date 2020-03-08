resource "azurerm_log_analytics_workspace" "<%= name %>" {
  name                = "${var.RESOURCE_GROUP_NAME}-${var.ENVIRONMENT}-${local.uid}"
  location            = var.LOCATION
  resource_group_name = <%= resourceGroupReference %>
  sku                 = "PerGB2018"
  retention_in_days   = var.LOG_ANALYTICS_RETENTION_DAYS

  tags = {
    app         = var.APP
    environment = var.ENVIRONMENT
    instance    = local.uid
  }
}
