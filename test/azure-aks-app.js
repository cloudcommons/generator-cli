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
                assert.file('nginx-ingress.tf');
                assert.file('templates/ingress.yml');
                assert.file('ip.tf');
                assert.file('terraform.tfvars.json');
                assert.file('variables.tf.json');
                assert.file('providers.tf.json');
                assert.file('output.tf.json');
            });

            it('Defines terraform variables', () => {
                assert.fileContent('variables.tf.json', '"APP_NAME":');
                assert.fileContent('variables.tf.json', '"CREATOR":');
                assert.fileContent('variables.tf.json', '"LOCATION":');
                assert.fileContent('variables.tf.json', '"AKS_MANAGED_RESOURCE_GROUP":');
                assert.fileContent('variables.tf.json', '"HELM_RECREATE_PODS":');
                assert.fileContent('variables.tf.json', '"DOCKER_REPO_SERVER":');
                assert.fileContent('variables.tf.json', '"DOCKER_REPO_PASSWORD":');
                assert.fileContent('variables.tf.json', '"DOCKER_REPO_EMAIL":');
                assert.fileContent('variables.tf.json', '"DOCKER_SECRET_NAME":');
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
                assert.fileContent('variables.tf.json', '"DNS_ZONE_ENABLED":');
                assert.fileContent('variables.tf.json', '"DNS_ZONE_NAME":');
                assert.fileContent('variables.tf.json', '"DNS_ZONE_RESOURCE_GROUP":');
                assert.fileContent('variables.tf.json', '"DNS_ZONE_RECORD":');
                assert.fileContent('variables.tf.json', '"DNS_TTL":');                
            });

            it('Includes resource group info in the variables', () => {                
                assert.fileContent('terraform.tfvars.json', `"APP_NAME": "${prompts.name}"`);
                assert.fileContent('terraform.tfvars.json', `"CREATOR": "cloudcommons"`);
                assert.fileContent('terraform.tfvars.json', `"LOCATION": "${prompts.location}"`);
                assert.fileContent('terraform.tfvars.json', `"AKS_MANAGED_RESOURCE_GROUP": "${prompts.aksResourceGroup}"`);
                assert.noFileContent('terraform.tfvars.json', `"HELM_RECREATE_PODS":`);
                assert.noFileContent('terraform.tfvars.json', `"DOCKER_REPO_SERVER":`);
                assert.noFileContent('terraform.tfvars.json', `"DOCKER_REPO_USERNAME":`);
                assert.noFileContent('terraform.tfvars.json', `"DOCKER_REPO_PASSWORD":`);
                assert.noFileContent('terraform.tfvars.json', `"DOCKER_REPO_EMAIL":`);
                assert.noFileContent('terraform.tfvars.json', `"DOCKER_SECRET_NAME":`);
                assert.fileContent('terraform.tfvars.json', `"INGRESS_ENABLED": true`);
                assert.fileContent('terraform.tfvars.json', `"INGRESS_HOSTNAME": "${prompts.ingressHostname}"`);
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
                assert.fileContent('terraform.tfvars.json', `"DNS_ZONE_ENABLED": null`);
                assert.noFileContent('terraform.tfvars.json', `"DNS_ZONE_NAME":`);
                assert.noFileContent('terraform.tfvars.json', `"DNS_ZONE_RESOURCE_GROUP":"`);
                assert.noFileContent('terraform.tfvars.json', `"DNS_ZONE_RECORD":`);
                assert.noFileContent('terraform.tfvars.json', `"DNS_TTL":`);
            });

            it('Creates the right output values', () => {                
                assert.fileContent('output.tf.json', '"FQDN":');
                assert.fileContent('output.tf.json', 'local.fqdn');
                assert.fileContent('output.tf.json', '"LOAD_BALANCER_IP":');
                assert.fileContent('output.tf.json', 'local.ingress_load_balancer_ip');  
            });

            it('Adds azurerm provider', () => {
                assert.fileContent('providers.tf.json', '"provider":');
                assert.fileContent('providers.tf.json', '"azurerm":');
            });
        });
    });
});