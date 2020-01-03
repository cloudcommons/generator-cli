resource "azurerm_dns_zone" "<%= name %>-dns-zone" {
  count               = var.DNS_ZONE_ENABLED == true ? 1 : 0
  name                = var.DNS_ZONE_NAME
  resource_group_name = local.resource_group

  tags = {
    creator     = var.CREATOR
    environment = terraform.workspace
  }
}
