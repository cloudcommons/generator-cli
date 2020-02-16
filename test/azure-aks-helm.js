var helpers = require('yeoman-test');
var path = require('path');
var assert = require('yeoman-assert');

describe("cloudcommons/cli:azure-aks-helm", function () {
    describe('Creates a helm release', () => {
        describe('Without any additional features', () => {
            var prompts = {
                name: 'cloudcommons',
                chartName: 'stable/sonarqube',
                chartVersion: '3.4.0',
                recreatePods: true,
                features: []
            };

            before(done => {
                helpers
                    .run(path.join(__dirname, '../generators/azure-aks-helm'))
                    .withPrompts(prompts)
                    .once('end', done);
            });

            it('Generates resource group files', () => {
                assert.file(`${prompts.name}-helm-chart.tf`);
                assert.file(`${prompts.name}-helm-repository.tf`);
                assert.file(`templates/${prompts.name}-values.yml`);
                assert.file('terraform.tfvars.json');
                assert.file('variables.tf.json');
                assert.file('providers.tf.json');
                assert.file('output.tf.json');
            });

            it('Defines terraform variables', () => {
                assert.fileContent('variables.tf.json', '"RELEASE_NAME":');
                assert.fileContent('variables.tf.json', '"APP_CHART":');
                assert.fileContent('variables.tf.json', '"APP_CHART_VERSION":');
                assert.fileContent('variables.tf.json', '"HELM_RECREATE_PODS":');
                assert.noFileContent('variables.tf.json', '"CLUSTER_ISSUER":');
            });

            it('Configuration values are copied to terraform.tfvars.json correctly', () => {
                assert.fileContent('terraform.tfvars.json', `"RELEASE_NAME": "${prompts.name}"`);
                assert.fileContent('terraform.tfvars.json', `"APP_CHART": "${prompts.chartName}"`);
                assert.fileContent('terraform.tfvars.json', `"APP_CHART_VERSION": "${prompts.chartVersion}"`);
                assert.fileContent('terraform.tfvars.json', `"HELM_RECREATE_PODS": ${prompts.recreatePods}`);
                assert.noFileContent('terraform.tfvars.json', `"CLUSTER_ISSUER":`);
            });

            it('Creates the right output values', () => {
                assert.fileContent('output.tf.json', '"HELM_METADATA":');
                assert.fileContent('output.tf.json', `helm_release.${prompts.name}.metadata`);
            });

            it('Adds kubernetes provider', () => {
                assert.fileContent('providers.tf.json', '"provider":');
                assert.fileContent('providers.tf.json', '"helm":');
                assert.fileContent('providers.tf.json', '"version":');
            });
        });
    });
});