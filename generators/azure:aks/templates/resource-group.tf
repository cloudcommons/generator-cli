locals {
  resource_group = azurerm_resource_group.<%= name %>.name
  location = azurerm_resource_group.<%= name %>.location
}

resource "azurerm_resource_group" "<%= name %>" {
  name     = "${var.APP}-${terraform.workspace}"
  location = var.LOCATION

  tags = {
    environment = terraform.workspace
    creator     = var.CREATOR
    app         = var.APP
  }
}
