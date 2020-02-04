var helpers = require('yeoman-test');
var path = require('path');
var assert = require('yeoman-assert');

describe("cloudcommons/cli:azure-storage", function () {
    describe('Creates an Azure Storage', () => {
        describe('In an existing resource group', () => {
            describe('Of type StorageV2', () => {
                var prompts = {
                    name: 'ccm',
                    resourceGroup: 'cloudcommons-workgroup',
                    location: 'westeurope',
                    accountKind: 'StorageV2',
                    accountTier: 'Standard',
                    accountAccessTier: 'Hot',
                    accountReplicationType: 'LRS'
                };
                before(done => {
                    helpers
                        .run(path.join(__dirname, '../generators/azure-storage'))
                        .withPrompts(prompts)
                        .once('end', done);
                });

                it('Generates storage files', () => {
                    assert.file('ccm-storage-account.tf');
                    assert.file('terraform.tfvars.json');
                    assert.file('variables.tf.json');
                    assert.file('providers.tf.json');
                    assert.file('output.tf.json');
                });

                it('Defines terraform variables', () => {
                    assert.fileContent('variables.tf.json', '"STORAGE_NAME":');
                    assert.fileContent('variables.tf.json', '"STORAGE_ACCOUNT_KIND":');
                    assert.fileContent('variables.tf.json', '"STORAGE_ACCOUNT_TIER":');
                    assert.fileContent('variables.tf.json', '"STORAGE_ACCOUNT_KIND":');
                    assert.fileContent('variables.tf.json', '"STORAGE_REPLICATION_TYPE":');
                    assert.fileContent('variables.tf.json', '"STORAGE_ACCESS_TIER":');
                    assert.fileContent('variables.tf.json', '"RESOURCE_GROUP_NAME":');
                    assert.fileContent('variables.tf.json', '"LOCATION":');
                });

                it('Includes storage info in the variables', () => {
                    assert.fileContent('terraform.tfvars.json', `"STORAGE_NAME": "${prompts.name}"`);
                    assert.fileContent('terraform.tfvars.json', `"STORAGE_ACCOUNT_KIND": "${prompts.accountKind}"`);
                    assert.fileContent('terraform.tfvars.json', `"STORAGE_ACCOUNT_TIER": "${prompts.accountTier}"`);
                    assert.fileContent('terraform.tfvars.json', `"STORAGE_REPLICATION_TYPE": "${prompts.accountReplicationType}"`);
                    assert.fileContent('terraform.tfvars.json', `"STORAGE_ACCESS_TIER": "${prompts.accountAccessTier}"`);
                    assert.fileContent('terraform.tfvars.json', `"RESOURCE_GROUP_NAME": "${prompts.resourceGroup}"`);
                    assert.fileContent('terraform.tfvars.json', `"LOCATION": "${prompts.location}"`);
                });

                it('Creates the right output values', () => {
                    assert.fileContent('output.tf.json', '"STORAGE_ACCOUNT_ID":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.id`);
                    assert.fileContent('output.tf.json', '"STORAGE_PRIMARY_LOCATION":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.primary_location`);
                    assert.fileContent('output.tf.json', '"STORAGE_SECONDARY_LOCATION":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.secondary_location`);
                    assert.fileContent('output.tf.json', '"STORAGE_PRIMARY_BLOB_ENDPOINT":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.primary_blob_endpoint`);
                    assert.fileContent('output.tf.json', '"STORAGE_PRIMARY_BLOB_HOST":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.primary_blob_host`);
                    assert.fileContent('output.tf.json', '"STORAGE_SECONDARY_BLOB_ENDPOINT":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.secondary_blob_endpoint`);
                    assert.fileContent('output.tf.json', '"STORAGE_SECONDARY_BLOB_HOST":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.secondary_blob_host`);
                    assert.fileContent('output.tf.json', '"STORAGE_PRIMARY_QUEUE_ENDPOINT":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.primary_queue_endpoint`);
                    assert.fileContent('output.tf.json', '"STORAGE_PRIMARY_QUEUE_HOST":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.primary_queue_host`);
                    assert.fileContent('output.tf.json', '"STORAGE_SECONDARY_QUEUE_ENDPOINT":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.secondary_queue_endpoint`);
                    assert.fileContent('output.tf.json', '"STORAGE_PRIMARY_TABLE_ENDPOINT":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.primary_table_endpoint`);
                    assert.fileContent('output.tf.json', '"STORAGE_SECONDARY_TABLE_ENDPOINT":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.secondary_table_endpoint`);
                    assert.fileContent('output.tf.json', '"STORAGE_SECONDARY_TABLE_HOST":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.secondary_table_host`);
                    assert.fileContent('output.tf.json', '"STORAGE_PRIMARY_FILE_ENDPOINT":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.primary_file_endpoint`);
                    assert.fileContent('output.tf.json', '"STORAGE_PRIMARY_FILE_HOST":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.primary_file_host`);
                    assert.fileContent('output.tf.json', '"STORAGE_SECONDARY_FILE_ENDPOINT":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.secondary_file_endpoint`);
                    assert.fileContent('output.tf.json', '"STORAGE_SECONDARY_FILE_HOST":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.secondary_file_host`);
                    assert.fileContent('output.tf.json', '"STORAGE_PRIMARY_DFS_ENDPOINT":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.primary_dfs_endpoint`);
                    assert.fileContent('output.tf.json', '"STORAGE_PRIMARY_DFS_HOST":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.primary_dfs_host`);
                    assert.fileContent('output.tf.json', '"STORAGE_SECONDARY_DFS_ENDPOINT":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.secondary_dfs_endpoint`);
                    assert.fileContent('output.tf.json', '"STORAGE_SECONDARY_DFS_HOST":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.secondary_dfs_host`);
                    assert.fileContent('output.tf.json', '"STORAGE_PRIMARY_WEB_ENDPOINT":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.primary_web_endpoint`);
                    assert.fileContent('output.tf.json', '"STORAGE_PRIMARY_WEB_HOSTS":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.primary_web_host`);
                    assert.fileContent('output.tf.json', '"STORAGE_SECONDARY_WEB_ENDPOINTS":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.secondary_web_endpoint`);
                    assert.fileContent('output.tf.json', '"STORAGE_SECONDARY_WEB_HOST":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.secondary_web_host`);
                    assert.fileContent('output.tf.json', '"STORAGE_PRIMARY_ACCESS_KEY":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.primary_access_key`);
                    assert.fileContent('output.tf.json', '"STORAGE_SECONDARY_ACCESS_KEY":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.secondary_access_key`);
                    assert.fileContent('output.tf.json', '"STORAGE_PRIMARY_CONNECTION_STRING":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.primary_connection_string`);
                    assert.fileContent('output.tf.json', '"STORAGE_SECONDARY_CONNECTION_STRING":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.secondary_connection_string`);
                    assert.fileContent('output.tf.json', '"STORAGE_PRIMARY_BLOB_CONNECTION_STRING":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.primary_blob_connection_string`);
                    assert.fileContent('output.tf.json', '"STORAGE_SECONDARY_BLOB_CONNECTION_STRING":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.secondary_blob_connection_string`);
                });

                it('Adds azurerm provider', () => {
                    assert.fileContent('providers.tf.json', '"provider":');
                    assert.fileContent('providers.tf.json', '"azurerm":');
                });
            });
        });

        describe('In a new resource group', () => {
            describe('Of type StorageV2', () => {
                var prompts = {
                    name: 'ccm',
                    resourceGroup: 'azurerm_storage_account.workspace',
                    location: 'westeurope',
                    accountKind: 'StorageV2',
                    accountTier: 'Standard',
                    accountAccessTier: 'Hot',
                    accountReplicationType: 'LRS'
                };
                before(done => {
                    helpers
                        .run(path.join(__dirname, '../generators/azure-storage'))
                        .withPrompts(prompts)
                        .once('end', done);
                });

                it('Generates storage files', () => {
                    assert.file('ccm-storage-account.tf');
                    assert.file('terraform.tfvars.json');
                    assert.file('variables.tf.json');
                    assert.file('providers.tf.json');
                    assert.file('output.tf.json');
                });

                it('Defines terraform variables', () => {
                    assert.fileContent('variables.tf.json', '"STORAGE_NAME":');
                    assert.fileContent('variables.tf.json', '"STORAGE_ACCOUNT_KIND":');
                    assert.fileContent('variables.tf.json', '"STORAGE_ACCOUNT_TIER":');
                    assert.fileContent('variables.tf.json', '"STORAGE_ACCOUNT_KIND":');
                    assert.fileContent('variables.tf.json', '"STORAGE_REPLICATION_TYPE":');
                    assert.fileContent('variables.tf.json', '"STORAGE_ACCESS_TIER":');
                    assert.noFileContent('variables.tf.json', '"RESOURCE_GROUP_NAME":');
                    assert.noFileContent('variables.tf.json', '"LOCATION":');
                });

                it('Includes storage info in the variables', () => {
                    assert.fileContent('terraform.tfvars.json', `"STORAGE_NAME": "${prompts.name}"`);
                    assert.fileContent('terraform.tfvars.json', `"STORAGE_ACCOUNT_KIND": "${prompts.accountKind}"`);
                    assert.fileContent('terraform.tfvars.json', `"STORAGE_ACCOUNT_TIER": "${prompts.accountTier}"`);
                    assert.fileContent('terraform.tfvars.json', `"STORAGE_REPLICATION_TYPE": "${prompts.accountReplicationType}"`);
                    assert.fileContent('terraform.tfvars.json', `"STORAGE_ACCESS_TIER": "${prompts.accountAccessTier}"`);
                    assert.noFileContent('terraform.tfvars.json', `"RESOURCE_GROUP_NAME": "${prompts.resourceGroup}"`);
                    assert.noFileContent('terraform.tfvars.json', `"LOCATION": "${prompts.location}"`);
                });

                it('Creates the right output values', () => {
                    assert.fileContent('output.tf.json', '"STORAGE_ACCOUNT_ID":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.id`);
                    assert.fileContent('output.tf.json', '"STORAGE_PRIMARY_LOCATION":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.primary_location`);
                    assert.fileContent('output.tf.json', '"STORAGE_SECONDARY_LOCATION":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.secondary_location`);
                    assert.fileContent('output.tf.json', '"STORAGE_PRIMARY_BLOB_ENDPOINT":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.primary_blob_endpoint`);
                    assert.fileContent('output.tf.json', '"STORAGE_PRIMARY_BLOB_HOST":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.primary_blob_host`);
                    assert.fileContent('output.tf.json', '"STORAGE_SECONDARY_BLOB_ENDPOINT":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.secondary_blob_endpoint`);
                    assert.fileContent('output.tf.json', '"STORAGE_SECONDARY_BLOB_HOST":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.secondary_blob_host`);
                    assert.fileContent('output.tf.json', '"STORAGE_PRIMARY_QUEUE_ENDPOINT":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.primary_queue_endpoint`);
                    assert.fileContent('output.tf.json', '"STORAGE_PRIMARY_QUEUE_HOST":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.primary_queue_host`);
                    assert.fileContent('output.tf.json', '"STORAGE_SECONDARY_QUEUE_ENDPOINT":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.secondary_queue_endpoint`);
                    assert.fileContent('output.tf.json', '"STORAGE_PRIMARY_TABLE_ENDPOINT":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.primary_table_endpoint`);
                    assert.fileContent('output.tf.json', '"STORAGE_SECONDARY_TABLE_ENDPOINT":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.secondary_table_endpoint`);
                    assert.fileContent('output.tf.json', '"STORAGE_SECONDARY_TABLE_HOST":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.secondary_table_host`);
                    assert.fileContent('output.tf.json', '"STORAGE_PRIMARY_FILE_ENDPOINT":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.primary_file_endpoint`);
                    assert.fileContent('output.tf.json', '"STORAGE_PRIMARY_FILE_HOST":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.primary_file_host`);
                    assert.fileContent('output.tf.json', '"STORAGE_SECONDARY_FILE_ENDPOINT":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.secondary_file_endpoint`);
                    assert.fileContent('output.tf.json', '"STORAGE_SECONDARY_FILE_HOST":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.secondary_file_host`);
                    assert.fileContent('output.tf.json', '"STORAGE_PRIMARY_DFS_ENDPOINT":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.primary_dfs_endpoint`);
                    assert.fileContent('output.tf.json', '"STORAGE_PRIMARY_DFS_HOST":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.primary_dfs_host`);
                    assert.fileContent('output.tf.json', '"STORAGE_SECONDARY_DFS_ENDPOINT":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.secondary_dfs_endpoint`);
                    assert.fileContent('output.tf.json', '"STORAGE_SECONDARY_DFS_HOST":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.secondary_dfs_host`);
                    assert.fileContent('output.tf.json', '"STORAGE_PRIMARY_WEB_ENDPOINT":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.primary_web_endpoint`);
                    assert.fileContent('output.tf.json', '"STORAGE_PRIMARY_WEB_HOSTS":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.primary_web_host`);
                    assert.fileContent('output.tf.json', '"STORAGE_SECONDARY_WEB_ENDPOINTS":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.secondary_web_endpoint`);
                    assert.fileContent('output.tf.json', '"STORAGE_SECONDARY_WEB_HOST":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.secondary_web_host`);
                    assert.fileContent('output.tf.json', '"STORAGE_PRIMARY_ACCESS_KEY":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.primary_access_key`);
                    assert.fileContent('output.tf.json', '"STORAGE_SECONDARY_ACCESS_KEY":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.secondary_access_key`);
                    assert.fileContent('output.tf.json', '"STORAGE_PRIMARY_CONNECTION_STRING":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.primary_connection_string`);
                    assert.fileContent('output.tf.json', '"STORAGE_SECONDARY_CONNECTION_STRING":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.secondary_connection_string`);
                    assert.fileContent('output.tf.json', '"STORAGE_PRIMARY_BLOB_CONNECTION_STRING":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.primary_blob_connection_string`);
                    assert.fileContent('output.tf.json', '"STORAGE_SECONDARY_BLOB_CONNECTION_STRING":');
                    assert.fileContent('output.tf.json', `azurerm_storage_account.${prompts.name}.secondary_blob_connection_string`);
                });

                it('Adds azurerm provider', () => {
                    assert.fileContent('providers.tf.json', '"provider":');
                    assert.fileContent('providers.tf.json', '"azurerm":');
                });
            });
        });

    });
});