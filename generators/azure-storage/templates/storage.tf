resource "azurerm_storage_account" "<%= name %>" {
  name                = lower("${var.STORAGE_NAME}${var.ENVIRONMENT}${local.uid}")
  resource_group_name = <%= resourceGroupReference %>
  location            = <%= locationReference %>
  account_kind        = var.STORAGE_ACCOUNT_KIND
  account_tier        = var.STORAGE_ACCOUNT_TIER
  account_replication_type = var.STORAGE_REPLICATION_TYPE
  access_tier         = var.STORAGE_ACCESS_TIER  

  tags = {
    app         = var.APP
    environment = var.ENVIRONMENT
    instance    = local.uid
  }
}
