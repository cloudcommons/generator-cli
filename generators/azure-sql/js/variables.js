var terraform = require('../../../common/terraform');

module.exports = {
    copy: function (fs, answers, configFile = 'variables.tf.json') {
        var variables = {
            "variable": {
                SQL_LOCATIONS: {
                    type: "list(string)",
                    description: ("(Required) List of locations on which SQL should be deployed")
                },
                SQL_NAME_PREFIX: {
                    type: "string",
                    description: "(Required) SQL Server name prefix"
                },
                SQL_VERSION: {
                    type: "string",
                    description: "(Optional) SQL Azure version. Defaults to 12.0",
                    default: "12.0"
                },
                SQL_ADMIN_LOGIN: {
                    type: "string",
                    description: "(Required) SQL Server default login"
                },
                SQL_ADMIN_PASSWORD: {
                    type: "string",
                    description: "(Required) SQL Server default password. This property is ignored once created."
                }
            }
        }

        if (!terraform.isDependency(answers.resourceGroup)) {
            variables.RESOURCE_GROUP_NAME = {
                type: "string",
                description: ("(Required) The name of the resource group. Must be unique on your Azure subscription.")
            };
        }

        terraform.writeVariables(fs, variables);
    }
}