terraform {
  required_version = "<%- version %>"
  backend "azurerm" {
    resource_group_name  = "<%= azureRmResourceGroup %>"
    storage_account_name = "<%= azureRmStorageAccountName %>"
    container_name       = "<%= azureRmContainerName %>"
    key                  = "<%= azureRmContainerKey %>"
  }
}
