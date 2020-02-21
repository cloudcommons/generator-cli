var helpers = require('yeoman-test');
var path = require('path');
var assert = require('yeoman-assert');

describe("cloudcommons/cli:terraform", function () {
    describe('Initialises local provider', () => {
        var prompts = {
            app: 'cloudcommons',
            version: '~> v0.12.19',
            backendType: 'local'
        };

        before(done => {
            helpers
                .run(path.join(__dirname, '../generators/terraform'))
                .withPrompts(prompts)
                .once('end', done);
        });

        it('Generates required files', () => {
            assert.file('LICENSE');
            assert.file('.gitignore');
            assert.file('__init__.tf');
            assert.file('variables.tf.json');
        });

        it('Is licensed to me :)', () => {
            assert.fileContent('LICENSE', 'Sergio Sisternes Pla');
        });

        it('Init file is OK', () => {
            assert.fileContent('__init__.tf', `required_version = "${prompts.version}"`);
            assert.fileContent('__init__.tf', `backend "${prompts.backendType}"`);
        });

        it('Copies the variables', () => {
            assert.fileContent('variables.tf.json', `"APP": `);
            assert.fileContent('variables.tf.json', `"default": "${prompts.app}"`);      
        });
    });

    describe('Initialises remote provider', () => {
        var prompts = {
            app: 'cloudcommons',
            version: '~> v0.12.19',
            backendType: 'remote',
            remoteHostname: 'app.terraform.io',
            remoteOrganization: 'cloudcommons',
            remoteWorkspace: 'cli'
        };

        before(done => {
            helpers
                .run(path.join(__dirname, '../generators/terraform'))
                .withPrompts(prompts)
                .once('end', done);
        });

        it('Generates required files', () => {
            assert.file('LICENSE');
            assert.file('.gitignore');
            assert.file('__init__.tf');
            assert.file('variables.tf.json');
        });

        it('Is licensed to me :)', () => {
            assert.fileContent('LICENSE', 'Sergio Sisternes Pla');
        });

        it('Init file is OK', () => {
            assert.fileContent('__init__.tf', `required_version = "${prompts.version}"`);
            assert.fileContent('__init__.tf', `backend "${prompts.backendType}"`);
            assert.fileContent('__init__.tf', `hostname`);
            assert.fileContent('__init__.tf', `= "${prompts.remoteHostname}"`);
            assert.fileContent('__init__.tf', `organization`);
            assert.fileContent('__init__.tf', `= "${prompts.remoteOrganization}"`);
        });

        it('Copies the variables', () => {
            assert.fileContent('variables.tf.json', `"APP": `);
            assert.fileContent('variables.tf.json', `"default": "${prompts.app}"`);      
        });
    }); 
    
    describe('Initialises azurerm provider', () => {        
        var prompts = {
            app: 'cloudcommons',
            version: '~> v0.12.19',
            backendType: 'azurerm',
            azureRmResourceGroup: 'terraform',
            azureRmStorageAccountName: 'terraform01234',
            azureRmContainerName: 'tfstates',
            azureRmContainerKey: 'myapp'
        };

        before(done => {
            helpers
                .run(path.join(__dirname, '../generators/terraform'))
                .withPrompts(prompts)
                .once('end', done);
        });

        it('Generates required files', () => {
            assert.file('LICENSE');
            assert.file('.gitignore');
            assert.file('__init__.tf');
            assert.file('variables.tf.json');
        });

        it('Is licensed to me :)', () => {
            assert.fileContent('LICENSE', 'Sergio Sisternes Pla');
        });

        it('Init file is OK', () => {
            assert.fileContent('__init__.tf', `required_version = "${prompts.version}"`);
            assert.fileContent('__init__.tf', `backend "${prompts.backendType}"`);
            assert.fileContent('__init__.tf', `resource_group_name`);
            assert.fileContent('__init__.tf', `= "${prompts.azureRmResourceGroup}"`);
            assert.fileContent('__init__.tf', `storage_account_name`);
            assert.fileContent('__init__.tf', `= "${prompts.azureRmStorageAccountName}"`);
            assert.fileContent('__init__.tf', `container_name`);
            assert.fileContent('__init__.tf', `= "${prompts.azureRmContainerName}"`);
            assert.fileContent('__init__.tf', `key`);
            assert.fileContent('__init__.tf', `= "${prompts.azureRmContainerKey}"`);                        
        });

        it('Copies the variables', () => {
            assert.fileContent('variables.tf.json', `"APP": `);
            assert.fileContent('variables.tf.json', `"default": "${prompts.app}"`);      
        });
    });        
});