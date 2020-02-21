module.exports = {
    copy: function (terraform, answers) {
        var key = `module.${answers.name}-kubernetes`;
        var output = {
            output: {
                // AKS_ID: {
                //     description: 'The Kubernetes Managed Cluster ID.',
                //     value: terraform.toVariable(`${key}.id`)
                // },
                // AKS_FQDN: {
                //     description: 'The FQDN of the Azure Kubernetes Managed Cluster',
                //     value: terraform.toVariable(`${key}.fqdn`)
                // },
                // AKS_PRIVATE_FQDN: {
                //     description: 'The FQDN of the Azure Kubernetes Managed Cluster',
                //     value: terraform.toVariable(`${key}.private_fqdn`)
                // },
                // AKS_KUBE_ADMIN_CONFIG: {
                //     description: " A kube_admin_config block as defined below. This is only available when Role Based Access Control with Azure Active Directory is enabled.",
                //     value: terraform.toVariable(`${key}.kube_admin_config`),
                //     sensitive: true
                // },
                // AKS_KUBE_ADMIN_CONFIG_RAW: {
                //     description: "  Raw Kubernetes config for the admin account to be used by kubectl and other compatible tools. This is only available when Role Based Access Control with Azure Active Directory is enabled.",
                //     value: terraform.toVariable(`${key}.kube_admin_config_raw`),
                //     sensitive: true
                // }                
                AKS_KUBE_CONFIG: {
                    description: "A kube_config block",
                    value: terraform.toVariable(`${key}.kube_config_raw`),
                    sensitive: true
                },
                AKS_KUBE_CONFIG_RAW: {
                    description: "Raw Kubernetes config to be used by kubectl and other compatible tools",
                    value: terraform.toVariable(`${key}.kube_config_raw`),
                    sensitive: true
                }
                // AKS_HTTP_APPLICATION_ROUTING: {
                //     description: "A http_application_routing block",
                //     value: terraform.toVariable(`${key}.http_application_routing`)
                // },
                // AKS_NODE_RESOURCE_GROUP: {
                //     description: "The auto-generated Resource Group which contains the resources for this Managed Kubernetes Cluster",
                //     value: terraform.toVariable(`${key}.node_resource_group`)
                // }                                
            }
        }

        terraform.writeOutput(output);
    }
}

