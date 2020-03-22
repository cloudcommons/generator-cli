module.exports = {
    copy: function (terraform, answers, configFile = 'variables.tf.json') {
        var variables = {
            "variable": {
                DNS_ZONE_NAME: {
                    type: "string",
                    description: ("(Required) DNS Zone name")
                }
            }
        }

        if (!terraform.isDependency(answers.resourceGroup)) {
            variables.variable.RESOURCE_GROUP_NAME = {
                type: "string",
                description: ("(Required) The name of the resource group.")
            };
        } 

        terraform.writeVariables(variables);
    }
}