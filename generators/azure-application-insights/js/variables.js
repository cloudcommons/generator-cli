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
                APP_INSIGHTS_TYPE: {
                    type: "string",
                    description: " (Required) Specifies the type of Application Insights to create. Valid values are ios for iOS, java for Java web, MobileCenter for App Center, Node.JS for Node.js, other for General, phone for Windows Phone, store for Windows Store and web for ASP.NET. Please note these values are case sensitive; unmatched values are treated as ASP.NET by Azure. Changing this forces a new resource to be created."
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