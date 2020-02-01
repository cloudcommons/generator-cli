var helpers = require('yeoman-test');
var path = require('path');
var assert = require('yeoman-assert');
var terraform = require('../common/terraform');
const { spawn } = require('child_process');

describe("cloudcommons/cli:terraform", function () {
    describe('Initialises a local provider', () => {
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
});