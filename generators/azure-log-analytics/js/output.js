module.exports = {
    copy: function (terraform, answers) {
        var output = {
            output: {
                LOG_ANALYTICS_ID: {
                    description: "The Log Analytics Workspace ID.",
                    value: terraform.toVariable(`azurerm_log_analytics_workspace.${answers.name}.id`)
                },
                LOG_ANALYTICS_PRIMARY_SHARED_KEY: {
                    description: "The Primary shared key for the Log Analytics Workspace.",
                    value: terraform.toVariable(`azurerm_log_analytics_workspace.${answers.name}.primary_shared_key`),
                    sensitive: true
                },     
                LOG_ANALYTICS_SECONDARY_SHARED_KEY: {
                    description: "The Secondary shared key for the Log Analytics Workspace.",
                    value: terraform.toVariable(`azurerm_log_analytics_workspace.${answers.name}.secondary_shared_key`),
                    sensitive: true
                },
                LOG_ANALYTICS_WORKSPACE_ID: {
                    description: "The Workspace (or Customer) ID for the Log Analytics Workspace.",
                    value: terraform.toVariable(`azurerm_log_analytics_workspace.${answers.name}.workspace_id`)
                },      
                LOG_ANALYTICS_PORTAL_URL: {
                    description: "The Portal URL for the Log Analytics Workspace.",
                    value: terraform.toVariable(`azurerm_log_analytics_workspace.${answers.name}.portal_url`)
                }                           
            }
        }

        terraform.writeOutput(output);
    }
}                                