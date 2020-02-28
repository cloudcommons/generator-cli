locals {
  <%=name %>_ip_name = "<%= name %>-${var.ENVIRONMENT}-${local.uid}"
}

resource "azurerm_public_ip" "<%=name %>" {
  name                    = local.<%=name %>_ip_name
  location                = var.IP_LOCATION
  resource_group_name     = <%= resourceGroupReference %>
  allocation_method       = var.IP_ALLOCATION_METHOD
  ip_version              = var.IP_VERSION

  tags = {
    app         = var.APP
    environment = var.ENVIRONMENT
    instance    = local.uid
  }
}