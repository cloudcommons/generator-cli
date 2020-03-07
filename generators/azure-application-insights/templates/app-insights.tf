resource "azurerm_application_insights" "<%= name %>" {
  name                = "${var.RESOURCE_GROUP_NAME}-${var.ENVIRONMENT}-${local.uid}"
  location            = var.LOCATION
  resource_group_name = <%= resourceGroupReference %>
  application_type    = var.APP_INSIGHTS_TYPE

  tags = {
    app         = var.APP
    environment = var.ENVIRONMENT
    instance    = local.uid
  }
}
