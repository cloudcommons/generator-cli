var helpers = require('yeoman-test');
var path = require('path');
var assert = require('yeoman-assert');

describe("cloudcommons/cli:azure-ip-address", function () {
    process.env.mockAzure = "true";
    describe('Creates a Static IP address in west europe', () => {
        var prompts = {
            name: 'cloudcommons',
            location: 'westeurope',
            resourceGroup: 'myResourceGroup',
            ipAllocationMethod: 'Static'
        };

        before(done => {
            helpers
                .run(path.join(__dirname, '../generators/azure-ip-address'))
                .withPrompts(prompts)
                .once('end', done);
        });

        it('Generates ip files', () => {
            assert.file(`${prompts.name}-ip.tf`);
            assert.file('terraform.tfvars.json');
            assert.file('variables.tf.json');
            assert.file('providers.tf.json');
            assert.file('output.tf.json');
        });

        it('Defines terraform variables', () => {
            assert.fileContent('variables.tf.json', '"IP_RESOURCE_GROUP_NAME":');
            assert.fileContent('variables.tf.json', '"IP_VERSION":');
            assert.fileContent('variables.tf.json', '"IP_ALLOCATION_METHOD":');
            assert.fileContent('variables.tf.json', '"IP_LOCATION":');
        });

        it('Includes IP info in the variables', () => {
            assert.fileContent('terraform.tfvars.json', `"IP_RESOURCE_GROUP_NAME": "${prompts.resourceGroup}"`);
            assert.fileContent('terraform.tfvars.json', `"IP_LOCATION": "${prompts.location}"`);
            assert.fileContent('terraform.tfvars.json', `"IP_VERSION": "${prompts.ipVersion ? prompts.ipVersion : "IPv4"}"`);
            assert.fileContent('terraform.tfvars.json', `"IP_ALLOCATION_METHOD": "${prompts.ipAllocationMethod}"`);
        });

        it('Creates the right output values', () => {
            assert.fileContent('output.tf.json', '"IP_ID":');
            assert.fileContent('output.tf.json', `azurerm_public_ip.${prompts.name}.id}`);
            assert.fileContent('output.tf.json', '"IP_ADDRESS":');
            assert.fileContent('output.tf.json', `azurerm_public_ip.${prompts.name}.ip_address}`);            
        });

        it('Adds azurerm provider', () => {
            assert.fileContent('providers.tf.json', '"provider":');
            assert.fileContent('providers.tf.json', '"azurerm":');
        });

        it('Updates .yo-rc', () => {
            assert.file('.yo-rc.json');
            assert.fileContent('.yo-rc.json','azurerm_public_ip.cloudcommons');
            assert.fileContent('.yo-rc.json', "azure-ip-address");
        });
    });
});