resource "azurerm_resource_group" "<%= name %>" {
  name     = "${var.RESOURCE_GROUP_NAME}-${var.ENVIRONMENT}-${local.uid}"
  location = var.LOCATION

  tags = {
    app         = var.APP
    environment = var.ENVIRONMENT
    instance    = local.uid
  }
}