var terraform = require('../../../common/terraform');

module.exports = {
    copy: function (fs, answers, configFile = 'variables.tf.json') {
        var variables = {
            "variable": {
                APP: {
                    type: "string",
                    description: "Application this resource belongs to"
                },
                RESOURCE_GROUP_NAME: {
                    type: "string",
                    description: ("(Required) The name of the resource group. Must be unique on your Azure subscription.")
                },
                LOCATION: {
                    type: "string",
                    description: (" (Required) The location where the resource group should be created. For a list of all Azure locations, please consult this link or run az account list-locations --output table.")
                }
            }
        }

        terraform.writeVariables(fs, variables);
    }
}