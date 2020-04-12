const assert = require('yeoman-assert');
const genSpec = require('../helpers/geneteratorSpecificationHelper');

describe("cloudcommons/cli:azure-resource-group", function () {
    describe("Terraform plan validations", function () {
        describe("Resource group cloudcommons in westeu", function () {
            var spec = {
                config: {
                    terraform: {
                        init: true,
                        plan: true
                    }
                },
                generators: {
                    "terraform": {
                        prompts: {
                            app: "cloudcommons",
                            version: "0.12.20",
                            backendType: "local"
                        }
                    },
                    "azure-resource-group": {
                        prompts: {
                            name: 'cloudcommons',
                            location: 'westeu'
                        }
                    }
                }
            };

            var prompts = spec.generators["azure-resource-group"].prompts;
            var plan = null;

            before(done => {
                genSpec(spec, (terraformPlan) => {
                    plan = terraformPlan;
                    done();
                });
            });

            it('Generates a valid plan', () => {
                assert.ok(plan);
            });

            it('Plans to create all the variables', () => {
                plan.variables("APP").is("cloudcommons");
                plan.variables("CREATOR").is("cloudcommons");
                plan.variables("ENVIRONMENT").is("default");
                plan.variables("LOCATION").is(prompts.location);
                plan.variables("RESOURCE_GROUP_NAME").is(prompts.name);
            });

            it('Plans the right output variables', () => {
                plan.planned_values.outputs("RESOURCE_GROUP_ID").isNotSensitive();
            });

            it(`Plans includes the resource group ${prompts.name}`, () => {
                var resourceGroup = plan.planned_values.root_module.resources(`azurerm_resource_group.${prompts.name}`);
                resourceGroup.mode().is("managed")
                    .type().is("azurerm_resource_group")
                    .name().is(prompts.name)
                    .providerName().is("azurerm")
                    .value("location").is(prompts.location);
            });

            it('Plan includes the global random id', () => {
                var randomId = plan.planned_values.root_module.resources(`random_id.cloudcommons`);
                randomId.mode().is("managed")
                    .type().is("random_id")
                    .name().is("cloudcommons")
                    .providerName().is("random")
                    .value("byte_length").is(4);
            });

            it(`Will create the resources ${prompts.name}`, () => {
                var change = plan.resource_changes(`azurerm_resource_group.${prompts.name}`);
                change.name().is(prompts.name)                    
                    .type().is('azurerm_resource_group')
                    .action().is('create')
                    .providerName().is('azurerm');

                change.before().isNull();
                change.after().is('location', prompts.location);
                change.unknown()
                    .is('id')
                    .is('name')
                    .is('tags');
            });

            it(`Will create the output variables`, () => {
                plan.output_changes('RESOURCE_GROUP_ID').actionIs('create');
            });

            it('Will use the right providers', () => {
                plan.configuration.provider('azurerm');
                plan.configuration.provider('random');
            });

            it('Will have the correct environment variables and they have description', () => {
                plan.configuration.variable('APP').defaultIs('cloudcommons').hasDescription();
                plan.configuration.variable('CREATOR').defaultIs('cloudcommons').hasDescription();
                plan.configuration.variable('ENVIRONMENT').defaultIs('default').hasDescription();
                plan.configuration.variable('LOCATION').hasDescription();
                plan.configuration.variable('RESOURCE_GROUP_NAME').hasDescription();
            });
        });
    });
});
