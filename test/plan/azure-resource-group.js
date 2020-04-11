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
                plan.variable("APP").is("cloudcommons");
                plan.variable("CREATOR").is("cloudcommons");
                plan.variable("ENVIRONMENT").is("default");
                plan.variable("LOCATION").is(prompts.location);
                plan.variable("RESOURCE_GROUP_NAME").is(prompts.name);
            });

            it('Plans the right output variables', () => {
                plan.plannedValues.output("RESOURCE_GROUP_ID").isNotSensitive();
            });

            it(`Plans includes the resource group ${prompts.name}`, () => {
                var resourceGroup = plan.plannedValues.resources.resource(`azurerm_resource_group.${prompts.name}`);
                resourceGroup.modeIs("managed")
                    .typeIs("azurerm_resource_group")
                    .nameIs(prompts.name)
                    .providerNameIs("azurerm")
                    .valueIs("location", prompts.location);
            });

            it('Plan includes the global random id', () => {
                var randomId = plan.plannedValues.resources.resource(`random_id.cloudcommons`);
                randomId.modeIs("managed")
                    .typeIs("random_id")
                    .nameIs("cloudcommons")
                    .providerNameIs("random")
                    .valueIs("byte_length", 4);
            });

            it(`Will create the resources ${prompts.name}`, () => {
                var address = `azurerm_resource_group.${prompts.name}`;
                var change = plan.resourceChange(address);
                change.actionIs('create')
                    .typeIs('azurerm_resource_group')
                    .nameIs(prompts.name)
                    .providerNameIs('azurerm');

                change.before.isNull();
                change.after.is('location', prompts.location);
                change.unknown.is('id')
                    .is('name')
                    .is('tags');
            });

            it(`Will create the output variables`, () => {
                plan.outputChange('RESOURCE_GROUP_ID').actionIs('create');
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
