module.exports = {
    copy: function (terraform, answers, configFile = 'terraform.tfvars.json') {

        var config = {
            CREATOR: "cloudcommons",
            KUBERNETES_CLUSTER_NAME: answers.name,
            AKS_RESOURCE_GROUP_NAME: terraform.resolveConfigDependency(answers.resourceGroup),
            LOCATION: answers.location,
            ADMIN_USER: answers.adminUser,
            SSH_KEY: answers.sshKey,
            KUBERNETES_VERSION: answers.kubernetesVersion,
            KUBERNETES_AGENT_COUNT: answers.vms,
            KUBERNETES_VM_SIZE: answers.vmsize,
            KUBE_DASHBOARD_ENABLED: answers.kubeDashboardEnabled,
            OS_DISK_SIZE_GB: 60,
            KUBERNETES_CLIENT_ID: answers.clientId,
            KUBERNETES_CLIENT_SECRET: answers.clientSecret,
            RBAC_ENABLED: answers.rbacEnabled,
            VNET_ADDRESS_SPACE: answers.networkConfig.vnetCidr,
            VNET_CLUSTER_CIDR: answers.networkConfig.clusterSubnet,
            VNET_SERVICE_CIDR: answers.networkConfig.serviceSubnet,
            VNET_INGRESS_CIDR: answers.networkConfig.ingressSubnet ? answers.networkConfig.ingressSubnet : undefined
        };

        terraform.writeConfig(config, configFile);
    }
}