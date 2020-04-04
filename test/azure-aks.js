var helpers = require('yeoman-test');
var path = require('path');
var assert = require('yeoman-assert');

describe("cloudcommons/cli:azure-aks", function () {
    describe('Creating new resource group', () => {
        describe('Creates an Azure Kubernetes Service with Helm 3 and without auto scaler', () => {
            var prompts = {
                name: 'cloudcommons',
                resourceGroup: 'azurerm_resource_group.workspace',
                location: 'westeurope',
                kubernetesVersion: '1.15.7',
                vmsize: 'Standard_DS3_v2',
                vms: 3,
                adminUser: 'cloudcommons-admin',
                sshKey: 'sskKey',
                clientId: 'cliendId',
                clientSecret: 'clientSecret',
                features: ["network-plugin", "network-policy", "rbac"],
                sizingKind: "development",
                sizingAccesibility: "public",
                networkPluginCidr: "172.0.0.0"
            };

            before(done => {
                helpers
                    .run(path.join(__dirname, '../generators/azure-aks'))
                    .withPrompts(prompts)
                    .once('end', done);
            });

            it('Generates AKS files', () => {
                assert.file('aks.tf');
                assert.file('terraform.tfvars.json');
                assert.file('variables.tf.json');
                assert.file('providers.tf.json');
                assert.file('output.tf.json');
                assert.noFile('aad-pod-id-rbac.tf');
            });

            it('Defines terraform variables', () => {
                assert.fileContent('variables.tf.json', '"CREATOR":');
                assert.fileContent('variables.tf.json', '"LOCATION":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_CLUSTER_NAME":');
                assert.fileContent('variables.tf.json', '"ADMIN_USER":');
                assert.fileContent('variables.tf.json', '"SSH_KEY":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_VERSION":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_AGENT_COUNT":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_VM_SIZE":');
                assert.fileContent('variables.tf.json', '"OS_DISK_SIZE_GB":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_CLIENT_ID":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_CLIENT_SECRET":');
                assert.fileContent('variables.tf.json', '"RBAC_ENABLED":');
                assert.noFileContent('variables.tf.json', '"AKS_RESOURCE_GROUP_NAME":');
            });

            it('Disables auto-scaler', () => {
                assert.fileContent('variables.tf.json', '"AUTO_SCALING_ENABLED":');
                assert.fileContent('variables.tf.json', `"default": false`);
                assert.fileContent('variables.tf.json', '"AUTO_SCALING_MIN_COUNT":');
                assert.fileContent('variables.tf.json', `"default": 0`);
                assert.fileContent('variables.tf.json', '"AUTO_SCALING_MAX_COUNT":');
                assert.fileContent('variables.tf.json', `"default": 0`);
            });

            it('Includes AKS in the variables', () => {
                assert.fileContent('terraform.tfvars.json', `"CREATOR": "cloudcommons"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_CLUSTER_NAME": "${prompts.name}"`);
                assert.fileContent('terraform.tfvars.json', `"LOCATION": "${prompts.location}"`);
                assert.fileContent('terraform.tfvars.json', `"ADMIN_USER": "${prompts.adminUser}"`);
                assert.fileContent('terraform.tfvars.json', `"SSH_KEY": "${prompts.sshKey}"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_VERSION": "${prompts.kubernetesVersion}"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_AGENT_COUNT": ${prompts.vms}`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_VM_SIZE": "${prompts.vmsize}"`);
                assert.fileContent('terraform.tfvars.json', `"OS_DISK_SIZE_GB": 60`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_CLIENT_ID": "${prompts.clientId}"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_CLIENT_SECRET": "${prompts.clientSecret}"`);
                assert.fileContent('terraform.tfvars.json', `"RBAC_ENABLED": true`);
                assert.noFileContent('terraform.tfvars.json', '"AKS_RESOURCE_GROUP_NAME":');
            });

            it('Creates the right output values', () => {
                var key = `module.${prompts.name}-kubernetes`;
                assert.fileContent('output.tf.json', '"AKS_KUBE_CONFIG":');
                assert.fileContent('output.tf.json', `${key}.kube_config_raw`);
                assert.fileContent('output.tf.json', '"AKS_KUBE_CONFIG_RAW":');
            });

            it('Adds azurerm provider', () => {
                assert.fileContent('providers.tf.json', '"provider":');
                assert.fileContent('providers.tf.json', '"azurerm":');
                assert.fileContent('providers.tf.json', '"helm":');
            });
        });

        describe('Creates an Azure Kubernetes Service with Helm 2', () => {
            var prompts = {
                name: 'cloudcommons',
                resourceGroup: 'azurerm_resource_group.workspace',
                location: 'westeurope',
                kubernetesVersion: '1.15.7',
                vmsize: 'Standard_DS3_v2',
                vms: 3,
                adminUser: 'cloudcommons-admin',
                sshKey: 'sskKey',
                clientId: 'cliendId',
                clientSecret: 'clientSecret',
                features: ["network-plugin", "network-policy", "rbac"],
                sizingKind: "development",
                sizingAccesibility: "public",
                networkPluginCidr: "172.0.0.0"                    
            };

            before(done => {
                helpers
                    .run(path.join(__dirname, '../generators/azure-aks'))
                    .withPrompts(prompts)
                    .withOptions({ helm2: true })
                    .once('end', done);
            });

            it('Generates AKS files', () => {
                assert.file('aks.tf');
                assert.file('tiller-cluster-role.tf');
                assert.file('tiller-role-binding.tf');
                assert.file('tiller-service-account.tf');                
                assert.file('terraform.tfvars.json');
                assert.file('variables.tf.json');
                assert.file('providers.tf.json');
                assert.file('output.tf.json');
                assert.noFile('aad-pod-id-rbac.tf');
            });

            it('Defines terraform variables', () => {
                assert.fileContent('variables.tf.json', '"CREATOR":');
                assert.fileContent('variables.tf.json', '"LOCATION":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_CLUSTER_NAME":');
                assert.fileContent('variables.tf.json', '"ADMIN_USER":');
                assert.fileContent('variables.tf.json', '"SSH_KEY":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_VERSION":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_AGENT_COUNT":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_VM_SIZE":');
                assert.fileContent('variables.tf.json', '"OS_DISK_SIZE_GB":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_CLIENT_ID":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_CLIENT_SECRET":');
                assert.fileContent('variables.tf.json', '"RBAC_ENABLED":');
                assert.noFileContent('variables.tf.json', '"AKS_RESOURCE_GROUP_NAME":');
            });

            it('Includes AKS in the variables', () => {
                assert.fileContent('terraform.tfvars.json', `"CREATOR": "cloudcommons"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_CLUSTER_NAME": "${prompts.name}"`);
                assert.fileContent('terraform.tfvars.json', `"LOCATION": "${prompts.location}"`);
                assert.fileContent('terraform.tfvars.json', `"ADMIN_USER": "${prompts.adminUser}"`);
                assert.fileContent('terraform.tfvars.json', `"SSH_KEY": "${prompts.sshKey}"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_VERSION": "${prompts.kubernetesVersion}"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_AGENT_COUNT": ${prompts.vms}`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_VM_SIZE": "${prompts.vmsize}"`);
                assert.fileContent('terraform.tfvars.json', `"OS_DISK_SIZE_GB": 60`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_CLIENT_ID": "${prompts.clientId}"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_CLIENT_SECRET": "${prompts.clientSecret}"`);
                assert.fileContent('terraform.tfvars.json', `"RBAC_ENABLED": true`);
                assert.noFileContent('terraform.tfvars.json', '"AKS_RESOURCE_GROUP_NAME":');
            });

            it('Creates the right output values', () => {
                var key = `module.${prompts.name}-kubernetes`;
                assert.fileContent('output.tf.json', '"AKS_KUBE_CONFIG":');
                assert.fileContent('output.tf.json', `${key}.kube_config_raw`);
                assert.fileContent('output.tf.json', '"AKS_KUBE_CONFIG_RAW":');
            });

            it('Adds azurerm provider', () => {
                assert.fileContent('providers.tf.json', '"provider":');
                assert.fileContent('providers.tf.json', '"azurerm":');
                assert.fileContent('providers.tf.json', '"helm":');
                assert.fileContent('providers.tf.json', '"~> 0.10.4"');
            });
        });

        describe('Creates an Azure Kubernetes Service with auto scaler', () => {
            var prompts = {
                name: 'cloudcommons',
                resourceGroup: 'azurerm_resource_group.workspace',
                location: 'westeurope',
                kubernetesVersion: '1.15.7',
                vmsize: 'Standard_DS3_v2',
                vms: 3,
                adminUser: 'cloudcommons-admin',
                sshKey: 'sskKey',
                clientId: 'cliendId',
                clientSecret: 'clientSecret',
                minNodeCount: 1,
                maxNodeCount: 10,
                sizingKind: "development",
                sizingAccesibility: "public",
                networkPluginCidr: "172.0.0.0",
                features: ["network-plugin", "auto-scaler"]
            };

            before(done => {
                helpers
                    .run(path.join(__dirname, '../generators/azure-aks'))
                    .withPrompts(prompts)
                    .once('end', done);
            });

            it('Generates AKS files', () => {
                assert.file('aks.tf');
                assert.file('terraform.tfvars.json');
                assert.file('variables.tf.json');
                assert.file('providers.tf.json');
                assert.file('output.tf.json');
                assert.noFile('aad-pod-id-rbac.tf');
            });

            it('Defines terraform variables', () => {
                assert.fileContent('variables.tf.json', '"CREATOR":');
                assert.fileContent('variables.tf.json', '"LOCATION":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_CLUSTER_NAME":');
                assert.fileContent('variables.tf.json', '"ADMIN_USER":');
                assert.fileContent('variables.tf.json', '"SSH_KEY":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_VERSION":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_AGENT_COUNT":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_VM_SIZE":');
                assert.fileContent('variables.tf.json', '"OS_DISK_SIZE_GB":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_CLIENT_ID":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_CLIENT_SECRET":');
                assert.fileContent('variables.tf.json', '"RBAC_ENABLED":');
                assert.noFileContent('variables.tf.json', '"AKS_RESOURCE_GROUP_NAME":');
            });

            it('Disables auto-scaler', () => {
                assert.fileContent('variables.tf.json', '"AUTO_SCALING_ENABLED":');
                assert.fileContent('variables.tf.json', `"default": true`);
                assert.fileContent('variables.tf.json', '"AUTO_SCALING_MIN_COUNT":');
                assert.fileContent('variables.tf.json', `"default": ${prompts.minNodeCount}`);
                assert.fileContent('variables.tf.json', '"AUTO_SCALING_MAX_COUNT":');
                assert.fileContent('variables.tf.json', `"default": ${prompts.maxNodeCount}`);
            });

            it('Includes AKS in the variables', () => {
                assert.fileContent('terraform.tfvars.json', `"CREATOR": "cloudcommons"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_CLUSTER_NAME": "${prompts.name}"`);
                assert.fileContent('terraform.tfvars.json', `"LOCATION": "${prompts.location}"`);
                assert.fileContent('terraform.tfvars.json', `"ADMIN_USER": "${prompts.adminUser}"`);
                assert.fileContent('terraform.tfvars.json', `"SSH_KEY": "${prompts.sshKey}"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_VERSION": "${prompts.kubernetesVersion}"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_AGENT_COUNT": ${prompts.vms}`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_VM_SIZE": "${prompts.vmsize}"`);
                assert.fileContent('terraform.tfvars.json', `"OS_DISK_SIZE_GB": 60`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_CLIENT_ID": "${prompts.clientId}"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_CLIENT_SECRET": "${prompts.clientSecret}"`);
                assert.fileContent('terraform.tfvars.json', `"RBAC_ENABLED": false`);
                assert.noFileContent('terraform.tfvars.json', '"AKS_RESOURCE_GROUP_NAME":');
            });

            it('Creates the right output values', () => {
                var key = `module.${prompts.name}-kubernetes`;
                assert.fileContent('output.tf.json', '"AKS_KUBE_CONFIG":');
                assert.fileContent('output.tf.json', `${key}.kube_config_raw`);
                assert.fileContent('output.tf.json', '"AKS_KUBE_CONFIG_RAW":');
            });

            it('Adds azurerm provider', () => {
                assert.fileContent('providers.tf.json', '"provider":');
                assert.fileContent('providers.tf.json', '"azurerm":');
                assert.fileContent('providers.tf.json', '"helm":');
            });
        });        

        describe('Creates an Azure Kubernetes Service with RBAC and AzureAD Pod Identity', () => {
            var prompts = {
                name: 'cloudcommons',
                resourceGroup: 'azurerm_resource_group.workspace',
                location: 'westeurope',
                kubernetesVersion: '1.15.7',
                vmsize: 'Standard_DS3_v2',
                vms: 3,
                adminUser: 'cloudcommons-admin',
                sshKey: 'sskKey',
                clientId: 'cliendId',
                clientSecret: 'clientSecret',
                features: ["network-plugin", "network-policy", "rbac", "aad-pod-id"]
            };

            before(done => {
                helpers
                    .run(path.join(__dirname, '../generators/azure-aks'))
                    .withPrompts(prompts)
                    .once('end', done);
            });

            it('Generates AKS files', () => {
                assert.file('aks.tf');
                assert.file('terraform.tfvars.json');
                assert.file('variables.tf.json');
                assert.file('providers.tf.json');
                assert.file('output.tf.json');
                assert.file('aad-pod-id-rbac.tf');
            });

            it('Defines terraform variables', () => {
                assert.fileContent('variables.tf.json', '"CREATOR":');
                assert.fileContent('variables.tf.json', '"LOCATION":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_CLUSTER_NAME":');
                assert.fileContent('variables.tf.json', '"ADMIN_USER":');
                assert.fileContent('variables.tf.json', '"SSH_KEY":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_VERSION":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_AGENT_COUNT":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_VM_SIZE":');
                assert.fileContent('variables.tf.json', '"OS_DISK_SIZE_GB":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_CLIENT_ID":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_CLIENT_SECRET":');
                assert.fileContent('variables.tf.json', '"RBAC_ENABLED":');
                assert.noFileContent('variables.tf.json', '"AKS_RESOURCE_GROUP_NAME":');
            });

            it('Disables auto-scaler', () => {
                assert.fileContent('variables.tf.json', '"AUTO_SCALING_ENABLED":');
                assert.fileContent('variables.tf.json', `"default": false`);
                assert.fileContent('variables.tf.json', '"AUTO_SCALING_MIN_COUNT":');
                assert.fileContent('variables.tf.json', `"default": 0`);
                assert.fileContent('variables.tf.json', '"AUTO_SCALING_MAX_COUNT":');
                assert.fileContent('variables.tf.json', `"default": 0`);
            });

            it('Includes AKS in the variables', () => {
                assert.fileContent('terraform.tfvars.json', `"CREATOR": "cloudcommons"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_CLUSTER_NAME": "${prompts.name}"`);
                assert.fileContent('terraform.tfvars.json', `"LOCATION": "${prompts.location}"`);
                assert.fileContent('terraform.tfvars.json', `"ADMIN_USER": "${prompts.adminUser}"`);
                assert.fileContent('terraform.tfvars.json', `"SSH_KEY": "${prompts.sshKey}"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_VERSION": "${prompts.kubernetesVersion}"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_AGENT_COUNT": ${prompts.vms}`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_VM_SIZE": "${prompts.vmsize}"`);
                assert.fileContent('terraform.tfvars.json', `"OS_DISK_SIZE_GB": 60`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_CLIENT_ID": "${prompts.clientId}"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_CLIENT_SECRET": "${prompts.clientSecret}"`);
                assert.fileContent('terraform.tfvars.json', `"RBAC_ENABLED": true`);
                assert.noFileContent('terraform.tfvars.json', '"AKS_RESOURCE_GROUP_NAME":');
            });

            it('Creates the right output values', () => {
                var key = `module.${prompts.name}-kubernetes`;
                assert.fileContent('output.tf.json', '"AKS_KUBE_CONFIG":');
                assert.fileContent('output.tf.json', `${key}.kube_config_raw`);
                assert.fileContent('output.tf.json', '"AKS_KUBE_CONFIG_RAW":');
            });

            it('Adds azurerm provider', () => {
                assert.fileContent('providers.tf.json', '"provider":');
                assert.fileContent('providers.tf.json', '"azurerm":');
                assert.fileContent('providers.tf.json', '"helm":');
            });
        });        
    });
    describe('Using existing resource group', () => {
        describe('Creates an Azure Kubernetes Server with Helm 3', () => {
            var prompts = {
                name: 'cloudcommons',
                resourceGroup: 'workspace',
                location: 'westeurope',
                kubernetesVersion: '1.15.7',
                vmsize: 'Standard_DS3_v2',
                vms: 3,
                adminUser: 'cloudcommons-admin',
                sshKey: 'sskKey',
                clientId: 'cliendId',
                clientSecret: 'clientSecret',
                features: ["network-plugin", "network-policy", "rbac"],
                sizingKind: "development",
                sizingAccesibility: "public",
                networkPluginCidr: "172.0.0.0"                
            };

            before(done => {
                helpers
                    .run(path.join(__dirname, '../generators/azure-aks'))
                    .withPrompts(prompts)
                    .once('end', done);
            });

            it('Generates AKS files', () => {
                assert.file('aks.tf');
                assert.file('terraform.tfvars.json');
                assert.file('variables.tf.json');
                assert.file('providers.tf.json');
                assert.file('output.tf.json');
                assert.noFile('aad-pod-id-rbac.tf');
            });

            it('Defines terraform variables', () => {
                assert.fileContent('variables.tf.json', '"CREATOR":');
                assert.fileContent('variables.tf.json', '"LOCATION":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_CLUSTER_NAME":');
                assert.fileContent('variables.tf.json', '"ADMIN_USER":');
                assert.fileContent('variables.tf.json', '"SSH_KEY":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_VERSION":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_AGENT_COUNT":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_VM_SIZE":');
                assert.fileContent('variables.tf.json', '"OS_DISK_SIZE_GB":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_CLIENT_ID":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_CLIENT_SECRET":');
                assert.fileContent('variables.tf.json', '"RBAC_ENABLED":');
                assert.fileContent('variables.tf.json', '"AKS_RESOURCE_GROUP_NAME":');
            });

            it('Includes AKS in the variables', () => {
                assert.fileContent('terraform.tfvars.json', `"CREATOR": "cloudcommons"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_CLUSTER_NAME": "${prompts.name}"`);
                assert.fileContent('terraform.tfvars.json', `"LOCATION": "${prompts.location}"`);
                assert.fileContent('terraform.tfvars.json', `"ADMIN_USER": "${prompts.adminUser}"`);
                assert.fileContent('terraform.tfvars.json', `"SSH_KEY": "${prompts.sshKey}"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_VERSION": "${prompts.kubernetesVersion}"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_AGENT_COUNT": ${prompts.vms}`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_VM_SIZE": "${prompts.vmsize}"`);
                assert.fileContent('terraform.tfvars.json', `"OS_DISK_SIZE_GB": 60`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_CLIENT_ID": "${prompts.clientId}"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_CLIENT_SECRET": "${prompts.clientSecret}"`);
                assert.fileContent('terraform.tfvars.json', `"RBAC_ENABLED": true`);
                assert.fileContent('terraform.tfvars.json', `"AKS_RESOURCE_GROUP_NAME": "${prompts.resourceGroup}"`);
            });

            it('Creates the right output values', () => {
                var key = `module.${prompts.name}-kubernetes`;
                assert.fileContent('output.tf.json', '"AKS_KUBE_CONFIG":');
                assert.fileContent('output.tf.json', `${key}.kube_config_raw`);
                assert.fileContent('output.tf.json', '"AKS_KUBE_CONFIG_RAW":');
                assert.fileContent('output.tf.json', `${key}.kube_config_raw`);
            });

            it('Adds azurerm provider', () => {
                assert.fileContent('providers.tf.json', '"provider":');
                assert.fileContent('providers.tf.json', '"azurerm":');
                assert.fileContent('providers.tf.json', '"helm":');
            });
        });

        describe('Creates an Azure Kubernetes Server with Helm 2', () => {
            var prompts = {
                name: 'cloudcommons',
                resourceGroup: 'workspace',
                location: 'westeurope',
                kubernetesVersion: '1.15.7',
                vmsize: 'Standard_DS3_v2',
                vms: 3,
                adminUser: 'cloudcommons-admin',
                sshKey: 'sskKey',
                clientId: 'cliendId',
                clientSecret: 'clientSecret',
                features: ["network-plugin", "network-policy", "rbac"],
                sizingKind: "development",
                sizingAccesibility: "public",
                networkPluginCidr: "172.0.0.0"                
            };

            before(done => {
                helpers
                    .run(path.join(__dirname, '../generators/azure-aks'))
                    .withPrompts(prompts)
                    .withOptions({ helm2: true })
                    .once('end', done);
            });

            it('Generates AKS files', () => {
                assert.file('aks.tf');
                assert.file('tiller-cluster-role.tf');
                assert.file('tiller-role-binding.tf');
                assert.file('tiller-service-account.tf');
                assert.file('terraform.tfvars.json');
                assert.file('variables.tf.json');
                assert.file('providers.tf.json');
                assert.file('output.tf.json');
                assert.noFile('aad-pod-id-rbac.tf');
            });

            it('Defines terraform variables', () => {
                assert.fileContent('variables.tf.json', '"CREATOR":');
                assert.fileContent('variables.tf.json', '"LOCATION":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_CLUSTER_NAME":');
                assert.fileContent('variables.tf.json', '"ADMIN_USER":');
                assert.fileContent('variables.tf.json', '"SSH_KEY":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_VERSION":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_AGENT_COUNT":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_VM_SIZE":');
                assert.fileContent('variables.tf.json', '"OS_DISK_SIZE_GB":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_CLIENT_ID":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_CLIENT_SECRET":');
                assert.fileContent('variables.tf.json', '"RBAC_ENABLED":');
                assert.fileContent('variables.tf.json', '"AKS_RESOURCE_GROUP_NAME":');
            });

            it('Includes AKS in the variables', () => {
                assert.fileContent('terraform.tfvars.json', `"CREATOR": "cloudcommons"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_CLUSTER_NAME": "${prompts.name}"`);
                assert.fileContent('terraform.tfvars.json', `"LOCATION": "${prompts.location}"`);
                assert.fileContent('terraform.tfvars.json', `"ADMIN_USER": "${prompts.adminUser}"`);
                assert.fileContent('terraform.tfvars.json', `"SSH_KEY": "${prompts.sshKey}"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_VERSION": "${prompts.kubernetesVersion}"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_AGENT_COUNT": ${prompts.vms}`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_VM_SIZE": "${prompts.vmsize}"`);
                assert.fileContent('terraform.tfvars.json', `"OS_DISK_SIZE_GB": 60`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_CLIENT_ID": "${prompts.clientId}"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_CLIENT_SECRET": "${prompts.clientSecret}"`);
                assert.fileContent('terraform.tfvars.json', `"RBAC_ENABLED": true`);
                assert.fileContent('terraform.tfvars.json', `"AKS_RESOURCE_GROUP_NAME": "${prompts.resourceGroup}"`);
            });

            it('Creates the right output values', () => {
                var key = `module.${prompts.name}-kubernetes`;
                assert.fileContent('output.tf.json', '"AKS_KUBE_CONFIG":');
                assert.fileContent('output.tf.json', `${key}.kube_config_raw`);
                assert.fileContent('output.tf.json', '"AKS_KUBE_CONFIG_RAW":');
                assert.fileContent('output.tf.json', `${key}.kube_config_raw`);
            });

            it('Adds azurerm provider', () => {
                assert.fileContent('providers.tf.json', '"provider":');
                assert.fileContent('providers.tf.json', '"azurerm":');
                assert.fileContent('providers.tf.json', '"helm":');
                assert.fileContent('providers.tf.json', '"~> 0.10.4"');
            });
        });

        describe('Creates an Azure Kubernetes Service with auto scaler', () => {
            var prompts = {
                name: 'cloudcommons',
                resourceGroup: 'workspace',
                location: 'westeurope',
                kubernetesVersion: '1.15.7',
                vmsize: 'Standard_DS3_v2',
                vms: 3,
                adminUser: 'cloudcommons-admin',
                sshKey: 'sskKey',
                clientId: 'cliendId',
                clientSecret: 'clientSecret',
                minNodeCount: 1,
                maxNodeCount: 10,
                sizingKind: "development",
                sizingAccesibility: "public",
                networkPluginCidr: "172.0.0.0",
                features: ["network-plugin", "auto-scaler"],
                sizingKind: "development",
                sizingAccesibility: "public",
                networkPluginCidr: "172.0.0.0"                
            };

            before(done => {
                helpers
                    .run(path.join(__dirname, '../generators/azure-aks'))
                    .withPrompts(prompts)
                    .once('end', done);
            });

            it('Generates AKS files', () => {
                assert.file('aks.tf');
                assert.file('terraform.tfvars.json');
                assert.file('variables.tf.json');
                assert.file('providers.tf.json');
                assert.file('output.tf.json');
                assert.noFile('aad-pod-id-rbac.tf');
            });

            it('Defines terraform variables', () => {
                assert.fileContent('variables.tf.json', '"CREATOR":');
                assert.fileContent('variables.tf.json', '"LOCATION":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_CLUSTER_NAME":');
                assert.fileContent('variables.tf.json', '"ADMIN_USER":');
                assert.fileContent('variables.tf.json', '"SSH_KEY":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_VERSION":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_AGENT_COUNT":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_VM_SIZE":');
                assert.fileContent('variables.tf.json', '"OS_DISK_SIZE_GB":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_CLIENT_ID":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_CLIENT_SECRET":');
                assert.fileContent('variables.tf.json', '"RBAC_ENABLED":');
                assert.fileContent('variables.tf.json', '"AKS_RESOURCE_GROUP_NAME":');
            });

            it('Disables auto-scaler', () => {
                assert.fileContent('variables.tf.json', '"AUTO_SCALING_ENABLED":');
                assert.fileContent('variables.tf.json', `"default": true`);
                assert.fileContent('variables.tf.json', '"AUTO_SCALING_MIN_COUNT":');
                assert.fileContent('variables.tf.json', `"default": ${prompts.minNodeCount}`);
                assert.fileContent('variables.tf.json', '"AUTO_SCALING_MAX_COUNT":');
                assert.fileContent('variables.tf.json', `"default": ${prompts.maxNodeCount}`);
            });

            it('Includes AKS in the variables', () => {
                assert.fileContent('terraform.tfvars.json', `"CREATOR": "cloudcommons"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_CLUSTER_NAME": "${prompts.name}"`);
                assert.fileContent('terraform.tfvars.json', `"LOCATION": "${prompts.location}"`);
                assert.fileContent('terraform.tfvars.json', `"ADMIN_USER": "${prompts.adminUser}"`);
                assert.fileContent('terraform.tfvars.json', `"SSH_KEY": "${prompts.sshKey}"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_VERSION": "${prompts.kubernetesVersion}"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_AGENT_COUNT": ${prompts.vms}`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_VM_SIZE": "${prompts.vmsize}"`);
                assert.fileContent('terraform.tfvars.json', `"OS_DISK_SIZE_GB": 60`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_CLIENT_ID": "${prompts.clientId}"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_CLIENT_SECRET": "${prompts.clientSecret}"`);
                assert.fileContent('terraform.tfvars.json', `"RBAC_ENABLED": false`);
                assert.fileContent('terraform.tfvars.json', `"AKS_RESOURCE_GROUP_NAME": "${prompts.resourceGroup}"`);
            });

            it('Creates the right output values', () => {
                var key = `module.${prompts.name}-kubernetes`;
                assert.fileContent('output.tf.json', '"AKS_KUBE_CONFIG":');
                assert.fileContent('output.tf.json', `${key}.kube_config_raw`);
                assert.fileContent('output.tf.json', '"AKS_KUBE_CONFIG_RAW":');
            });

            it('Adds azurerm provider', () => {
                assert.fileContent('providers.tf.json', '"provider":');
                assert.fileContent('providers.tf.json', '"azurerm":');
                assert.fileContent('providers.tf.json', '"helm":');
            });
        });  
        

        describe('Creates an Azure Kubernetes Service with RBAC and AzureAD Pod Identity', () => {
            var prompts = {
                name: 'cloudcommons',
                resourceGroup: 'workspace',
                location: 'westeurope',
                kubernetesVersion: '1.15.7',
                vmsize: 'Standard_DS3_v2',
                vms: 3,
                adminUser: 'cloudcommons-admin',
                sshKey: 'sskKey',
                clientId: 'cliendId',
                clientSecret: 'clientSecret',
                features: ["network-plugin", "network-policy", "rbac", "aad-pod-id"],
                sizingKind: "development",
                sizingAccesibility: "public",
                networkPluginCidr: "172.0.0.0"                
            };

            before(done => {
                helpers
                    .run(path.join(__dirname, '../generators/azure-aks'))
                    .withPrompts(prompts)
                    .once('end', done);
            });

            it('Generates AKS files', () => {
                assert.file('aks.tf');
                assert.file('terraform.tfvars.json');
                assert.file('variables.tf.json');
                assert.file('providers.tf.json');
                assert.file('output.tf.json');
                assert.file('aad-pod-id-rbac.tf');
            });

            it('Defines terraform variables', () => {
                assert.fileContent('variables.tf.json', '"CREATOR":');
                assert.fileContent('variables.tf.json', '"LOCATION":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_CLUSTER_NAME":');
                assert.fileContent('variables.tf.json', '"ADMIN_USER":');
                assert.fileContent('variables.tf.json', '"SSH_KEY":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_VERSION":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_AGENT_COUNT":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_VM_SIZE":');
                assert.fileContent('variables.tf.json', '"OS_DISK_SIZE_GB":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_CLIENT_ID":');
                assert.fileContent('variables.tf.json', '"KUBERNETES_CLIENT_SECRET":');
                assert.fileContent('variables.tf.json', '"RBAC_ENABLED":');
                assert.fileContent('variables.tf.json', '"AKS_RESOURCE_GROUP_NAME":');
            });

            it('Includes AKS in the variables', () => {
                assert.fileContent('terraform.tfvars.json', `"CREATOR": "cloudcommons"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_CLUSTER_NAME": "${prompts.name}"`);
                assert.fileContent('terraform.tfvars.json', `"LOCATION": "${prompts.location}"`);
                assert.fileContent('terraform.tfvars.json', `"ADMIN_USER": "${prompts.adminUser}"`);
                assert.fileContent('terraform.tfvars.json', `"SSH_KEY": "${prompts.sshKey}"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_VERSION": "${prompts.kubernetesVersion}"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_AGENT_COUNT": ${prompts.vms}`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_VM_SIZE": "${prompts.vmsize}"`);
                assert.fileContent('terraform.tfvars.json', `"OS_DISK_SIZE_GB": 60`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_CLIENT_ID": "${prompts.clientId}"`);
                assert.fileContent('terraform.tfvars.json', `"KUBERNETES_CLIENT_SECRET": "${prompts.clientSecret}"`);
                assert.fileContent('terraform.tfvars.json', `"RBAC_ENABLED": true`);
                assert.fileContent('terraform.tfvars.json', `"AKS_RESOURCE_GROUP_NAME": "${prompts.resourceGroup}"`);
            });

            it('Creates the right output values', () => {
                var key = `module.${prompts.name}-kubernetes`;
                assert.fileContent('output.tf.json', '"AKS_KUBE_CONFIG":');
                assert.fileContent('output.tf.json', `${key}.kube_config_raw`);
                assert.fileContent('output.tf.json', '"AKS_KUBE_CONFIG_RAW":');
                assert.fileContent('output.tf.json', `${key}.kube_config_raw`);
            });

            it('Adds azurerm provider', () => {
                assert.fileContent('providers.tf.json', '"provider":');
                assert.fileContent('providers.tf.json', '"azurerm":');
                assert.fileContent('providers.tf.json', '"helm":');
            });
        });        
    });
});