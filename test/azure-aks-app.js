var helpers = require('yeoman-test');
var path = require('path');
var assert = require('yeoman-assert');

describe("cloudcommons/cli:azure-aks-app", function () {
    describe('Creates an application', () => {
        describe('With TLS and public load balancer', () => {
            var prompts = {
                name: 'cloudcommons',
                location: 'westeurope',
                features: ["ingress", "tls"],
                ingressType: 'publicLoadBalancer',
                aksResourceGroup: 'aks-long-resource-group-name',
                ingressHostname: 'my.app.local',
                ingressChartAndVersion: 'stable/nginx-ingress:1.5.0',
                ingressReplicas: 2,
                imageName: 'nginx',
                imageTag: 'latest',
                imageReplicaCount: 2,
                imagePullPolicy: 'Always',
                tlsType: 'cert-manager',
                certificateIssuer: 'letsencrypt'                
            };

            before(done => {
                helpers
                    .run(path.join(__dirname, '../generators/azure-aks-app'))
                    .withPrompts(prompts)
                    .once('end', done);
            });

            it('Generates resource group files', () => {
                assert.file('app.tf');
                assert.file('terraform.tfvars.json');
                assert.file('variables.tf.json');
                assert.file('providers.tf.json');
                assert.file('output.tf.json');
            });

            it('Defines terraform variables', () => {
                assert.fileContent('variables.tf.json', '"APP":');
                assert.fileContent('variables.tf.json', '"INGRESS_ENABLED":');
                assert.fileContent('variables.tf.json', '"INGRESS_HOSTNAME":');
                assert.fileContent('variables.tf.json', '"INGRESS_CHART":');
                assert.fileContent('variables.tf.json', '"INGRESS_CHART_VERSION":');
                assert.fileContent('variables.tf.json', '"INGRESS_SERVICE_SUBNET":');
                assert.fileContent('variables.tf.json', '"INGRESS_IP":');
                assert.fileContent('variables.tf.json', '"INGRESS_REPLICAS":');
                assert.fileContent('variables.tf.json', '"APP_IMAGE_REPOSITORY":');
                assert.fileContent('variables.tf.json', '"APP_IMAGE_TAG":');
                assert.fileContent('variables.tf.json', '"APP_IMAGE_PULLPOLICY":');
                assert.fileContent('variables.tf.json', '"APP_IMAGE_REPLICACOUNT":');
                assert.fileContent('variables.tf.json', '"APP_INGRESS_TLS_ENABLED":');
                assert.fileContent('variables.tf.json', '"CLUSTER_ISSUER":');       
            });

            it('Includes resource group info in the variables', () => {                
                assert.fileContent('terraform.tfvars.json', `"APP": "${prompts.name}"`);
                assert.fileContent('terraform.tfvars.json', `"INGRESS_HOSTNAME": null`);
                assert.fileContent('terraform.tfvars.json', `"INGRESS_CHART": "stable/nginx-ingress"`);
                assert.fileContent('terraform.tfvars.json', `"INGRESS_CHART_VERSION": "1.5.0"`);
                assert.noFileContent('terraform.tfvars.json', `"INGRESS_SERVICE_SUBNET":`);
                assert.noFileContent('terraform.tfvars.json', `"INGRESS_IP":`);
                assert.fileContent('terraform.tfvars.json', `"INGRESS_REPLICAS": ${prompts.ingressReplicas}`);
                assert.fileContent('terraform.tfvars.json', `"APP_IMAGE_REPOSITORY": "${prompts.imageName}"`);
                assert.fileContent('terraform.tfvars.json', `"APP_IMAGE_TAG": "${prompts.imageTag}"`);
                assert.fileContent('terraform.tfvars.json', `"APP_IMAGE_PULLPOLICY": "${prompts.imagePullPolicy}"`);
                assert.fileContent('terraform.tfvars.json', `"APP_IMAGE_REPLICACOUNT": ${prompts.imageReplicaCount}`);
                assert.fileContent('terraform.tfvars.json', `"APP_INGRESS_TLS_ENABLED": true`);
                assert.fileContent('terraform.tfvars.json', `"CLUSTER_ISSUER": "${prompts.certificateIssuer}"`);
            });
            it('Adds azurerm provider', () => {
                assert.fileContent('providers.tf.json', '"provider":');
                assert.fileContent('providers.tf.json', '"azurerm":');
            });
        });
    });
});