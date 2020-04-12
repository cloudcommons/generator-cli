const assert = require('yeoman-assert');
const genSpec = require('../helpers/geneteratorSpecificationHelper');

describe('cloudcommons/cli:azure-aks', function () {
    describe('Terraform plan validations', function () {
        describe('Creates an AKS with Application Insights with log analytics', function () {
            var spec = {
                config: {
                    terraform: {
                        init: true,
                        plan: true
                    }
                },
                generators: {
                    'terraform': {
                        prompts: {
                            app: 'cloudcommons',
                            version: '0.12.20',
                            backendType: 'local'
                        }
                    },
                    'azure-resource-group': {
                        prompts: {
                            name: 'cloudcommons',
                            location: 'uksouth'
                        }
                    },
                    'azure-aks': {
                        prompts: {
                            name: 'mycluster',
                            resourceGroup: 'azurerm_resource_group.cloudcommons',
                            location: 'uksouth',
                            kubernetesVersion: '1.15.7',
                            sizingKind: 'development',
                            sizingAccesibility: 'public',
                            vmsize: 'Standard_DS2_v2',
                            vms: '1',
                            vmsMax: '4',
                            podsPerNode: '60',
                            adminUser: 'cloudcommons',
                            sshKey: 'mysshkey',
                            clientId: 'myclientid',
                            clientSecret: 'myclientsecret',
                            features: ['network-plugin', 'network-policy', 'rbac'],
                            networkPluginCidr: '172.0.0.0'
                        }
                    },
                    'azure-log-analytics': {
                        prompts: {
                            name: 'cloudcommons-log',
                            resourceGroup: 'azurerm_resource_group.cloudcommons',
                            location: 'uksouth',
                            retention: 30
                        }
                    }
                }
            };

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
                plan.variables('ADMIN_USER').is(spec.generators['azure-aks'].prompts.adminUser);
                plan.variables('APP').is(spec.generators['terraform'].prompts.app);
                plan.variables('AUTO_SCALING_ENABLED').is(false);
                plan.variables('AUTO_SCALING_MAX_COUNT').is(0);
                plan.variables('AUTO_SCALING_MIN_COUNT').is(0);
                plan.variables('CREATOR').is('cloudcommons');
                plan.variables('ENVIRONMENT').is('default');
                plan.variables('KUBERNETES_AGENT_COUNT').is(spec.generators['azure-aks'].prompts.vms);
                plan.variables('KUBERNETES_CLIENT_ID').is(spec.generators['azure-aks'].prompts.clientId);
                plan.variables('KUBERNETES_CLIENT_SECRET').is(spec.generators['azure-aks'].prompts.clientSecret);
                plan.variables('KUBERNETES_CLUSTER_NAME').is(spec.generators['azure-aks'].prompts.name);
                plan.variables('KUBERNETES_VERSION').is(spec.generators['azure-aks'].prompts.kubernetesVersion);
                plan.variables('KUBERNETES_VM_SIZE').is(spec.generators['azure-aks'].prompts.vmsize);
                plan.variables('KUBE_DASHBOARD_ENABLED').is(false);
                plan.variables('LOCATION').is(spec.generators['azure-resource-group'].prompts.location);
                plan.variables('LOG_ANALYTICS_RETENTION_DAYS').is(spec.generators['azure-log-analytics'].prompts.retention);
                plan.variables('OS_DISK_SIZE_GB').is(60);
                plan.variables('RBAC_ENABLED').is(spec.generators['azure-aks'].prompts.features.includes('rbac'));
                plan.variables('RESOURCE_GROUP_NAME').is(spec.generators['azure-resource-group'].prompts.name);
                plan.variables('SSH_KEY').is(spec.generators['azure-aks'].prompts.sshKey);
                plan.variables('VNET_ADDRESS_SPACE').is(`${spec.generators['azure-aks'].prompts.networkPluginCidr}/22`);
                plan.variables('VNET_CLUSTER_CIDR').is('172.0.0.0/23');
                plan.variables('VNET_SERVICE_CIDR').is('172.0.2.0/23');
            });

            it('Plans the right output variables', () => {
                plan.planned_values.outputs("AKS_KUBE_CONFIG").isSensitive();
                plan.planned_values.outputs("AKS_KUBE_CONFIG_RAW").isSensitive();
                plan.planned_values.outputs("LOG_ANALYTICS_ID").isNotSensitive();
                plan.planned_values.outputs("LOG_ANALYTICS_PORTAL_URL").isNotSensitive();
                plan.planned_values.outputs("LOG_ANALYTICS_PRIMARY_SHARED_KEY").isSensitive();
                plan.planned_values.outputs("LOG_ANALYTICS_SECONDARY_SHARED_KEY").isSensitive();
                plan.planned_values.outputs("LOG_ANALYTICS_WORKSPACE_ID").isNotSensitive();
                plan.planned_values.outputs("RESOURCE_GROUP_ID").isNotSensitive();
            });

            it(`Plans the creation of the resource group`, () => {
                var prompts = spec.generators['azure-resource-group'].prompts;
                var resourceGroup = plan.planned_values.root_module.resources(`azurerm_resource_group.${prompts.name}`);
                resourceGroup.mode().is("managed")
                    .type().is("azurerm_resource_group")
                    .name().is(prompts.name)
                    .providerName().is("azurerm")
                    .value("location").is(prompts.location);
            });

            it(`Plans the creation of an AKS cluster`, () => {
                var prompts = spec.generators['azure-aks'].prompts;
                var aks = plan.planned_values.root_module
                    .child_modules(`module.${prompts.name}-kubernetes`)
                    .resources(`module.${prompts.name}-kubernetes.azurerm_kubernetes_cluster.cloudcommons`);
                aks.name().is('cloudcommons')
                   .type().is('azurerm_kubernetes_cluster')
                   .mode().is('managed')
                   .providerName().is('azurerm');
                
                var nodePool = aks.value('default_node_pool').get()[0];
                assert.equal(nodePool.vm_size, prompts.vmsize);
                assert.equal(nodePool.os_disk_size_gb, 60);
                assert.equal(nodePool.max_pods, prompts.podsPerNode);                
            });
        });
    });
});
