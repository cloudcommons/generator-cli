var helpers = require('yeoman-test');
var path = require('path');
var assert = require('yeoman-assert');

describe("cloudcommons/cli:azure-dns-zone", function () {
    describe('Creating new resource group', () => {
        var prompts = {
            name: 'cloudcommons',
            tld: 'cloudcommons.dev',
            resourceGroup: 'azurerm_resource_group.workspace',
        };

        before(done => {
            helpers
                .run(path.join(__dirname, '../generators/azure-dns-zone'))
                .withPrompts(prompts)
                .once('end', done);
        });

        it('Generates log analytics files', () => {
            assert.file(`${prompts.name}-dns-zone.tf`);
            assert.file('terraform.tfvars.json');
            assert.file('variables.tf.json');
            assert.file('providers.tf.json');
            assert.file('output.tf.json');
        });

        it('Defines terraform variables', () => {
            assert.noFileContent('variables.tf.json', '"RESOURCE_GROUP_NAME":');
            assert.fileContent('variables.tf.json', '"DNS_ZONE_NAME":');
        });

        it('Includes resource group info in the variables', () => {
            assert.noFileContent('terraform.tfvars.json', `"RESOURCE_GROUP_NAME":`);
            assert.fileContent('terraform.tfvars.json', `"DNS_ZONE_NAME": "${prompts.tld}"`);
        });

        it('Creates the right output values', () => {
            assert.fileContent('output.tf.json', '"DNS_ZONE_ID":');
            assert.fileContent('output.tf.json', `azurerm_dns_zone.${prompts.name}.id`);
            assert.fileContent('output.tf.json', '"DNS_NAME_SERVERS":');
            assert.fileContent('output.tf.json', `azurerm_dns_zone.${prompts.name}.name_servers`);                             
        });

        it('Adds azurerm provider', () => {
            assert.fileContent('providers.tf.json', '"provider":');
            assert.fileContent('providers.tf.json', '"azurerm":');
        });
    });

    describe('Using existing resource group', () => {
        var prompts = {
            name: 'cloudcommons',
            tld: 'cloudcommons.dev',
            resourceGroup: 'workspace',
        };

        before(done => {
            helpers
                .run(path.join(__dirname, '../generators/azure-dns-zone'))
                .withPrompts(prompts)
                .once('end', done);
        });

        it('Generates log analytics files', () => {
            assert.file(`${prompts.name}-dns-zone.tf`);
            assert.file('terraform.tfvars.json');
            assert.file('variables.tf.json');
            assert.file('providers.tf.json');
            assert.file('output.tf.json');
        });
        it('Defines terraform variables', () => {
            assert.fileContent('variables.tf.json', '"RESOURCE_GROUP_NAME":');
            assert.fileContent('variables.tf.json', '"DNS_ZONE_NAME":');
        });

        it('Includes resource group info in the variables', () => {
            assert.fileContent('terraform.tfvars.json', `"RESOURCE_GROUP_NAME": "${prompts.resourceGroup}"`);
            assert.fileContent('terraform.tfvars.json', `"DNS_ZONE_NAME": "${prompts.tld}"`);
        });

        it('Creates the right output values', () => {
            assert.fileContent('output.tf.json', '"DNS_ZONE_ID":');
            assert.fileContent('output.tf.json', `azurerm_dns_zone.${prompts.name}.id`);
            assert.fileContent('output.tf.json', '"DNS_NAME_SERVERS":');
            assert.fileContent('output.tf.json', `azurerm_dns_zone.${prompts.name}.name_servers`);                             
        });

        it('Adds azurerm provider', () => {
            assert.fileContent('providers.tf.json', '"provider":');
            assert.fileContent('providers.tf.json', '"azurerm":');
        });
    });
});