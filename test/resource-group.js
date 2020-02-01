var helpers = require('yeoman-test');
var path = require('path');
var assert = require('yeoman-assert');
var terraform = require('../common/terraform');
const { spawn } = require('child_process');

describe("cloudcommons/cli:resource-group", function () {
    describe('Creates a Resource Group', () => {
        before(done => {
            helpers
                .run(path.join(__dirname, '../generators/azure-resourcegroup'))
                .withPrompts({
                    name: 'cloudcommons',
                    location: 'westeu'
                })
                .once('end', done);
        });

        it('Generates resource group files', () => {
            assert.file('cloudcommons-resource-group.tf');
            assert.file('terraform.tfvars.json');
            assert.file('variables.tf.json');
            assert.file('providers.tf.json');
            assert.file('output.tf.json');
        });

        it('Defines terraform variables', () => {
            assert.fileContent('variables.tf.json', '"APP":');
            assert.fileContent('variables.tf.json', '"RESOURCE_GROUP_NAME":');
            assert.fileContent('variables.tf.json', '"LOCATION":');
        });

        it('Includes resource group info in the variables', () => {
            assert.fileContent('terraform.tfvars.json', `"RESOURCE_GROUP_NAME": "cloudcommons"`);
            assert.fileContent('terraform.tfvars.json', '"LOCATION": "westeu"');
        });

        it('Creates the right output values', () => {
            assert.fileContent('output.tf.json', '"RESOURCE_GROUP_ID":');
            assert.fileContent('output.tf.json', '"${azurerm_resource_group.cloudcommons.id}"');
        });

        it('Adds azurerm provider', () => {
            assert.fileContent('providers.tf.json', '"provider":');
            assert.fileContent('providers.tf.json', '"azurerm":');
        });
    });
});