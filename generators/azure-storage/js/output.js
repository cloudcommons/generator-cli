var terraform = require('../../../common/terraform');

module.exports = {
    copy: function (fs, answers) {
        var output = {
            output: {
                STORAGE_ACCOUNT_ID: {
                    description: "The storage account Resource ID.",
                    value: terraform.toVariable(`azurerm_storage_account.${answers.name}.id`)
                },
                STORAGE_PRIMARY_LOCATION: {
                    description: "The primary location of the storage account.",
                    value: terraform.toVariable(`azurerm_storage_account.${answers.name}.primary_location`)
                },
                STORAGE_SECONDARY_LOCATION: {
                    description: "The secondary location of the storage account.",
                    value: terraform.toVariable(`azurerm_storage_account.${answers.name}.secondary_location`)
                },
                STORAGE_PRIMARY_BLOB_ENDPOINT: {
                    description: "The endpoint URL for blob storage in the primary location.",
                    value: terraform.toVariable(`azurerm_storage_account.${answers.name}.primary_blob_endpoint`)
                },
                STORAGE_PRIMARY_BLOB_HOST: {
                    description: "The hostname with port if applicable for blob storage in the primary location.",
                    value: terraform.toVariable(`azurerm_storage_account.${answers.name}.primary_blob_host `)
                },
                STORAGE_SECONDARY_BLOB_ENDPOINT: {
                    description: "The endpoint URL for blob storage in the secondary location.",
                    value: terraform.toVariable(`azurerm_storage_account.${answers.name}.secondary_blob_endpoint `)
                },
                STORAGE_SECONDARY_BLOB_HOST: {
                    description: "The hostname with port if applicable for blob storage in the primary location.",
                    value: terraform.toVariable(`azurerm_storage_account.${answers.name}.secondary_blob_host `)
                },
                STORAGE_PRIMARY_QUEUE_ENDPOINT:
                {
                    description: "The endpoint URL for queue storage in the primary location.",
                    value: terraform.toVariable(`azurerm_storage_account.${answers.name}.primary_queue_endpoint `)
                },
                STORAGE_PRIMARY_QUEUE_HOST:
                {
                    description: "The hostname with port if applicable for queue storage in the primary location.",
                    value: terraform.toVariable(`azurerm_storage_account.${answers.name}.primary_queue_host `)
                },
                STORAGE_SECONDARY_QUEUE_ENDPOINT:
                {
                    description: "The endpoint URL for queue storage in the secondary location.",
                    value: terraform.toVariable(`azurerm_storage_account.${answers.name}.secondary_queue_endpoint`)
                },
                STORAGE_PRIMARY_TABLE_ENDPOINT:
                {
                    description: "The endpoint URL for table storage in the primary location.",
                    value: terraform.toVariable(`azurerm_storage_account.${answers.name}.primary_table_endpoint`)
                },
                STORAGE_SECONDARY_TABLE_ENDPOINT:
                {
                    description: "The endpoint URL for table storage in the secondary location.",
                    value: terraform.toVariable(`azurerm_storage_account.${answers.name}.secondary_table_endpoint`)
                },
                STORAGE_SECONDARY_TABLE_HOST:
                {
                    description: "The hostname with port if applicable for table storage in the secondary location",
                    value: terraform.toVariable(`azurerm_storage_account.${answers.name}.secondary_table_host`)
                },
                STORAGE_PRIMARY_FILE_ENDPOINT:
                {
                    description: "The endpoint URL for file storage in the primary location.",
                    value: terraform.toVariable(`azurerm_storage_account.${answers.name}.primary_file_endpoint`)
                },
                STORAGE_PRIMARY_FILE_HOST:
                {
                    description: "The hostname with port if applicable for file storage in the primary location.",
                    value: terraform.toVariable(`azurerm_storage_account.${answers.name}.primary_file_host`)
                },
                STORAGE_SECONDARY_FILE_ENDPOINT:
                {
                    description: "The endpoint URL for file storage in the secondary location.",
                    value: terraform.toVariable(`azurerm_storage_account.${answers.name}.secondary_file_endpoint`)
                },
                STORAGE_SECONDARY_FILE_HOST:
                {
                    description: "The hostname with port if applicable for file storage in the secondary location.",
                    value: terraform.toVariable(`azurerm_storage_account.${answers.name}.secondary_file_host`)
                },
                STORAGE_PRIMARY_DFS_ENDPOINT:
                {
                    description: "The endpoint URL for DFS storage in the primary location.",
                    value: terraform.toVariable(`azurerm_storage_account.${answers.name}.primary_dfs_endpoint`)
                },
                STORAGE_PRIMARY_DFS_HOST:
                {
                    description: "The hostname with port if applicable for DFS storage in the primary location.",
                    value: terraform.toVariable(`azurerm_storage_account.${answers.name}.primary_dfs_host`)
                },
                STORAGE_SECONDARY_DFS_ENDPOINT:
                {
                    description: "The endpoint URL for DFS storage in the secondary location.",
                    value: terraform.toVariable(`azurerm_storage_account.${answers.name}.secondary_dfs_endpoint`)
                },
                STORAGE_SECONDARY_DFS_HOST:
                {
                    description: "The hostname with port if applicable for DFS storage in the secondary location.",
                    value: terraform.toVariable(`azurerm_storage_account.${answers.name}.secondary_dfs_host`)
                },
                STORAGE_PRIMARY_WEB_ENDPOINT:
                {
                    description: "The endpoint URL for web storage in the primary location.",
                    value: terraform.toVariable(`azurerm_storage_account.${answers.name}.primary_web_endpoint`)
                },
                STORAGE_PRIMARY_WEB_HOSTS:
                {
                    description: "The hostname with port if applicable for web storage in the primary location.",
                    value: terraform.toVariable(`azurerm_storage_account.${answers.name}.primary_web_host`)
                },
                STORAGE_SECONDARY_WEB_ENDPOINTS:
                {
                    description: "The endpoint URL for web storage in the secondary location.",
                    value: terraform.toVariable(`azurerm_storage_account.${answers.name}.secondary_web_endpoint`)
                },
                STORAGE_SECONDARY_WEB_HOST:
                {
                    description: "The hostname with port if applicable for web storage in the secondary location.",
                    value: terraform.toVariable(`azurerm_storage_account.${answers.name}.secondary_web_host`)
                },
                STORAGE_PRIMARY_ACCESS_KEY:
                {
                    description: "The primary access key for the storage account.",
                    value: terraform.toVariable(`azurerm_storage_account.${answers.name}.primary_access_key`),
                    sensitive: true
                },
                STORAGE_SECONDARY_ACCESS_KEY:
                {
                    description: "The secondary access key for the storage account.",
                    value: terraform.toVariable(`azurerm_storage_account.${answers.name}.secondary_access_key`),
                    sensitive: true
                },
                STORAGE_PRIMARY_CONNECTION_STRING:
                {
                    description: "The connection string associated with the primary location.",
                    value: terraform.toVariable(`azurerm_storage_account.${answers.name}.primary_connection_string`),
                    sensitive: true
                },
                STORAGE_SECONDARY_CONNECTION_STRING:
                {
                    description: "The connection string associated with the secondary location.",
                    value: terraform.toVariable(`azurerm_storage_account.${answers.name}.secondary_connection_string`),
                    sensitive: true
                },
                STORAGE_PRIMARY_BLOB_CONNECTION_STRING:
                {
                    description: "The connection string associated with the primary blob location.",
                    value: terraform.toVariable(`azurerm_storage_account.${answers.name}.primary_blob_connection_string`),
                    sensitive: true
                },
                STORAGE_SECONDARY_BLOB_CONNECTION_STRING:
                {
                    description: "The connection string associated with the secondary blob location.",
                    value: terraform.toVariable(`azurerm_storage_account.${answers.name}.secondary_blob_connection_string`),
                    sensitive: true
                }
            }
        }

        terraform.writeOutput(fs, output);
    }
}                                