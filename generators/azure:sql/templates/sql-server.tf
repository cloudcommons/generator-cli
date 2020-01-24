variable "RESOURCE_GROUP_NAME" {
  type        = string
  description = "(Required) Resource group where the database should be created on"
}

variable "SQL_LOCATIONS" {
  type        = list(string)
  description = "(Required) List of locations on which SQL should be deployed"
}

variable "SQL_NAME_PREFIX" {
  type        = string
  description = "(Required) SQL Server name prefix"
}

variable "SQL_VERSION" {
  type        = string
  description = "(Optional) SQL Azure version. Defaults to 12.0"
  default     = "12.0"
}

variable "SQL_ADMIN_LOGIN" {
  type        = string
  description = "(Required) SQL Server default login"
}

variable "SQL_ADMIN_PASSWORD" {
  type        = string
  description = "(Required) SQL Server default password. This property is ignored once created."
}

resource "azurerm_sql_server" "<%= name %>" {
  count                        = length(var.SQL_LOCATIONS)
  name                         = "${var.SQL_NAME_PREFIX}-${var.SQL_LOCATIONS[count.index]}-${terraform.workspace}-${local.uid}"
  resource_group_name          = var.RESOURCE_GROUP_NAME
  location                     = var.SQL_LOCATIONS[count.index]
  version                      = var.SQL_VERSION
  administrator_login          = var.SQL_ADMIN_LOGIN
  administrator_login_password = var.SQL_ADMIN_PASSWORD

  lifecycle {
    ignore_changes = [administrator_login_password]
  }
  tags = {
  }
}
