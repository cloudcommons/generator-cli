module.exports = {
    copy: function (terraform, answers) {
        var variables = {
            "variable": {
                CREATOR: {
                    type: "string",
                    description: "(Required) Creator of this deployment"
                },
                LOCATION: {
                    type: "string",
                    description: "(Required) Azure region to perform the deployment"
                },
                KUBERNETES_CLUSTER_NAME: {
                    type: "string",
                    description: "(Required) Name of Kubernetes cluster"
                },
                ADMIN_USER: {
                    type: "string",
                    description: "(Required) VM admin username"
                },
                SSH_KEY: {
                    type: "string",
                    description: "(Required) VM SSH Key"
                },
                KUBERNETES_VERSION: {
                    type: "string",
                    description: "(Required) Kubernetes version to deploy"
                },
                KUBERNETES_AGENT_COUNT: {
                    type: "string",
                    description: "(Required) Number of Kubernetes agents required"
                },
                KUBERNETES_VM_SIZE: {
                    type: "string",
                    description: "(Required) VM size used for cluster"
                },
                OS_DISK_SIZE_GB: {
                    type: "number",
                    description: "(Required) Disk size of VMs"
                },
                KUBERNETES_CLIENT_ID: {
                    type: "string",
                    description: "(Required) Kubernetes client ID (from Azure AD Service Principal)"
                },
                KUBERNETES_CLIENT_SECRET: {
                    type: "string",
                    description: "(Required) Kubernetes client secret (from Azure AD Service Principal)"
                },
                KUBE_DASHBOARD_ENABLED: {
                    type: "boolean",
                    description: "(Optional) Is the Kubernetes Dashboard enabled?. Defaults to false",
                    default: false
                },
                RBAC_ENABLED: {
                    type: "bool",
                    description: "(Optional) Enable Kubernetes Role-Based Access Control. Defaults to true",
                    default: true
                },
                AUTO_SCALING_ENABLED: {
                    type: "bool",
                    description: `(Optional) Should the Kubernetes Auto Scaler be enabled for this Node Pool? Defaults to ${answers.autoScalingEnabled}.`,
                    default: answers.autoScalingEnabled
                },
                AUTO_SCALING_MIN_COUNT: {
                    type: "number",
                    description: `(Optional) The minimum number of nodes which should exist in this Node Pool. If specified this must be between 1 and 100. Defaults to ${answers.minNodeCount}.`,
                    default: answers.minNodeCount
                },
                AUTO_SCALING_MAX_COUNT: {
                    type: "number",
                    description: `(Optional) The maximum number of nodes which should exist in this Node Pool. If specified this must be between 1 and 100. Defaults to ${answers.maxNodeCount}.`,
                    default: answers.maxNodeCount
                },
                VNET_ADDRESS_SPACE: {
                    type: "string",
                    description: ("(Required) VNET Address space")
                },
                VNET_CLUSTER_CIDR: {
                    type: "string",
                    description: ("(Required) Cluster Subnet CIDR. Should be part of the VNET_ADDRESS_SPACE vnet")
                },
                VNET_SERVICE_CIDR: {
                    type: "string",
                    description: ("(Required) Service Subnet CIDR. Should be part of the VNET_ADDRESS_SPACE vnet")
                }
            }
        }

        if (answers.networkConfig.ingressSubnet) {
            variables.variable.VNET_INGRESS_CIDR = {
                type: "string",
                description: ("(Required) Service Subnet CIDR. Should be part of the VNET_ADDRESS_SPACE vnet")
            };
        }

        if (!terraform.isDependency(answers.resourceGroup)) {
            variables.variable.AKS_RESOURCE_GROUP_NAME = {
                type: "string",
                description: ("(Required) The name of the resource group. Must be unique on your Azure subscription.")
            };
        }

        terraform.writeVariables(variables);
    }
}