var helpers = require('yeoman-test');
var path = require('path');
var assert = require('yeoman-assert');

describe("cloudcommons/cli:azure-redis", function () {
    describe('Redis - Basic - C1', () => {
        describe('Existing Resource Group', () => {
            var prompts = {
                name: 'cloudcommons',
                resourceGroup: 'cloudcommons-resource-group',
                location: 'westeu',
                family: 'C',
                sku: 'Basic',
                capacity: 'C1'
            };

            before(done => {
                helpers
                    .run(path.join(__dirname, '../generators/azure-redis'))
                    .withPrompts(prompts)
                    .once('end', done);
            });            

            it('Generates the right files', () => {
                assert.file(`${prompts.name}-redis.tf`);
                assert.file('terraform.tfvars.json');
                assert.file('variables.tf.json');
                assert.file('providers.tf.json');
                assert.file('output.tf.json');
            });

            it('Defines terraform variables', () => {
                assert.fileContent('variables.tf.json', '"REDIS_NAME":');
                assert.fileContent('variables.tf.json', '"REDIS_CAPACITY":');
                assert.fileContent('variables.tf.json', '"REDIS_FAMILY":');
                assert.fileContent('variables.tf.json', '"REDIS_SKU":');
                assert.fileContent('variables.tf.json', '"REDIS_ENABLE_NON_SSL":');
                assert.fileContent('variables.tf.json', '"REDIS_MINIMUM_TLS":');
                assert.fileContent('variables.tf.json', '"REDIS_SUBNET_ID":');
                assert.fileContent('variables.tf.json', '"REDIS_SUBNET_IP":');
                assert.fileContent('variables.tf.json', '"REDIS_PATCH_SCHEDULE":');
                assert.fileContent('variables.tf.json', '"REDIS_SHARD_COUNT":');
                assert.fileContent('variables.tf.json', '"REDIS_RESOURCE_GROUP":');
                assert.fileContent('variables.tf.json', '"REDIS_LOCATION":');
            });

            it('Includes resource group info in the variables', () => {
                assert.fileContent('terraform.tfvars.json', `"REDIS_NAME": "${prompts.name}"`);
                assert.fileContent('terraform.tfvars.json', `"REDIS_CAPACITY": "${prompts.capacity}"`);
                assert.fileContent('terraform.tfvars.json', `"REDIS_FAMILY": "${prompts.family}"`)
                assert.fileContent('terraform.tfvars.json', `"REDIS_SKU": "${prompts.sku}"`);
                assert.fileContent('terraform.tfvars.json', `"REDIS_MINIMUM_TLS": "1.2"`);
                assert.fileContent('terraform.tfvars.json', `"REDIS_RESOURCE_GROUP": "${prompts.resourceGroup}"`);
                assert.fileContent('terraform.tfvars.json', `"REDIS_LOCATION": "${prompts.location}"`);
            });

            it('Creates the right output values', () => {
                assert.fileContent('output.tf.json', '"REDIS_ID":');
                assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.id}"');
                assert.fileContent('output.tf.json', '"REDIS_HOSTNAME":');
                assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.hostname}"');
                assert.fileContent('output.tf.json', '"REDIS_SSL_PORT":');
                assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.ssl_port}"');
                assert.fileContent('output.tf.json', '"REDIS_PORT":');
                assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.port}"');
                assert.fileContent('output.tf.json', '"REDIS_PRIMARY_KEY":');
                assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.primary_key}"');
                assert.fileContent('output.tf.json', '"REDIS_SECONDARY_KEY":');
                assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.secondary_key}"');
                assert.fileContent('output.tf.json', '"REDIS_CONFIGURATION":');
                assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.redis_configuation}"');
            });

            it('Adds azurerm provider', () => {
                assert.fileContent('providers.tf.json', '"provider":');
                assert.fileContent('providers.tf.json', '"azurerm":');
            });
        });

        describe('New Resource Group', () => {
            var prompts = {
                name: 'cloudcommons',
                resourceGroup: 'azurerm_resource_group.cloudcommons',
                location: 'westeu',
                family: 'C',
                sku: 'Basic',
                capacity: 'C1'
            };

            before(done => {
                helpers
                    .run(path.join(__dirname, '../generators/azure-redis'))
                    .withPrompts(prompts)
                    .once('end', done);
            });

            it('Generates the right files', () => {
                assert.file(`${prompts.name}-redis.tf`);
                assert.file('terraform.tfvars.json');
                assert.file('variables.tf.json');
                assert.file('providers.tf.json');
                assert.file('output.tf.json');
            });

            it('Defines terraform variables', () => {
                assert.fileContent('variables.tf.json', '"REDIS_NAME":');
                assert.fileContent('variables.tf.json', '"REDIS_CAPACITY":');
                assert.fileContent('variables.tf.json', '"REDIS_FAMILY":');
                assert.fileContent('variables.tf.json', '"REDIS_SKU":');
                assert.fileContent('variables.tf.json', '"REDIS_ENABLE_NON_SSL":');
                assert.fileContent('variables.tf.json', '"REDIS_MINIMUM_TLS":');
                assert.fileContent('variables.tf.json', '"REDIS_SUBNET_ID":');
                assert.fileContent('variables.tf.json', '"REDIS_SUBNET_IP":');
                assert.fileContent('variables.tf.json', '"REDIS_PATCH_SCHEDULE":');
                assert.fileContent('variables.tf.json', '"REDIS_SHARD_COUNT":');
                assert.noFileContent('variables.tf.json', '"REDIS_RESOURCE_GROUP":');
                assert.noFileContent('variables.tf.json', '"REDIS_LOCATION":');
            });

            it('Includes resource group info in the variables', () => {
                assert.fileContent('terraform.tfvars.json', `"REDIS_NAME": "${prompts.name}"`);
                assert.fileContent('terraform.tfvars.json', `"REDIS_CAPACITY": "${prompts.capacity}"`);
                assert.fileContent('terraform.tfvars.json', `"REDIS_FAMILY": "${prompts.family}"`)
                assert.fileContent('terraform.tfvars.json', `"REDIS_SKU": "${prompts.sku}"`);
                assert.fileContent('terraform.tfvars.json', `"REDIS_MINIMUM_TLS": "1.2"`);
                assert.noFileContent('terraform.tfvars.json', `"REDIS_RESOURCE_GROUP": "${prompts.resourceGroup}"`);
                assert.noFileContent('terraform.tfvars.json', `"REDIS_LOCATION": "${prompts.location}"`);
            });

            it('Creates the right output values', () => {
                assert.fileContent('output.tf.json', '"REDIS_ID":');
                assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.id}"');
                assert.fileContent('output.tf.json', '"REDIS_HOSTNAME":');
                assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.hostname}"');
                assert.fileContent('output.tf.json', '"REDIS_SSL_PORT":');
                assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.ssl_port}"');
                assert.fileContent('output.tf.json', '"REDIS_PORT":');
                assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.port}"');
                assert.fileContent('output.tf.json', '"REDIS_PRIMARY_KEY":');
                assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.primary_key}"');
                assert.fileContent('output.tf.json', '"REDIS_SECONDARY_KEY":');
                assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.secondary_key}"');
                assert.fileContent('output.tf.json', '"REDIS_CONFIGURATION":');
                assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.redis_configuation}"');
            });

            it('Adds azurerm provider', () => {
                assert.fileContent('providers.tf.json', '"provider":');
                assert.fileContent('providers.tf.json', '"azurerm":');
            });
        });
    });

    describe('Redis - Standard - C1', () => {
        describe('Existing Resource Group', () => {
            var prompts = {
                name: 'cloudcommons',
                resourceGroup: 'cloudcommons-resource-group',
                location: 'westeu',
                family: 'C',
                sku: 'Standard',
                capacity: 'C1'
            };

            before(done => {
                helpers
                    .run(path.join(__dirname, '../generators/azure-redis'))
                    .withPrompts(prompts)
                    .once('end', done);
            });

            it('Generates the right files', () => {
                assert.file(`${prompts.name}-redis.tf`);
                assert.file('terraform.tfvars.json');
                assert.file('variables.tf.json');
                assert.file('providers.tf.json');
                assert.file('output.tf.json');
            });

            it('Defines terraform variables', () => {
                assert.fileContent('variables.tf.json', '"REDIS_NAME":');
                assert.fileContent('variables.tf.json', '"REDIS_CAPACITY":');
                assert.fileContent('variables.tf.json', '"REDIS_FAMILY":');
                assert.fileContent('variables.tf.json', '"REDIS_SKU":');
                assert.fileContent('variables.tf.json', '"REDIS_ENABLE_NON_SSL":');
                assert.fileContent('variables.tf.json', '"REDIS_MINIMUM_TLS":');
                assert.fileContent('variables.tf.json', '"REDIS_SUBNET_ID":');
                assert.fileContent('variables.tf.json', '"REDIS_SUBNET_IP":');
                assert.fileContent('variables.tf.json', '"REDIS_PATCH_SCHEDULE":');
                assert.fileContent('variables.tf.json', '"REDIS_SHARD_COUNT":');
                assert.fileContent('variables.tf.json', '"REDIS_RESOURCE_GROUP":');
                assert.fileContent('variables.tf.json', '"REDIS_LOCATION":');
            });

            it('Includes resource group info in the variables', () => {
                assert.fileContent('terraform.tfvars.json', `"REDIS_NAME": "${prompts.name}"`);
                assert.fileContent('terraform.tfvars.json', `"REDIS_CAPACITY": "${prompts.capacity}"`);
                assert.fileContent('terraform.tfvars.json', `"REDIS_FAMILY": "${prompts.family}"`)
                assert.fileContent('terraform.tfvars.json', `"REDIS_SKU": "${prompts.sku}"`);
                assert.fileContent('terraform.tfvars.json', `"REDIS_MINIMUM_TLS": "1.2"`);
                assert.fileContent('terraform.tfvars.json', `"REDIS_RESOURCE_GROUP": "${prompts.resourceGroup}"`);
                assert.fileContent('terraform.tfvars.json', `"REDIS_LOCATION": "${prompts.location}"`);
            });

            it('Creates the right output values', () => {
                assert.fileContent('output.tf.json', '"REDIS_ID":');
                assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.id}"');
                assert.fileContent('output.tf.json', '"REDIS_HOSTNAME":');
                assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.hostname}"');
                assert.fileContent('output.tf.json', '"REDIS_SSL_PORT":');
                assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.ssl_port}"');
                assert.fileContent('output.tf.json', '"REDIS_PORT":');
                assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.port}"');
                assert.fileContent('output.tf.json', '"REDIS_PRIMARY_KEY":');
                assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.primary_key}"');
                assert.fileContent('output.tf.json', '"REDIS_SECONDARY_KEY":');
                assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.secondary_key}"');
                assert.fileContent('output.tf.json', '"REDIS_CONFIGURATION":');
                assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.redis_configuation}"');
            });

            it('Adds azurerm provider', () => {
                assert.fileContent('providers.tf.json', '"provider":');
                assert.fileContent('providers.tf.json', '"azurerm":');
            });
        });
        describe('New Resource Group', () => {
            var prompts = {
                name: 'cloudcommons',
                resourceGroup: 'azurerm_resource_group.cloudcommons',
                location: 'westeu',
                family: 'C',
                sku: 'Standard',
                capacity: 'C1'
            };

            before(done => {
                helpers
                    .run(path.join(__dirname, '../generators/azure-redis'))
                    .withPrompts(prompts)
                    .once('end', done);
            });

            it('Generates the right files', () => {
                assert.file(`${prompts.name}-redis.tf`);
                assert.file('terraform.tfvars.json');
                assert.file('variables.tf.json');
                assert.file('providers.tf.json');
                assert.file('output.tf.json');
            });

            it('Defines terraform variables', () => {
                assert.fileContent('variables.tf.json', '"REDIS_NAME":');
                assert.fileContent('variables.tf.json', '"REDIS_CAPACITY":');
                assert.fileContent('variables.tf.json', '"REDIS_FAMILY":');
                assert.fileContent('variables.tf.json', '"REDIS_SKU":');
                assert.fileContent('variables.tf.json', '"REDIS_ENABLE_NON_SSL":');
                assert.fileContent('variables.tf.json', '"REDIS_MINIMUM_TLS":');
                assert.fileContent('variables.tf.json', '"REDIS_SUBNET_ID":');
                assert.fileContent('variables.tf.json', '"REDIS_SUBNET_IP":');
                assert.fileContent('variables.tf.json', '"REDIS_PATCH_SCHEDULE":');
                assert.fileContent('variables.tf.json', '"REDIS_SHARD_COUNT":');
                assert.noFileContent('variables.tf.json', '"REDIS_RESOURCE_GROUP":');
                assert.noFileContent('variables.tf.json', '"REDIS_LOCATION":');
            });

            it('Includes resource group info in the variables', () => {
                assert.fileContent('terraform.tfvars.json', `"REDIS_NAME": "${prompts.name}"`);
                assert.fileContent('terraform.tfvars.json', `"REDIS_CAPACITY": "${prompts.capacity}"`);
                assert.fileContent('terraform.tfvars.json', `"REDIS_FAMILY": "${prompts.family}"`)
                assert.fileContent('terraform.tfvars.json', `"REDIS_SKU": "${prompts.sku}"`);
                assert.fileContent('terraform.tfvars.json', `"REDIS_MINIMUM_TLS": "1.2"`);
                assert.noFileContent('terraform.tfvars.json', `"REDIS_RESOURCE_GROUP": "${prompts.resourceGroup}"`);
                assert.noFileContent('terraform.tfvars.json', `"REDIS_LOCATION": "${prompts.location}"`);
            });

            it('Creates the right output values', () => {
                assert.fileContent('output.tf.json', '"REDIS_ID":');
                assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.id}"');
                assert.fileContent('output.tf.json', '"REDIS_HOSTNAME":');
                assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.hostname}"');
                assert.fileContent('output.tf.json', '"REDIS_SSL_PORT":');
                assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.ssl_port}"');
                assert.fileContent('output.tf.json', '"REDIS_PORT":');
                assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.port}"');
                assert.fileContent('output.tf.json', '"REDIS_PRIMARY_KEY":');
                assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.primary_key}"');
                assert.fileContent('output.tf.json', '"REDIS_SECONDARY_KEY":');
                assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.secondary_key}"');
                assert.fileContent('output.tf.json', '"REDIS_CONFIGURATION":');
                assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.redis_configuation}"');
            });

            it('Adds azurerm provider', () => {
                assert.fileContent('providers.tf.json', '"provider":');
                assert.fileContent('providers.tf.json', '"azurerm":');
            });
        });
    });

    describe('Redis - Premium - P1', () => {
        describe("Existing Resource Group", () => {
            describe("VNET Deployment", () => {                
                var prompts = {
                    name: 'cloudcommons',
                    resourceGroup: 'cloudcommons-resource-group',
                    location: 'westeu',
                    family: 'P',
                    sku: 'Premium',
                    capacity: 'P1',
                    features: ['vnet'],
                    vnetSubnet: 'my-subnet',
                    vnetStaticIp: '127.0.0.1'
                };

                before(done => {
                    helpers
                        .run(path.join(__dirname, '../generators/azure-redis'))
                        .withPrompts(prompts)
                        .once('end', done);
                });

                it('Generates the right files', () => {
                    assert.file(`${prompts.name}-redis.tf`);
                    assert.file('terraform.tfvars.json');
                    assert.file('variables.tf.json');
                    assert.file('providers.tf.json');
                    assert.file('output.tf.json');
                });

                it('Defines terraform variables', () => {
                    assert.fileContent('variables.tf.json', '"REDIS_NAME":');
                    assert.fileContent('variables.tf.json', '"REDIS_CAPACITY":');
                    assert.fileContent('variables.tf.json', '"REDIS_FAMILY":');
                    assert.fileContent('variables.tf.json', '"REDIS_SKU":');
                    assert.fileContent('variables.tf.json', '"REDIS_ENABLE_NON_SSL":');
                    assert.fileContent('variables.tf.json', '"REDIS_MINIMUM_TLS":');
                    assert.fileContent('variables.tf.json', '"REDIS_SUBNET_ID":');
                    assert.fileContent('variables.tf.json', '"REDIS_SUBNET_IP":');
                    assert.fileContent('variables.tf.json', '"REDIS_PATCH_SCHEDULE":');
                    assert.fileContent('variables.tf.json', '"REDIS_SHARD_COUNT":');
                    assert.fileContent('variables.tf.json', '"REDIS_RESOURCE_GROUP":');
                    assert.fileContent('variables.tf.json', '"REDIS_LOCATION":');
                });

                it('Includes resource group info in the variables', () => {
                    assert.fileContent('terraform.tfvars.json', `"REDIS_NAME": "${prompts.name}"`);
                    assert.fileContent('terraform.tfvars.json', `"REDIS_CAPACITY": "${prompts.capacity}"`);
                    assert.fileContent('terraform.tfvars.json', `"REDIS_FAMILY": "${prompts.family}"`)
                    assert.fileContent('terraform.tfvars.json', `"REDIS_SKU": "${prompts.sku}"`);
                    assert.fileContent('terraform.tfvars.json', `"REDIS_MINIMUM_TLS": "1.2"`);
                    assert.fileContent('terraform.tfvars.json', `"REDIS_RESOURCE_GROUP": "${prompts.resourceGroup}"`);
                    assert.fileContent('terraform.tfvars.json', `"REDIS_LOCATION": "${prompts.location}"`);
                });

                it('Creates the right output values', () => {
                    assert.fileContent('output.tf.json', '"REDIS_ID":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.id}"');
                    assert.fileContent('output.tf.json', '"REDIS_HOSTNAME":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.hostname}"');
                    assert.fileContent('output.tf.json', '"REDIS_SSL_PORT":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.ssl_port}"');
                    assert.fileContent('output.tf.json', '"REDIS_PORT":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.port}"');
                    assert.fileContent('output.tf.json', '"REDIS_PRIMARY_KEY":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.primary_key}"');
                    assert.fileContent('output.tf.json', '"REDIS_SECONDARY_KEY":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.secondary_key}"');
                    assert.fileContent('output.tf.json', '"REDIS_CONFIGURATION":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.redis_configuation}"');
                });

                it('Adds azurerm provider', () => {
                    assert.fileContent('providers.tf.json', '"provider":');
                    assert.fileContent('providers.tf.json', '"azurerm":');
                });
            });
            describe("Sharded cache", () => {
                var prompts = {
                    name: 'cloudcommons',
                    resourceGroup: 'cloudcommons-resource-group',
                    location: 'westeu',
                    family: 'P',
                    sku: 'Premium',
                    capacity: 'P1',
                    features: ['shard'],
                    shardCount: 2
                };

                before(done => {
                    helpers
                        .run(path.join(__dirname, '../generators/azure-redis'))
                        .withPrompts(prompts)
                        .once('end', done);
                });

                it('Generates the right files', () => {
                    assert.file(`${prompts.name}-redis.tf`);
                    assert.file('terraform.tfvars.json');
                    assert.file('variables.tf.json');
                    assert.file('providers.tf.json');
                    assert.file('output.tf.json');
                });

                it('Defines terraform variables', () => {
                    assert.fileContent('variables.tf.json', '"REDIS_NAME":');
                    assert.fileContent('variables.tf.json', '"REDIS_CAPACITY":');
                    assert.fileContent('variables.tf.json', '"REDIS_FAMILY":');
                    assert.fileContent('variables.tf.json', '"REDIS_SKU":');
                    assert.fileContent('variables.tf.json', '"REDIS_ENABLE_NON_SSL":');
                    assert.fileContent('variables.tf.json', '"REDIS_MINIMUM_TLS":');                    
                    assert.fileContent('variables.tf.json', '"REDIS_SUBNET_ID":');
                    assert.fileContent('variables.tf.json', '"REDIS_SUBNET_IP":');
                    assert.fileContent('variables.tf.json', '"REDIS_SHARD_COUNT":');
                    assert.fileContent('variables.tf.json', '"REDIS_PATCH_SCHEDULE":');
                    assert.fileContent('variables.tf.json', '"REDIS_SHARD_COUNT":');
                    assert.fileContent('variables.tf.json', '"REDIS_RESOURCE_GROUP":');
                    assert.fileContent('variables.tf.json', '"REDIS_LOCATION":');
                });

                it('Includes resource group info in the variables', () => {
                    assert.fileContent('terraform.tfvars.json', `"REDIS_NAME": "${prompts.name}"`);
                    assert.fileContent('terraform.tfvars.json', `"REDIS_CAPACITY": "${prompts.capacity}"`);
                    assert.fileContent('terraform.tfvars.json', `"REDIS_FAMILY": "${prompts.family}"`)
                    assert.fileContent('terraform.tfvars.json', `"REDIS_SKU": "${prompts.sku}"`);
                    assert.fileContent('terraform.tfvars.json', `"REDIS_MINIMUM_TLS": "1.2"`);
                    assert.fileContent('terraform.tfvars.json', `"REDIS_SHARD_COUNT": ${prompts.shardCount}`);
                    assert.fileContent('terraform.tfvars.json', `"REDIS_RESOURCE_GROUP": "${prompts.resourceGroup}"`);
                    assert.fileContent('terraform.tfvars.json', `"REDIS_LOCATION": "${prompts.location}"`);
                });

                it('Creates the right output values', () => {
                    assert.fileContent('output.tf.json', '"REDIS_ID":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.id}"');
                    assert.fileContent('output.tf.json', '"REDIS_HOSTNAME":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.hostname}"');
                    assert.fileContent('output.tf.json', '"REDIS_SSL_PORT":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.ssl_port}"');
                    assert.fileContent('output.tf.json', '"REDIS_PORT":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.port}"');
                    assert.fileContent('output.tf.json', '"REDIS_PRIMARY_KEY":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.primary_key}"');
                    assert.fileContent('output.tf.json', '"REDIS_SECONDARY_KEY":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.secondary_key}"');
                    assert.fileContent('output.tf.json', '"REDIS_CONFIGURATION":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.redis_configuation}"');
                });

                it('Adds azurerm provider', () => {
                    assert.fileContent('providers.tf.json', '"provider":');
                    assert.fileContent('providers.tf.json', '"azurerm":');
                });                
            });
            describe("Patch schedule", () => {
                var prompts = {
                    name: 'cloudcommons',
                    resourceGroup: 'cloudcommons-resource-group',
                    location: 'westeu',
                    family: 'P',
                    sku: 'Premium',
                    capacity: 'P1',
                    features: ['patch-schedule'],
                    patchScheduleDays: ['Saturday', 'Sunday'],
                    patchScheduleTime: 5
                };

                before(done => {
                    helpers
                        .run(path.join(__dirname, '../generators/azure-redis'))
                        .withPrompts(prompts)
                        .once('end', done);
                });

                it('Generates the right files', () => {
                    assert.file(`${prompts.name}-redis.tf`);
                    assert.file('terraform.tfvars.json');
                    assert.file('variables.tf.json');
                    assert.file('providers.tf.json');
                    assert.file('output.tf.json');
                });

                it('Defines terraform variables', () => {
                    assert.fileContent('variables.tf.json', '"REDIS_NAME":');
                    assert.fileContent('variables.tf.json', '"REDIS_CAPACITY":');
                    assert.fileContent('variables.tf.json', '"REDIS_FAMILY":');
                    assert.fileContent('variables.tf.json', '"REDIS_SKU":');
                    assert.fileContent('variables.tf.json', '"REDIS_ENABLE_NON_SSL":');
                    assert.fileContent('variables.tf.json', '"REDIS_MINIMUM_TLS":');                    
                    assert.fileContent('variables.tf.json', '"REDIS_SUBNET_ID":');
                    assert.fileContent('variables.tf.json', '"REDIS_SUBNET_IP":');
                    assert.fileContent('variables.tf.json', '"REDIS_SHARD_COUNT":');
                    assert.fileContent('variables.tf.json', '"REDIS_PATCH_SCHEDULE":');
                    assert.fileContent('variables.tf.json', '"REDIS_SHARD_COUNT":');
                    assert.fileContent('variables.tf.json', '"REDIS_RESOURCE_GROUP":');
                    assert.fileContent('variables.tf.json', '"REDIS_LOCATION":');
                });

                it('Includes resource group info in the variables', () => {
                    assert.fileContent('terraform.tfvars.json', `"REDIS_NAME": "${prompts.name}"`);
                    assert.fileContent('terraform.tfvars.json', `"REDIS_CAPACITY": "${prompts.capacity}"`);
                    assert.fileContent('terraform.tfvars.json', `"REDIS_FAMILY": "${prompts.family}"`)
                    assert.fileContent('terraform.tfvars.json', `"REDIS_SKU": "${prompts.sku}"`);
                    assert.fileContent('terraform.tfvars.json', `"REDIS_MINIMUM_TLS": "1.2"`);
                    assert.noFileContent('terraform.tfvars.json', `"REDIS_SHARD_COUNT":`);
                    assert.fileContent('terraform.tfvars.json', `"REDIS_PATCH_SCHEDULE":`);
                    assert.fileContent('terraform.tfvars.json', `"day_of_week": "${prompts.patchScheduleDays[0]}",`);
                    assert.fileContent('terraform.tfvars.json', `"day_of_week": "${prompts.patchScheduleDays[1]}",`);
                    assert.fileContent('terraform.tfvars.json', `"start_hour_utc": ${prompts.patchScheduleTime}`);
                    assert.fileContent('terraform.tfvars.json', `"REDIS_RESOURCE_GROUP": "${prompts.resourceGroup}"`);
                    assert.fileContent('terraform.tfvars.json', `"REDIS_LOCATION": "${prompts.location}"`);
                });

                it('Creates the right output values', () => {
                    assert.fileContent('output.tf.json', '"REDIS_ID":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.id}"');
                    assert.fileContent('output.tf.json', '"REDIS_HOSTNAME":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.hostname}"');
                    assert.fileContent('output.tf.json', '"REDIS_SSL_PORT":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.ssl_port}"');
                    assert.fileContent('output.tf.json', '"REDIS_PORT":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.port}"');
                    assert.fileContent('output.tf.json', '"REDIS_PRIMARY_KEY":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.primary_key}"');
                    assert.fileContent('output.tf.json', '"REDIS_SECONDARY_KEY":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.secondary_key}"');
                    assert.fileContent('output.tf.json', '"REDIS_CONFIGURATION":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.redis_configuation}"');
                });

                it('Adds azurerm provider', () => {
                    assert.fileContent('providers.tf.json', '"provider":');
                    assert.fileContent('providers.tf.json', '"azurerm":');
                });     
            });
        });
        describe("New Resource Group", () => {
            describe("VNET Deployment", () => {                
                var prompts = {
                    name: 'cloudcommons',
                    resourceGroup: 'azurerm_resource_group.cloudcommons',
                    family: 'P',
                    sku: 'Premium',
                    capacity: 'P1',
                    features: ['vnet'],
                    vnetSubnet: 'my-subnet',
                    vnetStaticIp: '127.0.0.1'
                };

                before(done => {
                    helpers
                        .run(path.join(__dirname, '../generators/azure-redis'))
                        .withPrompts(prompts)
                        .once('end', done);
                });

                it('Generates the right files', () => {
                    assert.file(`${prompts.name}-redis.tf`);
                    assert.file('terraform.tfvars.json');
                    assert.file('variables.tf.json');
                    assert.file('providers.tf.json');
                    assert.file('output.tf.json');
                });

                it('Defines terraform variables', () => {
                    assert.fileContent('variables.tf.json', '"REDIS_NAME":');
                    assert.fileContent('variables.tf.json', '"REDIS_CAPACITY":');
                    assert.fileContent('variables.tf.json', '"REDIS_FAMILY":');
                    assert.fileContent('variables.tf.json', '"REDIS_SKU":');
                    assert.fileContent('variables.tf.json', '"REDIS_ENABLE_NON_SSL":');
                    assert.fileContent('variables.tf.json', '"REDIS_MINIMUM_TLS":');
                    assert.fileContent('variables.tf.json', '"REDIS_SUBNET_ID":');
                    assert.fileContent('variables.tf.json', '"REDIS_SUBNET_IP":');
                    assert.fileContent('variables.tf.json', '"REDIS_PATCH_SCHEDULE":');
                    assert.fileContent('variables.tf.json', '"REDIS_SHARD_COUNT":');
                    assert.noFileContent('variables.tf.json', '"REDIS_RESOURCE_GROUP":');
                    assert.noFileContent('variables.tf.json', '"REDIS_LOCATION":');
                });

                it('Includes resource group info in the variables', () => {
                    assert.fileContent('terraform.tfvars.json', `"REDIS_NAME": "${prompts.name}"`);
                    assert.fileContent('terraform.tfvars.json', `"REDIS_CAPACITY": "${prompts.capacity}"`);
                    assert.fileContent('terraform.tfvars.json', `"REDIS_FAMILY": "${prompts.family}"`)
                    assert.fileContent('terraform.tfvars.json', `"REDIS_SKU": "${prompts.sku}"`);
                    assert.fileContent('terraform.tfvars.json', `"REDIS_MINIMUM_TLS": "1.2"`);
                    assert.noFileContent('terraform.tfvars.json', `"REDIS_RESOURCE_GROUP":`);
                    assert.noFileContent('terraform.tfvars.json', `"REDIS_LOCATION":`);
                });

                it('Creates the right output values', () => {
                    assert.fileContent('output.tf.json', '"REDIS_ID":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.id}"');
                    assert.fileContent('output.tf.json', '"REDIS_HOSTNAME":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.hostname}"');
                    assert.fileContent('output.tf.json', '"REDIS_SSL_PORT":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.ssl_port}"');
                    assert.fileContent('output.tf.json', '"REDIS_PORT":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.port}"');
                    assert.fileContent('output.tf.json', '"REDIS_PRIMARY_KEY":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.primary_key}"');
                    assert.fileContent('output.tf.json', '"REDIS_SECONDARY_KEY":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.secondary_key}"');
                    assert.fileContent('output.tf.json', '"REDIS_CONFIGURATION":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.redis_configuation}"');
                });

                it('Adds azurerm provider', () => {
                    assert.fileContent('providers.tf.json', '"provider":');
                    assert.fileContent('providers.tf.json', '"azurerm":');
                });
            });
            describe("Sharded cache", () => {
                var prompts = {
                    name: 'cloudcommons',
                    resourceGroup: 'azurerm_resource_group.cloudcommons',
                    family: 'P',
                    sku: 'Premium',
                    capacity: 'P1',
                    features: ['shard'],
                    shardCount: 2
                };

                before(done => {
                    helpers
                        .run(path.join(__dirname, '../generators/azure-redis'))
                        .withPrompts(prompts)
                        .once('end', done);
                });

                it('Generates the right files', () => {
                    assert.file(`${prompts.name}-redis.tf`);
                    assert.file('terraform.tfvars.json');
                    assert.file('variables.tf.json');
                    assert.file('providers.tf.json');
                    assert.file('output.tf.json');
                });

                it('Defines terraform variables', () => {
                    assert.fileContent('variables.tf.json', '"REDIS_NAME":');
                    assert.fileContent('variables.tf.json', '"REDIS_CAPACITY":');
                    assert.fileContent('variables.tf.json', '"REDIS_FAMILY":');
                    assert.fileContent('variables.tf.json', '"REDIS_SKU":');
                    assert.fileContent('variables.tf.json', '"REDIS_ENABLE_NON_SSL":');
                    assert.fileContent('variables.tf.json', '"REDIS_MINIMUM_TLS":');                    
                    assert.fileContent('variables.tf.json', '"REDIS_SUBNET_ID":');
                    assert.fileContent('variables.tf.json', '"REDIS_SUBNET_IP":');
                    assert.fileContent('variables.tf.json', '"REDIS_SHARD_COUNT":');
                    assert.fileContent('variables.tf.json', '"REDIS_PATCH_SCHEDULE":');
                    assert.fileContent('variables.tf.json', '"REDIS_SHARD_COUNT":');
                    assert.noFileContent('variables.tf.json', '"REDIS_RESOURCE_GROUP":');
                    assert.noFileContent('variables.tf.json', '"REDIS_LOCATION":');
                });

                it('Includes resource group info in the variables', () => {
                    assert.fileContent('terraform.tfvars.json', `"REDIS_NAME": "${prompts.name}"`);
                    assert.fileContent('terraform.tfvars.json', `"REDIS_CAPACITY": "${prompts.capacity}"`);
                    assert.fileContent('terraform.tfvars.json', `"REDIS_FAMILY": "${prompts.family}"`)
                    assert.fileContent('terraform.tfvars.json', `"REDIS_SKU": "${prompts.sku}"`);
                    assert.fileContent('terraform.tfvars.json', `"REDIS_MINIMUM_TLS": "1.2"`);
                    assert.fileContent('terraform.tfvars.json', `"REDIS_SHARD_COUNT": ${prompts.shardCount}`);
                    assert.noFileContent('terraform.tfvars.json', `"REDIS_RESOURCE_GROUP":`);
                    assert.noFileContent('terraform.tfvars.json', `"REDIS_LOCATION":`);
                });

                it('Creates the right output values', () => {
                    assert.fileContent('output.tf.json', '"REDIS_ID":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.id}"');
                    assert.fileContent('output.tf.json', '"REDIS_HOSTNAME":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.hostname}"');
                    assert.fileContent('output.tf.json', '"REDIS_SSL_PORT":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.ssl_port}"');
                    assert.fileContent('output.tf.json', '"REDIS_PORT":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.port}"');
                    assert.fileContent('output.tf.json', '"REDIS_PRIMARY_KEY":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.primary_key}"');
                    assert.fileContent('output.tf.json', '"REDIS_SECONDARY_KEY":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.secondary_key}"');
                    assert.fileContent('output.tf.json', '"REDIS_CONFIGURATION":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.redis_configuation}"');
                });

                it('Adds azurerm provider', () => {
                    assert.fileContent('providers.tf.json', '"provider":');
                    assert.fileContent('providers.tf.json', '"azurerm":');
                });                
            });
            describe("Patch schedule", () => {
                var prompts = {
                    name: 'cloudcommons',
                    resourceGroup: 'azurerm_resource_group.cloudcommons',
                    family: 'P',
                    sku: 'Premium',
                    capacity: 'P1',
                    features: ['patch-schedule'],
                    patchScheduleDays: ['Saturday', 'Sunday'],
                    patchScheduleTime: 5
                };

                before(done => {
                    helpers
                        .run(path.join(__dirname, '../generators/azure-redis'))
                        .withPrompts(prompts)
                        .once('end', done);
                });

                it('Generates the right files', () => {
                    assert.file(`${prompts.name}-redis.tf`);
                    assert.file('terraform.tfvars.json');
                    assert.file('variables.tf.json');
                    assert.file('providers.tf.json');
                    assert.file('output.tf.json');
                });

                it('Defines terraform variables', () => {
                    assert.fileContent('variables.tf.json', '"REDIS_NAME":');
                    assert.fileContent('variables.tf.json', '"REDIS_CAPACITY":');
                    assert.fileContent('variables.tf.json', '"REDIS_FAMILY":');
                    assert.fileContent('variables.tf.json', '"REDIS_SKU":');
                    assert.fileContent('variables.tf.json', '"REDIS_ENABLE_NON_SSL":');
                    assert.fileContent('variables.tf.json', '"REDIS_MINIMUM_TLS":');                    
                    assert.fileContent('variables.tf.json', '"REDIS_SUBNET_ID":');
                    assert.fileContent('variables.tf.json', '"REDIS_SUBNET_IP":');
                    assert.fileContent('variables.tf.json', '"REDIS_SHARD_COUNT":');
                    assert.fileContent('variables.tf.json', '"REDIS_PATCH_SCHEDULE":');
                    assert.fileContent('variables.tf.json', '"REDIS_SHARD_COUNT":');
                    assert.noFileContent('variables.tf.json', '"REDIS_RESOURCE_GROUP":');
                    assert.noFileContent('variables.tf.json', '"REDIS_LOCATION":');
                });

                it('Includes resource group info in the variables', () => {
                    assert.fileContent('terraform.tfvars.json', `"REDIS_NAME": "${prompts.name}"`);
                    assert.fileContent('terraform.tfvars.json', `"REDIS_CAPACITY": "${prompts.capacity}"`);
                    assert.fileContent('terraform.tfvars.json', `"REDIS_FAMILY": "${prompts.family}"`)
                    assert.fileContent('terraform.tfvars.json', `"REDIS_SKU": "${prompts.sku}"`);
                    assert.fileContent('terraform.tfvars.json', `"REDIS_MINIMUM_TLS": "1.2"`);
                    assert.noFileContent('terraform.tfvars.json', `"REDIS_SHARD_COUNT":`);
                    assert.fileContent('terraform.tfvars.json', `"REDIS_PATCH_SCHEDULE":`);
                    assert.fileContent('terraform.tfvars.json', `"day_of_week": "${prompts.patchScheduleDays[0]}",`);
                    assert.fileContent('terraform.tfvars.json', `"day_of_week": "${prompts.patchScheduleDays[1]}",`);
                    assert.fileContent('terraform.tfvars.json', `"start_hour_utc": ${prompts.patchScheduleTime}`);
                    assert.noFileContent('terraform.tfvars.json', `"REDIS_RESOURCE_GROUP":`);
                    assert.noFileContent('terraform.tfvars.json', `"REDIS_LOCATION":`);
                });

                it('Creates the right output values', () => {
                    assert.fileContent('output.tf.json', '"REDIS_ID":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.id}"');
                    assert.fileContent('output.tf.json', '"REDIS_HOSTNAME":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.hostname}"');
                    assert.fileContent('output.tf.json', '"REDIS_SSL_PORT":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.ssl_port}"');
                    assert.fileContent('output.tf.json', '"REDIS_PORT":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.port}"');
                    assert.fileContent('output.tf.json', '"REDIS_PRIMARY_KEY":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.primary_key}"');
                    assert.fileContent('output.tf.json', '"REDIS_SECONDARY_KEY":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.secondary_key}"');
                    assert.fileContent('output.tf.json', '"REDIS_CONFIGURATION":');
                    assert.fileContent('output.tf.json', '"${azurerm_redis_cache.cloudcommons.redis_configuation}"');
                });

                it('Adds azurerm provider', () => {
                    assert.fileContent('providers.tf.json', '"provider":');
                    assert.fileContent('providers.tf.json', '"azurerm":');
                });     
            });
        });        
    });
});