var terraform = require('../../../common/terraform');

module.exports = {
    copy: function (fs, answers, configFile = 'terraform.tfvars.json') {

        var config = {
            APP: answers.name,
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
            ACR_ENABLED: answers.acrEnabled,
            ACR_SKU: answers.acrSku,
            RBAC_ENABLED: answers.rbacEnabled
        }

        terraform.writeConfig(fs, config, configFile);
    }
}

// APP                     = "<%= name %>"
// CREATOR                 = "cloudcommons"
// KUBERNETES_CLUSTER_NAME = "<%= name %>"
// LOCATION                = "<%= location %>"
// ADMIN_USER              = "<%= adminUser %>"
// SSH_KEY                 = "<%= sshKey %>"
// KUBERNETES_VERSION      = "<%= kubernetesVersion %>"
// KUBERNETES_AGENT_COUNT  = <%= vms %>
// KUBERNETES_VM_SIZE      = "<%= vmsize %>"
// OS_DISK_SIZE_GB         = 60
// KUBERNETES_CLIENT_ID    = "<%= clientId %>"
// KUBERNETES_CLIENT_SECRET= "<%= clientSecret %>"
// ACR_ENABLED             = <%= acrEnabled %>
// ACR_SKU                 = "<%= acrSku %>"
// RBAC_ENABLED            = <%= rbacEnabled %>