var helpers = require('yeoman-test');
var path = require('path');
var assert = require('yeoman-assert');

describe("cloudcommons/cli:azure-search", function () {
    describe('Azure Cognitive Search - Basic', () => {
        describe('Existing resource group', () => {
            var prompts = {
                name: 'cloudcommons',
                resourceGroup: 'cloudcommons-resource-group',
                location: 'westeu',
                sku: 'basic'
            };

            before(done => {
                helpers
                    .run(path.join(__dirname, '../generators/azure-search'))
                    .withPrompts(prompts)
                    .on('end', done);
            });

            it('Generates the right files', () => {
                assert.file(`${prompts.name}-search.tf`);
                assert.file('terraform.tfvars.json');
                assert.file('variables.tf.json');
                assert.file('providers.tf.json');
                assert.file('output.tf.json');
            });

            it('Defines terraform variables', () => {
                assert.fileContent('variables.tf.json', '"SEARCH_NAME":');
                assert.fileContent('variables.tf.json', '"SEARCH_SKU":');
                assert.fileContent('variables.tf.json', '"SEARCH_REPLICA_COUNT":');
                assert.fileContent('variables.tf.json', '"SEARCH_PARTITION_COUNT":');
                assert.fileContent('variables.tf.json', '"SEARCH_LOCATION":');
                assert.fileContent('variables.tf.json', '"SEARCH_RESOURCE_GROUP":');
            });

            it('Includes resource group info in the variables', () => {
                assert.fileContent('terraform.tfvars.json', `"SEARCH_NAME": "cloudcommons"`);
                assert.fileContent('terraform.tfvars.json', '"SEARCH_SKU": "basic"');
                assert.fileContent('terraform.tfvars.json', '"SEARCH_RESOURCE_GROUP": "cloudcommons-resource-group"')
                assert.fileContent('terraform.tfvars.json', '"SEARCH_LOCATION": "westeu"');
            });

            it('Creates the right output values', () => {
                assert.fileContent('output.tf.json', '"SEARCH_ID":');
                assert.fileContent('output.tf.json', '"${azurerm_search_service.cloudcommons.id}"');
                assert.fileContent('output.tf.json', '"SEARCH_PRIMARY_KEY":');
                assert.fileContent('output.tf.json', '"${azurerm_search_service.cloudcommons.primary_key}"');
                assert.fileContent('output.tf.json', '"SEARCH_SECONDARY_KEY":');
                assert.fileContent('output.tf.json', '"${azurerm_search_service.cloudcommons.secondary_key}"');
                assert.fileContent('output.tf.json', '"SEARCH_QUERY_KEYS":');
                assert.fileContent('output.tf.json', '"${azurerm_search_service.cloudcommons.query_keys}"');
            });

            it('Adds azurerm provider', () => {
                assert.fileContent('providers.tf.json', '"provider":');
                assert.fileContent('providers.tf.json', '"azurerm":');
            });
        });

        describe('New resource group', () => {
            var prompts = {
                name: 'cloudcommons',
                resourceGroup: 'azurerm_resource_group.cloudcommons',
                location: 'westeu',
                sku: 'basic'
            };

            before(done => {
                helpers
                    .run(path.join(__dirname, '../generators/azure-search'))
                    .withPrompts(prompts)
                    .on('end', done);
            });

            it('Generates the right files', () => {
                assert.file(`${prompts.name}-search.tf`);
                assert.file('terraform.tfvars.json');
                assert.file('variables.tf.json');
                assert.file('providers.tf.json');
                assert.file('output.tf.json');
            });

            it('Defines terraform variables', () => {
                assert.fileContent('variables.tf.json', '"SEARCH_NAME":');
                assert.fileContent('variables.tf.json', '"SEARCH_SKU":');
                assert.fileContent('variables.tf.json', '"SEARCH_REPLICA_COUNT":');
                assert.fileContent('variables.tf.json', '"SEARCH_PARTITION_COUNT":');
                assert.noFileContent('variables.tf.json', '"SEARCH_LOCATION":');
                assert.noFileContent('variables.tf.json', '"SEARCH_RESOURCE_GROUP":');
            });

            it('Don\'t add resource group information to variables', () => {
                assert.fileContent('terraform.tfvars.json', `"SEARCH_NAME": "cloudcommons"`);
                assert.fileContent('terraform.tfvars.json', '"SEARCH_SKU": "basic"');
                assert.noFileContent('terraform.tfvars.json', '"SEARCH_RESOURCE_GROUP": "cloudcommons-resource-group"')
                assert.noFileContent('terraform.tfvars.json', '"SEARCH_LOCATION": "westeu"');
            });

            it('Adds azurerm provider', () => {
                assert.fileContent('providers.tf.json', '"provider":');
                assert.fileContent('providers.tf.json', '"azurerm":');
            });
        });
    })

    describe('Azure Cognitive Standard - Standard', () => {
        describe('Existing resource group', () => {
            var prompts = {
                name: 'cloudcommons',
                resourceGroup: 'cloudcommons-resource-group',
                location: 'westeu',
                sku: 'standard',
                partitionCount: 4,
                replicaCount: 3
            };

            before(done => {
                helpers
                    .run(path.join(__dirname, '../generators/azure-search'))
                    .withPrompts(prompts)
                    .on('end', done);
            });

            it('Generates the right files', () => {
                assert.file(`${prompts.name}-search.tf`);
                assert.file('terraform.tfvars.json');
                assert.file('variables.tf.json');
                assert.file('providers.tf.json');
                assert.file('output.tf.json');
            });

            it('Defines terraform variables', () => {
                assert.fileContent('variables.tf.json', '"SEARCH_NAME":');
                assert.fileContent('variables.tf.json', '"SEARCH_SKU":');
                assert.fileContent('variables.tf.json', '"SEARCH_REPLICA_COUNT":');
                assert.fileContent('variables.tf.json', '"SEARCH_PARTITION_COUNT":');
                assert.fileContent('variables.tf.json', '"SEARCH_LOCATION":');
                assert.fileContent('variables.tf.json', '"SEARCH_RESOURCE_GROUP":');
            });

            it('Includes resource group info in the variables', () => {
                assert.fileContent('terraform.tfvars.json', `"SEARCH_NAME": "cloudcommons"`);
                assert.fileContent('terraform.tfvars.json', '"SEARCH_SKU": "standard"');
                assert.fileContent('terraform.tfvars.json', '"SEARCH_RESOURCE_GROUP": "cloudcommons-resource-group"')
                assert.fileContent('terraform.tfvars.json', '"SEARCH_LOCATION": "westeu"');
                assert.fileContent('terraform.tfvars.json', '"SEARCH_PARTITION_COUNT": 4');
                assert.fileContent('terraform.tfvars.json', '"SEARCH_REPLICA_COUNT": 3');
            });

            it('Creates the right output values', () => {
                assert.fileContent('output.tf.json', '"SEARCH_ID":');
                assert.fileContent('output.tf.json', '"${azurerm_search_service.cloudcommons.id}"');
                assert.fileContent('output.tf.json', '"SEARCH_PRIMARY_KEY":');
                assert.fileContent('output.tf.json', '"${azurerm_search_service.cloudcommons.primary_key}"');
                assert.fileContent('output.tf.json', '"SEARCH_SECONDARY_KEY":');
                assert.fileContent('output.tf.json', '"${azurerm_search_service.cloudcommons.secondary_key}"');
                assert.fileContent('output.tf.json', '"SEARCH_QUERY_KEYS":');
                assert.fileContent('output.tf.json', '"${azurerm_search_service.cloudcommons.query_keys}"');
            });

            it('Adds azurerm provider', () => {
                assert.fileContent('providers.tf.json', '"provider":');
                assert.fileContent('providers.tf.json', '"azurerm":');
            });
        });

        describe('New resource group', () => {
            var prompts = {
                name: 'cloudcommons',
                resourceGroup: 'azurerm_resource_group.cloudcommons',
                location: 'westeu',
                sku: 'standard',
                partitionCount: 4,
                replicaCount: 3
            };

            before(done => {
                helpers
                    .run(path.join(__dirname, '../generators/azure-search'))
                    .withPrompts(prompts)
                    .on('end', done);
            });

            it('Generates the right files', () => {
                assert.file(`${prompts.name}-search.tf`);
                assert.file('terraform.tfvars.json');
                assert.file('variables.tf.json');
                assert.file('providers.tf.json');
                assert.file('output.tf.json');
            });

            it('Defines terraform variables', () => {
                assert.fileContent('variables.tf.json', '"SEARCH_NAME":');
                assert.fileContent('variables.tf.json', '"SEARCH_SKU":');
                assert.fileContent('variables.tf.json', '"SEARCH_REPLICA_COUNT":');
                assert.fileContent('variables.tf.json', '"SEARCH_PARTITION_COUNT":');
                assert.noFileContent('variables.tf.json', '"SEARCH_LOCATION":');
                assert.noFileContent('variables.tf.json', '"SEARCH_RESOURCE_GROUP":');
            });

            it('Includes resource group info in the variables', () => {
                assert.fileContent('terraform.tfvars.json', `"SEARCH_NAME": "cloudcommons"`);
                assert.fileContent('terraform.tfvars.json', '"SEARCH_SKU": "standard"');
                assert.fileContent('terraform.tfvars.json', '"SEARCH_PARTITION_COUNT": 4');
                assert.fileContent('terraform.tfvars.json', '"SEARCH_REPLICA_COUNT": 3');
                assert.noFileContent('terraform.tfvars.json', '"SEARCH_RESOURCE_GROUP": "cloudcommons-resource-group"')
                assert.noFileContent('terraform.tfvars.json', '"SEARCH_LOCATION": "westeu"');
            });

            it('Creates the right output values', () => {
                assert.fileContent('output.tf.json', '"SEARCH_ID":');
                assert.fileContent('output.tf.json', '"${azurerm_search_service.cloudcommons.id}"');
                assert.fileContent('output.tf.json', '"SEARCH_PRIMARY_KEY":');
                assert.fileContent('output.tf.json', '"${azurerm_search_service.cloudcommons.primary_key}"');
                assert.fileContent('output.tf.json', '"SEARCH_SECONDARY_KEY":');
                assert.fileContent('output.tf.json', '"${azurerm_search_service.cloudcommons.secondary_key}"');
                assert.fileContent('output.tf.json', '"SEARCH_QUERY_KEYS":');
                assert.fileContent('output.tf.json', '"${azurerm_search_service.cloudcommons.query_keys}"');
            });

            it('Adds azurerm provider', () => {
                assert.fileContent('providers.tf.json', '"provider":');
                assert.fileContent('providers.tf.json', '"azurerm":');
            });
        });
    });
});