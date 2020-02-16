var helpers = require('yeoman-test');
var path = require('path');
var assert = require('yeoman-assert');

describe("cloudcommons/cli:azure-aks-ingress", function () {
    describe('Creates a public NGINX ingress in West Europe', () => {
        var prompts = {
            name: 'cloudcommons',
            ingressNamespace: 'cloudcommons-ns',
            dns: 'myapp.local',
            ingressChartAndVersion: 'stable/nginx-ingress:1.5.0',
            ingressType: 'publicLoadBalancer',
            aksResourceGroup: 'myAksResourceGroup',
            aksManagedResourceGroup: 'myAksManagedResourceGroup',
            ipLocation: 'westeurope'
        };
        before(done => {
            helpers
                .run(path.join(__dirname, '../generators/azure-aks-ingress'))
                .withPrompts(prompts)
                .once('end', done);
        });

        it('Generates ingress files files', () => {
            assert.file(`${prompts.name}-nginx-ingress.tf`);
            assert.file(`${prompts.name}-ingress-ip.tf`);
            assert.file(`templates/${prompts.name}-ingress.yml`);
            assert.file('terraform.tfvars.json');
            assert.file('variables.tf.json');
            assert.file('providers.tf.json');
            assert.file('output.tf.json');
        });

        it('Defines terraform variables', () => {
            assert.fileContent('variables.tf.json', '"INGRESS_ENABLED":');
            assert.fileContent('variables.tf.json', '"INGRESS_HOSTNAME":');
            assert.fileContent('variables.tf.json', '"INGRESS_CHART":');
            assert.fileContent('variables.tf.json', '"INGRESS_CHART_VERSION":');
            assert.fileContent('variables.tf.json', '"INGRESS_SERVICE_SUBNET":');
            assert.fileContent('variables.tf.json', '"INGRESS_IP":');
            assert.fileContent('variables.tf.json', '"INGRESS_REPLICAS":');
            assert.fileContent('variables.tf.json', '"IP_VERSION":');
            assert.fileContent('variables.tf.json', '"IP_LOCATION":');
            assert.fileContent('variables.tf.json', '"IP_ALLOCATION_METHOD":');
            assert.fileContent('variables.tf.json', '"IP_RESOURCE_GROUP_NAME":');
            assert.fileContent('variables.tf.json', '"INGRESS_RECREATE_PODS":');
        });

        it('Includes ingress info in the variables', () => {
            assert.fileContent('terraform.tfvars.json', `"INGRESS_HOSTNAME": "${prompts.dns}"`);
            assert.fileContent('terraform.tfvars.json', `"INGRESS_CHART": "stable/nginx-ingress"`);
            assert.fileContent('terraform.tfvars.json', `"INGRESS_CHART_VERSION": "1.5.0"`);
            assert.fileContent('terraform.tfvars.json', `"INGRESS_REPLICAS": 2`);
            assert.fileContent('terraform.tfvars.json', `"IP_RESOURCE_GROUP_NAME": "myAksResourceGroup"`);
            assert.fileContent('terraform.tfvars.json', `"IP_LOCATION": "${prompts.ipLocation}"`);
            assert.fileContent('terraform.tfvars.json', `"IP_VERSION": "IPv4"`);
            assert.fileContent('terraform.tfvars.json', `"IP_ALLOCATION_METHOD": "Static"`);
        });

        it('Creates the right output values', () => {
            assert.fileContent('output.tf.json', '"LOAD_BALANCER_IP":');
            assert.fileContent('output.tf.json', 'local.ingress_load_balancer_ip');
            assert.fileContent('output.tf.json', '"IP_ID":');
            assert.fileContent('output.tf.json', `azurerm_public_ip.${prompts.name}-ingress.id`)
            assert.fileContent('output.tf.json', '"IP_ADDRESS":');
            assert.fileContent('output.tf.json', `azurerm_public_ip.${prompts.name}-ingress.ip_address`);
        });

        it('Adds azurerm provider', () => {
            assert.fileContent('providers.tf.json', '"provider":');
            assert.fileContent('providers.tf.json', '"azurerm":');
        });
    });
});