var helpers = require('yeoman-test');
var path = require('path');
var assert = require('yeoman-assert');

describe("cloudcommons/cli:azure-application-insights", function () {
    describe('Creating new Application insights', () => {
        describe('Creating new resource group', () => {
            describe('Of type "web"', () => {
                var prompts = {
                    name: 'cloudcommons',
                    resourceGroup: 'azurerm_resource_group.workspace',
                    location: 'westeu',
                    type: 'web'
                };

                before(done => {
                    helpers
                        .run(path.join(__dirname, '../generators/azure-application-insights'))
                        .withPrompts(prompts)
                        .once('end', done);
                });

                it('Generates log analytics files', () => {
                    assert.file(`${prompts.name}-app-insights.tf`);
                    assert.file('terraform.tfvars.json');
                    assert.file('variables.tf.json');
                    assert.file('providers.tf.json');
                    assert.file('output.tf.json');
                });

                it('Defines terraform variables', () => {
                    assert.noFileContent('variables.tf.json', '"RESOURCE_GROUP_NAME":');
                    assert.fileContent('variables.tf.json', '"LOCATION":');
                    assert.fileContent('variables.tf.json', '"APP_INSIGHTS_TYPE":');
                });

                it('Includes resource group info in the variables', () => {
                    assert.noFileContent('terraform.tfvars.json', `"RESOURCE_GROUP_NAME":`);
                    assert.fileContent('terraform.tfvars.json', `"LOCATION": "${prompts.location}"`);
                    assert.fileContent('terraform.tfvars.json', `"APP_INSIGHTS_TYPE": "${prompts.type}"`);
                });

                it('Creates the right output values', () => {
                    assert.fileContent('output.tf.json', '"APP_INSIGHTS_ID":');
                    assert.fileContent('output.tf.json', `azurerm_application_insights.${prompts.name}.id`);
                    assert.fileContent('output.tf.json', '"APP_INSIGHTS_APP_ID":');
                    assert.fileContent('output.tf.json', `azurerm_application_insights.${prompts.name}.app_id`);
                    assert.fileContent('output.tf.json', '"APP_INSIGHTS_INSTRUMENTATION_KEY":');
                    assert.fileContent('output.tf.json', `azurerm_application_insights.${prompts.name}.instrumentation_key`);
                });

                it('Adds azurerm provider', () => {
                    assert.fileContent('providers.tf.json', '"provider":');
                    assert.fileContent('providers.tf.json', '"azurerm":');
                });
            });
        });
    });

    describe('Using existing resource group', () => {
        describe('Of type "web"', () => {
            var prompts = {
                name: 'cloudcommons',
                resourceGroup: 'workspace',
                location: 'westeu',
                type: 'web'
            };

            before(done => {
                helpers
                    .run(path.join(__dirname, '../generators/azure-application-insights'))
                    .withPrompts(prompts)
                    .once('end', done);
            });

            it('Generates log analytics files', () => {
                assert.file(`${prompts.name}-app-insights.tf`);
                assert.file('terraform.tfvars.json');
                assert.file('variables.tf.json');
                assert.file('providers.tf.json');
                assert.file('output.tf.json');
            });

            it('Defines terraform variables', () => {
                assert.fileContent('variables.tf.json', '"RESOURCE_GROUP_NAME":');
                assert.fileContent('variables.tf.json', '"LOCATION":');
                assert.fileContent('variables.tf.json', '"APP_INSIGHTS_TYPE":');
            });

            it('Includes resource group info in the variables', () => {
                assert.fileContent('terraform.tfvars.json', `"RESOURCE_GROUP_NAME": "${prompts.resourceGroup}"`);
                assert.fileContent('terraform.tfvars.json', `"LOCATION": "${prompts.location}"`);
                assert.fileContent('terraform.tfvars.json', `"APP_INSIGHTS_TYPE": "${prompts.type}"`);
            });

            it('Creates the right output values', () => {
                assert.fileContent('output.tf.json', '"APP_INSIGHTS_ID":');
                assert.fileContent('output.tf.json', `azurerm_application_insights.${prompts.name}.id`);
                assert.fileContent('output.tf.json', '"APP_INSIGHTS_APP_ID":');
                assert.fileContent('output.tf.json', `azurerm_application_insights.${prompts.name}.app_id`);
                assert.fileContent('output.tf.json', '"APP_INSIGHTS_INSTRUMENTATION_KEY":');
                assert.fileContent('output.tf.json', `azurerm_application_insights.${prompts.name}.instrumentation_key`);
            });

            it('Adds azurerm provider', () => {
                assert.fileContent('providers.tf.json', '"provider":');
                assert.fileContent('providers.tf.json', '"azurerm":');
            });
        });
    });
});