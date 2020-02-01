var terraform = require('../../../common/terraform');

module.exports = {
    copy: function (fs, answers, configFile = 'terraform.tfvars.json') {

        var config = {
            CREATOR: "cloudcommons",
            KUBERNETES_CLUSTER_NAME: answers.name,
            LOCATION: answers.location,
            ADMIN_USER: answers.adminUser,
            SSH_KEY: answers.sshKey,
            KUBERNETES_VERSION: answers.kubernetesVersion,
            KUBERNETES_AGENT_COUNT: answers.vms,
            KUBERNETES_VM_SIZE: answers.vmsize,
            OS_DISK_SIZE_GB: 60,
            KUBERNETES_CLIENT_ID: answers.clientId,
            KUBERNETES_CLIENT_SECRET: answers.clientSecret,
            RBAC_ENABLED: answers.rbacEnabled
        };

        if (!terraform.isDependency(answers.resourceGroup)) {
            config.AKS_RESOURCE_GROUP_NAME = answers.resourceGroup;
        }

        terraform.writeConfig(fs, config, configFile);
    }
}