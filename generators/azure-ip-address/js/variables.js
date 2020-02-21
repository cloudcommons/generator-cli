module.exports = {
    copy: function (terraform, answers, configFile = 'variables.tf.json') {
        var variables = {
            "variable": {
                IP_VERSION: {
                    type: "string",
                    description: ("(Optional) The IP Version to use, IPv6 or IPv4."),
                    default: answers.ipVersion
                },
                IP_ALLOCATION_METHOD: {
                    type: "string",
                    description: ("(Optional) The IP Version to use, IPv6 or IPv4."),
                    default: answers.ipAllocationMethod
                },                
                IP_LOCATION: {
                    type: "string",
                    description: ("(Required) The location where the IP should be created. For a list of all Azure locations, please consult this link or run az account list-locations --output table.")
                }
            }
        };

        if (!terraform.isDependency(answers.resourceGroup)) {
            variables.variable.IP_RESOURCE_GROUP_NAME = {
                type: "string",
                description: ("(Required) The name of the resource group where the IP should be created on. Must be unique on your Azure subscription.")
            };
        }

        terraform.writeVariables(variables);
    }
}