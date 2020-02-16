var helpers = require('yeoman-test');
var path = require('path');
var assert = require('yeoman-assert');

describe("cloudcommons/cli:azure-sql-database", function () {
    describe('Creates a database', () => {
        describe('From scratch', () => {
            describe('Using an existing resource group', () => {
                var prompts = {
                    databaseName: 'cloudcommons-db',
                    databaseServerResourceGroup: 'cloudcommons',
                    databaseServer: 'cloudcommons-server',
                    databaseEdition: 'Premium',
                    databaseSize: 'P1',
                    databaseRestore: false
                };

                before(done => {
                    helpers
                        .run(path.join(__dirname, '../generators/azure-sql-database'))
                        .withPrompts(prompts)
                        .once('end', done);
                });

                it('Generates database files', () => {
                    assert.file(`${prompts.databaseName}-sql-database.tf`);
                    assert.file('terraform.tfvars.json');
                    assert.file('variables.tf.json');
                    assert.file('providers.tf.json');
                    assert.file('output.tf.json');
                });

                it('Defines terraform variables', () => {
                    assert.fileContent('variables.tf.json', '"DATABASE_NAME":');
                    assert.fileContent('variables.tf.json', '"DATABASE_EDITION":');
                    assert.fileContent('variables.tf.json', '"DATABASE_REQUESTED_SERVICE_OBJETIVE_NAME":');
                    assert.fileContent('variables.tf.json', '"DATABASE_CREATE_MODE":');
                    assert.fileContent('variables.tf.json', '"DATABASE_SOURCE_ID":');
                    assert.fileContent('variables.tf.json', '"DATABASE_SERVER":');
                    assert.fileContent('variables.tf.json', '"DATABASE_SERVER_RESOURCE_GROUP":');
                });

                it('Includes database info in the variables', () => {
                    assert.fileContent('terraform.tfvars.json', `"DATABASE_NAME": "${prompts.databaseName}"`);
                    assert.fileContent('terraform.tfvars.json', `"DATABASE_EDITION": "${prompts.databaseEdition}"`);
                    assert.fileContent('terraform.tfvars.json', `"DATABASE_REQUESTED_SERVICE_OBJETIVE_NAME": "${prompts.databaseSize}"`);
                    assert.fileContent('terraform.tfvars.json', `"DATABASE_CREATE_MODE": "Default"`);
                    assert.noFileContent('terraform.tfvars.json', `"DATABASE_SOURCE_ID":`);
                    assert.fileContent('terraform.tfvars.json', `"DATABASE_SERVER": "${prompts.databaseServer}"`);
                    assert.fileContent('terraform.tfvars.json', `"DATABASE_SERVER_RESOURCE_GROUP": "${prompts.databaseServerResourceGroup}"`);
                });

                it('Creates the right output values', () => {
                    var prefix = `azurerm_sql_database.${prompts.databaseName}`;
                    assert.fileContent('output.tf.json', '"SQL_DATABASE_ID":');
                    assert.fileContent('output.tf.json', `${prefix}.id`);
                    assert.fileContent('output.tf.json', '"SQL_DATABASE_CREATION_DATE":');
                    assert.fileContent('output.tf.json', `${prefix}.creation_date`);
                    assert.fileContent('output.tf.json', '"SQL_DATABASE_DEFAULT_SECONDARY_LOCATION":');
                    assert.fileContent('output.tf.json', `${prefix}.default_secondary_location`);
                });

                it('Adds azurerm provider', () => {
                    assert.fileContent('providers.tf.json', '"provider":');
                    assert.fileContent('providers.tf.json', '"azurerm":');
                });
            });

            describe('Creating a new resource group', () => {
                var prompts = {
                    databaseName: 'cloudcommons-db',
                    databaseServerResourceGroup: 'azurerm_resource_group.workspace',
                    databaseServer: 'azurerm_sql_server.cloudcommons-server',
                    databaseEdition: 'Premium',
                    databaseSize: 'P1',
                    databaseRestore: false
                };

                before(done => {
                    helpers
                        .run(path.join(__dirname, '../generators/azure-sql-database'))
                        .withPrompts(prompts)
                        .once('end', done);
                });

                it('Generates database files', () => {
                    assert.file(`${prompts.databaseName}-sql-database.tf`);
                    assert.file('terraform.tfvars.json');
                    assert.file('variables.tf.json');
                    assert.file('providers.tf.json');
                    assert.file('output.tf.json');
                });

                it('Defines terraform variables', () => {
                    assert.fileContent('variables.tf.json', '"DATABASE_NAME":');
                    assert.fileContent('variables.tf.json', '"DATABASE_EDITION":');
                    assert.fileContent('variables.tf.json', '"DATABASE_REQUESTED_SERVICE_OBJETIVE_NAME":');
                    assert.fileContent('variables.tf.json', '"DATABASE_CREATE_MODE":');
                    assert.fileContent('variables.tf.json', '"DATABASE_SOURCE_ID":');
                    assert.noFileContent('variables.tf.json', '"DATABASE_SERVER":');
                    assert.noFileContent('variables.tf.json', '"DATABASE_SERVER_RESOURCE_GROUP":');
                });

                it('Includes database info in the variables', () => {
                    assert.fileContent('terraform.tfvars.json', `"DATABASE_NAME": "${prompts.databaseName}"`);
                    assert.fileContent('terraform.tfvars.json', `"DATABASE_EDITION": "${prompts.databaseEdition}"`);
                    assert.fileContent('terraform.tfvars.json', `"DATABASE_REQUESTED_SERVICE_OBJETIVE_NAME": "${prompts.databaseSize}"`);
                    assert.fileContent('terraform.tfvars.json', `"DATABASE_CREATE_MODE": "Default"`);
                    assert.noFileContent('terraform.tfvars.json', `"DATABASE_SOURCE_ID":`);
                    assert.noFileContent('terraform.tfvars.json', `"DATABASE_SERVER": "${prompts.databaseServer}"`);
                    assert.noFileContent('terraform.tfvars.json', `"DATABASE_SERVER_RESOURCE_GROUP": "${prompts.databaseServerResourceGroup}"`);
                });

                it('Creates the right output values', () => {
                    var prefix = `azurerm_sql_database.${prompts.databaseName}`;
                    assert.fileContent('output.tf.json', '"SQL_DATABASE_ID":');
                    assert.fileContent('output.tf.json', `${prefix}.id`);
                    assert.fileContent('output.tf.json', '"SQL_DATABASE_CREATION_DATE":');
                    assert.fileContent('output.tf.json', `${prefix}.creation_date`);
                    assert.fileContent('output.tf.json', '"SQL_DATABASE_DEFAULT_SECONDARY_LOCATION":');
                    assert.fileContent('output.tf.json', `${prefix}.default_secondary_location`);
                });

                it('Adds azurerm provider', () => {
                    assert.fileContent('providers.tf.json', '"provider":');
                    assert.fileContent('providers.tf.json', '"azurerm":');
                });
            });
        });
        describe('Restoring from existing database', () => {
            var prompts = {
                databaseName: 'cloudcommons-db',
                databaseServerResourceGroup: 'azurerm_resource_group.workspace',
                databaseServer: 'azurerm_sql_server.cloudcommons-server',
                databaseEdition: 'Premium',
                databaseSize: 'P1',
                databaseRestore: true,
                restoreResourceGroup: 'restoreResourceGroup',
                restoreServerId: 'restoreServerId',
                restoreDatabaseId: 'restoreDatabaseId'
            };

            before(done => {
                helpers
                    .run(path.join(__dirname, '../generators/azure-sql-database'))
                    .withPrompts(prompts)
                    .once('end', done);
            });

            it('Generates database files', () => {
                assert.file(`${prompts.databaseName}-sql-database.tf`);
                assert.file('terraform.tfvars.json');
                assert.file('variables.tf.json');
                assert.file('providers.tf.json');
                assert.file('output.tf.json');
            });

            it('Defines terraform variables', () => {
                assert.fileContent('variables.tf.json', '"DATABASE_NAME":');
                assert.fileContent('variables.tf.json', '"DATABASE_EDITION":');
                assert.fileContent('variables.tf.json', '"DATABASE_REQUESTED_SERVICE_OBJETIVE_NAME":');
                assert.fileContent('variables.tf.json', '"DATABASE_CREATE_MODE":');
                assert.fileContent('variables.tf.json', '"DATABASE_SOURCE_ID":');
                assert.noFileContent('variables.tf.json', '"DATABASE_SERVER":');
                assert.noFileContent('variables.tf.json', '"DATABASE_SERVER_RESOURCE_GROUP":');
            });

            it('Includes database info in the variables', () => {
                assert.fileContent('terraform.tfvars.json', `"DATABASE_NAME": "${prompts.databaseName}"`);
                assert.fileContent('terraform.tfvars.json', `"DATABASE_EDITION": "${prompts.databaseEdition}"`);
                assert.fileContent('terraform.tfvars.json', `"DATABASE_REQUESTED_SERVICE_OBJETIVE_NAME": "${prompts.databaseSize}"`);
                assert.fileContent('terraform.tfvars.json', `"DATABASE_CREATE_MODE": "Copy"`);
                assert.fileContent('terraform.tfvars.json', `"DATABASE_SOURCE_ID": "${prompts.restoreDatabaseId}"`);
                assert.noFileContent('terraform.tfvars.json', `"DATABASE_SERVER": "${prompts.databaseServer}"`);
                assert.noFileContent('terraform.tfvars.json', `"DATABASE_SERVER_RESOURCE_GROUP": "${prompts.databaseServerResourceGroup}"`);
            });

            it('Creates the right output values', () => {
                var prefix = `azurerm_sql_database.${prompts.databaseName}`;
                assert.fileContent('output.tf.json', '"SQL_DATABASE_ID":');
                assert.fileContent('output.tf.json', `${prefix}.id`);
                assert.fileContent('output.tf.json', '"SQL_DATABASE_CREATION_DATE":');
                assert.fileContent('output.tf.json', `${prefix}.creation_date`);
                assert.fileContent('output.tf.json', '"SQL_DATABASE_DEFAULT_SECONDARY_LOCATION":');
                assert.fileContent('output.tf.json', `${prefix}.default_secondary_location`);
            });

            it('Adds azurerm provider', () => {
                assert.fileContent('providers.tf.json', '"provider":');
                assert.fileContent('providers.tf.json', '"azurerm":');
            });
        });
    });
});