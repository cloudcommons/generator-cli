resource "azurerm_resource_group" "<%= name %>" {
  name     = "${var.RESOURCE_GROUP_NAME}-${local.uid}"
  location = var.LOCATION

  tags = {
    app         = var.APP
    environment = terraform.workspace
  }
}