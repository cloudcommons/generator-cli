var helpers = require('yeoman-test');
var path = require('path');
var assert = require('yeoman-assert');

describe("cloudcommons/cli:azure-log-analytics", function () {
    describe('Creating new resource group', () => {
        var prompts = {
            name: 'cloudcommons',
            resourceGroup: 'azurerm_resource_group.workspace',
            location: 'westeu',
            retention: 30
        };

        before(done => {
            helpers
                .run(path.join(__dirname, '../generators/azure-log-analytics'))
                .withPrompts(prompts)
                .once('end', done);
        });

        it('Generates log analytics files', () => {
            assert.file(`${prompts.name}-log-analytics.tf`);
            assert.file('terraform.tfvars.json');
            assert.file('variables.tf.json');
            assert.file('providers.tf.json');
            assert.file('output.tf.json');
        });

        it('Defines terraform variables', () => {
            assert.noFileContent('variables.tf.json', '"RESOURCE_GROUP_NAME":');
            assert.fileContent('variables.tf.json', '"LOCATION":');
            assert.fileContent('variables.tf.json', '"LOG_ANALYTICS_RETENTION_DAYS":');
        });

        it('Includes resource group info in the variables', () => {
            assert.noFileContent('terraform.tfvars.json', `"RESOURCE_GROUP_NAME":`);
            assert.fileContent('terraform.tfvars.json', `"LOCATION": "${prompts.location}"`);
            assert.fileContent('terraform.tfvars.json', `"LOG_ANALYTICS_RETENTION_DAYS": ${prompts.retention}`);
        });

        it('Creates the right output values', () => {
            assert.fileContent('output.tf.json', '"LOG_ANALYTICS_ID":');
            assert.fileContent('output.tf.json', `azurerm_log_analytics_workspace.${prompts.name}.id`);
            assert.fileContent('output.tf.json', '"LOG_ANALYTICS_PRIMARY_SHARED_KEY":');
            assert.fileContent('output.tf.json', `azurerm_log_analytics_workspace.${prompts.name}.primary_shared_key`);
            assert.fileContent('output.tf.json', '"LOG_ANALYTICS_SECONDARY_SHARED_KEY":');
            assert.fileContent('output.tf.json', `azurerm_log_analytics_workspace.${prompts.name}.secondary_shared_key`);
            assert.fileContent('output.tf.json', '"LOG_ANALYTICS_WORKSPACE_ID":');
            assert.fileContent('output.tf.json', `azurerm_log_analytics_workspace.${prompts.name}.workspace_id`);
            assert.fileContent('output.tf.json', '"LOG_ANALYTICS_PORTAL_URL":');
            assert.fileContent('output.tf.json', `azurerm_log_analytics_workspace.${prompts.name}.portal_url`);                                    
        });

        it('Adds azurerm provider', () => {
            assert.fileContent('providers.tf.json', '"provider":');
            assert.fileContent('providers.tf.json', '"azurerm":');
        });
    });

    describe('Using existing resource group', () => {
        var prompts = {
            name: 'cloudcommons',
            resourceGroup: 'workspace',
            location: 'westeu',
            retention: 30
        };

        before(done => {
            helpers
                .run(path.join(__dirname, '../generators/azure-log-analytics'))
                .withPrompts(prompts)
                .once('end', done);
        });

        it('Generates log analytics files', () => {
            assert.file(`${prompts.name}-log-analytics.tf`);
            assert.file('terraform.tfvars.json');
            assert.file('variables.tf.json');
            assert.file('providers.tf.json');
            assert.file('output.tf.json');
        });

        it('Defines terraform variables', () => {
            assert.fileContent('variables.tf.json', '"RESOURCE_GROUP_NAME":');
            assert.fileContent('variables.tf.json', '"LOCATION":');
            assert.fileContent('variables.tf.json', '"LOG_ANALYTICS_RETENTION_DAYS":');
        });

        it('Includes resource group info in the variables', () => {
            assert.fileContent('terraform.tfvars.json', `"RESOURCE_GROUP_NAME": "${prompts.resourceGroup}"`);
            assert.fileContent('terraform.tfvars.json', `"LOCATION": "${prompts.location}"`);
            assert.fileContent('terraform.tfvars.json', `"LOG_ANALYTICS_RETENTION_DAYS": ${prompts.retention}`);
        });

        it('Creates the right output values', () => {
            assert.fileContent('output.tf.json', '"LOG_ANALYTICS_ID":');
            assert.fileContent('output.tf.json', `azurerm_log_analytics_workspace.${prompts.name}.id`);
            assert.fileContent('output.tf.json', '"LOG_ANALYTICS_PRIMARY_SHARED_KEY":');
            assert.fileContent('output.tf.json', `azurerm_log_analytics_workspace.${prompts.name}.primary_shared_key`);
            assert.fileContent('output.tf.json', '"LOG_ANALYTICS_SECONDARY_SHARED_KEY":');
            assert.fileContent('output.tf.json', `azurerm_log_analytics_workspace.${prompts.name}.secondary_shared_key`);
            assert.fileContent('output.tf.json', '"LOG_ANALYTICS_WORKSPACE_ID":');
            assert.fileContent('output.tf.json', `azurerm_log_analytics_workspace.${prompts.name}.workspace_id`);
            assert.fileContent('output.tf.json', '"LOG_ANALYTICS_PORTAL_URL":');
            assert.fileContent('output.tf.json', `azurerm_log_analytics_workspace.${prompts.name}.portal_url`);                                    
        });

        it('Adds azurerm provider', () => {
            assert.fileContent('providers.tf.json', '"provider":');
            assert.fileContent('providers.tf.json', '"azurerm":');
        });
    });
});