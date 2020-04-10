const helpers = require('yeoman-test');
const path = require('path');
const assert = require('yeoman-assert');
const TerraformHelper = require('../helpers/terraformHelper');
const terraform = new TerraformHelper();

describe("Terraform plan", function () {
    describe("Validate cloudcommons/cli:resource-group", function () {
        describe("Resource group cloudcommons in westeu", function () {
            var prompts = {
                app: 'cloudcommons',
                version: '~> v0.12.19',
                backendType: 'local',
                name: 'cloudcommons',
                location: 'westeu'
            }

            var plan = null;

            before(done => {
                helpers
                    .run(path.join(__dirname, '../../generators/azure-resource-group'))
                    .inTmpDir(terraform.initialiseDir)
                    .withPrompts(prompts)
                    .once('end', () => {
                        plan = terraform.getGeneratorPlan(done);
                    });
            });

            it('Generates a valid plan', () => {
                assert.ok(plan);
            });

            it('Plans to create all the variables', () => {
                plan.variable("APP").is(prompts.app);
                plan.variable("CREATOR").is("cloudcommons");
                plan.variable("ENVIRONMENT").is("default");
                plan.variable("LOCATION").is(prompts.location);
                plan.variable("RESOURCE_GROUP_NAME").is(prompts.name);
            });

            it('Plans the right output variables', () => {
                plan.plannedValues.output("RESOURCE_GROUP_ID").isNotSensitive();
            });

            it(`Plans the resource group ${prompts.name}`, () => {
                var resourceGroup = plan.plannedValues.resources.resource(`azurerm_resource_group.${prompts.name}`);
                resourceGroup.modeIs("managed")
                    .typeIs("azurerm_resource_group")
                    .nameIs(prompts.name)
                    .providerNameIs("azurerm")
                    .valueIs("location", prompts.location);
            });

            it('Plans the global random id', () => {
                var randomId = plan.plannedValues.resources.resource(`random_id.cloudcommons`);
                randomId.modeIs("managed")
                    .typeIs("random_id")
                    .nameIs("cloudcommons")
                    .providerNameIs("random")
                    .valueIs("byte_length", 4);
            });
        });
    });
}); 