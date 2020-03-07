resource "azurerm_dns_zone" "<%= name %>" {
  name     = var.DNS_ZONE_NAME
  resource_group_name = <%= resourceGroupReference %>

  tags = {
    app         = var.APP
    environment = var.ENVIRONMENT
    instance    = local.uid
  }
}