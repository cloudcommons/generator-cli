variable "DATABASE_NAME" {
  type        = string
  description = "(Required) Database name"
}

variable "DATABASE_EDITION" {
  type        = string
  description = "(Optional) The edition of the database to be created. Applies only if create_mode is Default. Valid values are: Basic, Standard, Premium, DataWarehouse, Business, BusinessCritical, Free, GeneralPurpose, Hyperscale, Premium, PremiumRS, Standard, Stretch, System, System2, or Web. Please see Azure SQL Database Service Tiers."
  default     = "Basic"
}

variable "DATABASE_REQUESTED_SERVICE_OBJETIVE_NAME" {
  type        = string
  description = "(Optional) Use requested_service_objective_name or requested_service_objective_id to set the performance level for the database. Valid values are: S0, S1, S2, S3, P1, P2, P4, P6, P11 and ElasticPool. Please see Azure SQL Database Service Tiers."
  default     = "S0"
}

variable "DATABASE_CREATE_MODE" {
  type        = string
  description = "(Optional) Specifies how to create the database. Valid values are: Default, Copy, OnlineSecondary, NonReadableSecondary, PointInTimeRestore, Recovery, Restore or RestoreLongTermRetentionBackup. Must be Default to create a new database. Defaults to Default. "
  default     = "Default"
}

variable "DATABASE_SOURCE_ID" {
  type        = string
  description = "(Optional) The URI of the source database if create_mode value is not Default."
  default     = null
}

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