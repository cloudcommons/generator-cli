const helpers = require('yeoman-test');
const path = require('path');
const assert = require('yeoman-assert');
const TerraformHelper = require('../helpers/terraformHelper');

describe("Terraform Integration", function () {

    describe('Test tools are working', () => {
        var context = null
        var prompts = {
            app: 'cloudcommons',
            version: '~> v0.12.19',
            backendType: 'local'
        };

        before(done => {
            helpers
                .run(path.join(__dirname, '../../generators/terraform'))
                .withPrompts(prompts)
                .once('end', done);
        });

        it('Generates a JSON plan', () => {
            var terraform = new TerraformHelper();
            terraform.init();
            var plan = terraform.getPlan()
            assert.ok(plan, "No plan found");
        });
    });
});