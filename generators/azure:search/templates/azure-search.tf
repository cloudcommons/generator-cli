locals {
  name = "${var.SEARCH_NAME}-${terraform.workspace}-${local.uid}"
}

resource "azurerm_search_service" "<%= name %>" {
  name                = local.name
  resource_group_name = var.SEARCH_RESOURCE_GROUP
  location            = var.SEARCH_LOCATION
  sku                 = var.SEARCH_SKU
  replica_count       = var.SEARCH_REPLICA_COUNT
  partition_count     = var.SEARCH_PARTITION_COUNT

  tags = {
    app         = var.SEARCH_APP
    environment = terraform.workspace
  }
}
