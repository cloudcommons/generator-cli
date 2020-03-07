module.exports = {
    copy: function (terraform, answers, configFile = 'variables.tf.json') {
        var variables = {
            "variable": {
                RESOURCE_GROUP_NAME: {
                    type: "string",
                    description: ("(Required) The name of the resource group. Must be unique on your Azure subscription.")
                },
                LOCATION: {
                    type: "string",
                    description: (" (Required) The location where the resource group should be created. For a list of all Azure locations, please consult this link or run az account list-locations --output table.")
                },
                LOG_ANALYTICS_RENTION_DAYS: {
                    type: "number",
                    description: " (Optional) The workspace data retention in days. Possible values range between 30 and 730. Defaults to 30",
                    default: 30
                }
            }
        }

        if (!terraform.isDependency(answers.resourceGroup)) {
            variables.variable.RESOURCE_GROUP_NAME = {
                type: "string",
                description: ("(Required) The name of the resource group. Must be unique on your Azure subscription.")
            };
        }

        terraform.writeVariables(variables);
    }
}