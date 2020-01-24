resource "azurerm_sql_failover_group" "<%= name %>" {
  name                = "${var.SQL_NAME_PREFIX}-${terraform.workspace}"
  resource_group_name = azurerm_sql_server.<%= name %>[0].resource_group_name
  server_name         = azurerm_sql_server.<%= name %>[0].name
  databases           = [azurerm_sql_database.<%= name %>.id]
  dynamic "partner_servers" {
    for_each = [ for i, s in azurerm_sql_server.<%= name %>: {
      id = s.id
    } if i > 0]
    content {
      id = partner_servers.value.id
    }
  }

  read_write_endpoint_failover_policy {
    mode          = "Automatic"
    grace_minutes = 60
  }
}