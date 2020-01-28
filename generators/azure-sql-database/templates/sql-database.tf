resource "azurerm_sql_database" "<%= name %>" {
  name                             = var.DATABASE_NAME
  resource_group_name              = var.RESOURCE_GROUP_NAME
  location                         = var.SQL_LOCATIONS[0]
  server_name                      = azurerm_sql_server.<%= name %>[0].name
  create_mode                      = var.DATABASE_CREATE_MODE
  source_database_id               = var.DATABASE_SOURCE_ID
  edition                          = var.DATABASE_EDITION
  requested_service_objective_name = var.DATABASE_REQUESTED_SERVICE_OBJETIVE_NAME
  tags = {
  }
}