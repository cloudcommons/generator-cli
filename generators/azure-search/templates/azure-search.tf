resource "azurerm_search_service" "<%= name %>" {
  name                = "${var.SEARCH_NAME}-${terraform.workspace}-${local.uid}"
  resource_group_name = <%= resourceGroupReference %>
  location            = <%= locationReference %>
  sku                 = var.SEARCH_SKU
  replica_count       = var.SEARCH_REPLICA_COUNT
  partition_count     = var.SEARCH_PARTITION_COUNT

  tags = {
    app         = var.APP
    environment = terraform.workspace
  }
}
